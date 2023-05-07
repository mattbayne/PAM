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
const axios = require("axios");
const {getTokens, cacheTokens} = require("./data/redis/Redis");

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
        res.status(500).json({ error: "Failed to create PDF" });
    });
});


app.post("/api/generate-email", async (req, res) => {
    const { purpose, recipientName } = req.body;

    try {
        // Generate email content using OpenAI API
        const openaiResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: `Generate an email for the following purpose: ${purpose}. Please ensure that the first line of your response is the subject line, without explicitly including 'Subject: '. Simply provide the subject text. Use salutation 'Dear ${recipientName}.`}],
        });

        const generatedEmail = openaiResponse.data.choices[0].message.content.trim();

        res.status(200).json({ success: true, emailContent: generatedEmail });
    } catch (error) {
        res.status(500).json({ success: false, message: "Email generation failed." });
    }
});


app.post("/api/send-email", async (req, res) => {
    const { email, subject, body } = req.body;

    console.log('email', email);
    console.log('subject', subject);
    console.log('body', body);

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
        console.log(error.response.body);
        res.status(500).json({ success: false, message: "Email sending failed." });
    }
});


app.get("/user/:email", async (req, res) => {
    const {email} = req.params;
    console.log(`getting data for email: `, email)

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
    console.log(`found: `, userData)
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
    console.log(`found: `, userData)
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


async function getUserTokens(req, res, next) {
    const { email } = req.params
    try {
        const tokens = await getTokens(email);
        // validate tokens here
        const events = await getEvents(tokens)
        res.json({
            'auth': true,
            'events': events,
        })
    } catch (e) {
        console.log(`middleware failed: `, e)
        next()
    }
}

// first check tokens, if tokens exist and are valid, return that in the json, otherwise return authUrl
app.get('/calendarAuth/:email', [getUserTokens, async (req, res) => {
    console.log('in main cal func')
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

// app.get('/storeTokens', async (req, res) => {
app.get('/oauth2callback', async (req, res) => {
    const { code, state } = req.query;
    const {email} = JSON.parse(state)
    const { tokens } = await oauth2Client.getToken(code);

    if (code === null || tokens === null) {
        res.status(500).json({'error': 'failed to get tokens'})
    }

    await cacheTokens(email, JSON.stringify(tokens))
    res.send("You've successfully authorized google calendar, you can now return to PAM!")
})

// handle the google oauth2 callback
// app.get('/oauth2callback', async (req, res) => {
//     // console.log(`params: `, req.params)
//     // console.log(`query: `, req.query)
//     // const state = req.query['state'];
//     // console.log(state)
//
//     // const {testState} = JSON.parse(state)
//     // console.log(`I parsed an email out of the state: `, testState)
//
//     try {
//         const { code } = req.query;
//
//         // Exchange the authorization code for an access token and refresh token
//         const { tokens } = await oauth2Client.getToken(code);
//
//         console.log(`tokens: `, tokens)
//
//         // Set the access token on the OAuth2 client
//         oauth2Client.setCredentials(tokens);
//
//         // Get the user's events for the current week
//         const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
//         const now = moment();
//         const startOfWeek = now.startOf('week').format('YYYY-MM-DDTHH:mm:ssZ');
//         const endOfWeek = now.endOf('week').format('YYYY-MM-DDTHH:mm:ssZ');
//         const events = await calendar.events.list({
//             calendarId: 'primary',
//             timeMin: startOfWeek,
//             timeMax: endOfWeek,
//             singleEvents: true,
//             orderBy: 'startTime'
//         });
//
//         // Return the user's events as JSON
//         console.log('events', events.data.items)
//         res.json(events.data.items);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("We've now got a server!");
    console.log(`Your routes will be running on http://localhost:${PORT}`);
});
