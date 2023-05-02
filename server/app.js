const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const {OpenAIApi, Configuration} = require("openai");
require('dotenv').config();


app.use(bodyParser.json());
app.use(cors());

console.log(process.env.OPENAI_KEY);

// Configure OpenAI API key
const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_KEY,
    })
);

// // Configure SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_KEY);

app.post("/api/generate-email", async (req, res) => {
    const { purpose } = req.body;
    console.log('purpose', purpose);

    try {
        // Generate email content using OpenAI API
        const openaiResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: `Generate an email for the following purpose: ${purpose}. Make sure the first line in your response is the Subject.` }],
        });


        const generatedEmail = openaiResponse.data.choices[0].message.content.trim();

        // console.log(generatedEmail);

        res.status(200).json({ success: true, emailContent: generatedEmail });
    } catch (error) {
        console.log(error);
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
            from: "mscoli44@gmail.com",
            subject: subject,
            text: body,
            html: `<p>${body}</p>`,
        };

        await sgMail.send(msg);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.response.body);
        res.status(500).json({ success: false, message: "Email sending failed." });
    }
});

app.listen(4000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:4000");
});
