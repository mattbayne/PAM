const express = require("express");
const app = express();
const { google } = require('googleapis');
const moment = require('moment');
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const {OpenAIApi, Configuration} = require("openai");
const wkhtmltopdf = require("wkhtmltopdf");
const {getUserProfile, createUserProfile, updateUserProfilePicture} = require("./data/mongo");
const {getTokens, cacheTokens} = require("./data/redis/Redis");
const {itineraryDirective} = require("./itinerary");
const fs = require("fs");

require('dotenv').config();

app.use(express.json());  // do we need both of these?
app.use(bodyParser.json());
app.use(cors());

// Configure OpenAI API key
const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_KEY,
    })
);

// // Configure SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_KEY);

app.post("/convert-to-pdf", (req, res) => {
    const htmlString = req.body.html; // Get the HTML string from the request body

    // Convert the HTML string to a PDF
    const pdfStream = wkhtmltopdf(htmlString, { pageSize: "letter" });

    // Set the response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=output.pdf");

    // Pipe the PDF stream directly to the response
    pdfStream.pipe(res);

    // Handle errors on the PDF stream
    pdfStream.on("error", (err) => {
        console.error("Error converting HTML to PDF:", err);
        // res.status(500).json({ error: "Failed to create PDF" });
        // Abort the response and log the error
        res.destroy(new Error('Failed to create PDF'));
    });
});

app.post("/api/proofread-text", async (req, res) => {
    const { text, style, tone } = req.body;

    let content;
    if (style !== 'n/a' && tone !== 'n/a') {
        content = `Proofread this text: '${text}.' Make sure the style is ${style} and tone is ${tone}.`;
    }
    else if (style === 'n/a' && tone === 'n/a') {
        content = `Proofread this text: '${text}'.`;
    }
    else if (style === 'n/a') {
        content = `Proofread this text: '${text}.' Make sure the tone is ${tone}.`;
    }
    else {
        content = `Proofread this text: '${text}.' Make sure the style is ${style}.`;
    }

    try {
        const openaiResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: content + ' Below the result, list out all the changes you made. If the text does not make sense to proofread, respond saying that it does not make sense to proofread. If the text looks correct, respond accordingly.' }]
        });

        const proofreadText = openaiResponse.data.choices[0].message.content.trim();

        res.status(200).json({ success: true, proofreadText: proofreadText });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to proofread text." });
    }
});


app.post("/api/generate-email", async (req, res) => {
    const { purpose, recipientName, displayName } = req.body;

    try {
        // Generate email content using OpenAI API
        const openaiResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: `Generate an email for the following purpose: ${purpose}. Please ensure that the first line of your response is the subject line, without explicitly including 'Subject: '. Simply provide the subject text. Use salutation 'Dear ${recipientName}. The signature name will be '${displayName}'`}],
        });

        const generatedEmail = openaiResponse.data.choices[0].message.content.trim();

        res.status(200).json({ success: true, emailContent: generatedEmail });
    } catch (error) {
        res.status(500).json({ success: false, message: "Email generation failed." });
    }
});

function getDateStr() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


app.get('/api/get-itinerary-file', async (req, res) => {
    const { email } = req.query;
    const fileName = `${email}~itinerary_${getDateStr()}.pdf`

    const path = `itineraries/${fileName}`
    if (!fs.existsSync(path)) {
        res.status(404).json({"error": "itinerary file does not exist"});
    } else {
        res.json({'fileName': fileName})
    }
})


app.post('/api/generate-itinerary', async (req, res) => {
    const { email, name } = req.body;
    const outputFileName = `${email}~itinerary_${getDateStr()}.pdf`

    try {
        const events = await getUserEvents(email);
        const directive = itineraryDirective(name, JSON.stringify(events));
        const openaiResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: 'user', content: directive}],
        });
        const htmlString = openaiResponse.data.choices[0].message.content.trim().replace(/\n/g, ' ');
        // res.json({'itinerary': htmlString})
        wkhtmltopdf(htmlString, {
            pageSize: "letter",
            output: `itineraries/${outputFileName}`
        });
        res.json({
            "path": outputFileName,
        })
    } catch (e) {
        res.status(500).json({"error": `failed to generate itinerary: ${e}`})
    }
})

app.get('/api/get-itinerary/:fileName', async (req, res) => {

    const {fileName} = req.params;
    const path = `itineraries/${fileName}`
    if (!fs.existsSync(path)) {
        res.status(404).json({"error": "itinerary file does not exist"});
        return
    }

    const base64str = fs.readFileSync(path).toString("base64")

    res.type('application/pdf');
    res.header('Content-Disposition', `attachment; filename="itinerary.pdf"`);
    res.send(Buffer.from(base64str, 'base64'));
})


