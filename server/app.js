const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");
const {OpenAIApi, Configuration} = require("openai");
const wkhtmltopdf = require("wkhtmltopdf");
const {getUserProfile, createUserProfile, updateUserProfilePicture} = require("./data/mongo");

require('dotenv').config();

app.use(express.json());  // do we need both of these?
app.use(bodyParser.json());
app.use(cors());

console.log('yo', process.env.OPENAI_KEY);

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
    const { purpose, recipientName, displayName } = req.body;
    console.log('purpose', purpose);
    // console.log(displayName);


    try {
        // Generate email content using OpenAI API
        const openaiResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: `Generate an email for the following purpose: ${purpose}. Please ensure that the first line of your response is the subject line, without explicitly including 'Subject: '. Simply provide the subject text. Use salutation 'Dear ${recipientName}. The signature name will be '${displayName}'`}],
        });


        const generatedEmail = openaiResponse.data.choices[0].message.content.trim();

        // console.log(generatedEmail);

        res.status(200).json({ success: true, emailContent: generatedEmail });
    } catch (error) {
        console.log(error.response.data);
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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("We've now got a server!");
    console.log(`Your routes will be running on http://localhost:${PORT}`);
});