app.post('/api/send-itinerary', async (req, res) => {
    try {
        const { email, fileName } = req.body;
        const path = `itineraries/${fileName}`
        if (!fs.existsSync(path)) {
            res.status(404).json({"error": "itinerary file does not exist"});
            return
        }
        const attachment = fs.readFileSync(path).toString("base64")
        const msg = {
            to: email,
            from: "nlespera@stevens.edu",
            subject: "This weeks itinerary",
            text: "See attached!",
            attachments: [
                {
                    content: attachment,
                    filename: "itinerary.pdf",
                    type: "application/pdf",
                    disposition: "attachment"
                }
            ]
        };
        await sgMail.send(msg);
        res.json({"success": true})
    } catch (e) {
        res.status(500).json({'error': e})
    }
})


app.post("/api/send-email", async (req, res) => {
    const { email, subject, body } = req.body;

    try {
        const msg = {
            to: email,
            from: "nlespera@stevens.edu",
            subject: subject,
            text: body,
            html:`<p>${body.replace(/\n/g, '<br>')}</p>`,
        };

        await sgMail.send(msg);

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Email sending failed." });
    }
});

app.post("/api/generate-day-itinerary", async (req, res) => {
    const { events, date } = req.body;

    try {
        // Generate itinerary content using OpenAI API
        const openaiResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: `Generate an itinerary around the following events: ${events}. Have the first line of the itinerary be Itinerary for ${date}`}],
        });

        const generatedItinerary = openaiResponse.data.choices[0].message.content.trim();

        res.status(200).json({ success: true, itineraryContent: generatedItinerary });
    } catch (error) {
        res.status(500).json({ success: false, message: "Itinerary generation failed." });
    }
});

app.get("/user/:email", async (req, res) => {
    const {email} = req.params;

    let userData;
    try {
        userData = await getUserProfile(email);
    } catch (e) {
        console.log(e);
        res.status(500).json({error: 'failed to get user information'})
        return
    }
    if (userData === null) {
        console.log("user does not exist in mongo, initializing...")
        userData = await createUserProfile(email)
    }
    res.json(userData)
})

app.post("/user/:email/picture", async (req, res) => {
    const {email} = req.params;
    const { profileImage } = req.body

    if (profileImage === null) {
        res.status(400).json({error: "a profile image url must be provided"})
    }


    let userData;
    try {
        userData = await getUserProfile(email);
    } catch (e) {
        console.log(e);
        res.status(500).json({error: 'failed to get user information'})
        return
    }
    if (userData === null) {
        console.log("user does not exist in mongo, initializing w/ profile image")
        userData = await createUserProfile(email, {profileImage: profileImage})
    } else {
        console.log("updating existing user profile")
        userData = await updateUserProfilePicture(email, profileImage)
    }
    res.json(userData)
})


// google oauth2 credentials
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'http://localhost:3001/oauth2callback'
);

// get users events for the current week
app.get('/events/', async (req, res) => {
    try {
        // Authorize the user with Google OAuth2
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar.readonly'],
            state: JSON.stringify({ redirectUrl: '/events', testState: 'nicholai@gmail.com'}),
            redirect_uri: 'http://localhost:3001/oauth2callback'
        });
        res.redirect(authUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


async function getEvents(tokens) {
    oauth2Client.setCredentials(tokens);

    // Get the user's events for the current week
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const now = moment();
    const startOfWeek = now.startOf('week').format('YYYY-MM-DDTHH:mm:ssZ');
    const endOfWeek = now.endOf('week').format('YYYY-MM-DDTHH:mm:ssZ');
    const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfWeek,
        timeMax: endOfWeek,
        singleEvents: true,
        orderBy: 'startTime'
    });

    return events.data.items
}


async function getUserEvents(email) {
    const tokens = await getTokens(email);
    // validate tokens here
    return await getEvents(tokens)
}


async function getUserTokens(req, res, next) {
    const { email } = req.params
    try {
        res.json({
            'auth': true,
            'events': await getUserEvents(email),
        })
    } catch (e) {
        next()
    }
}


app.get('/calendarAuth/:email', [getUserTokens, async (req, res) => {
    const { email } = req.params
    try {
        // Authorize the user with Google OAuth2
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar.readonly'],
            state: JSON.stringify({ redirectUrl: '/events', email: email}),
            redirect_uri: 'http://localhost:3001/oauth2callback'
        })
        res.json({
            'auth': false,
            'authUrl': authUrl,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}]);


app.get('/oauth2callback', async (req, res) => {
    const { code, state } = req.query;
    const {email} = JSON.parse(state)
    const { tokens } = await oauth2Client.getToken(code);

    if (code === null || tokens === null) {
        res.status(500).json({'error': 'failed to get tokens'})
    }

    await cacheTokens(email, JSON.stringify(tokens))
    res.redirect("http://localhost:3000")
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("We've now got a server!");
    console.log(`Your routes will be running on http://localhost:${PORT}`);
});
