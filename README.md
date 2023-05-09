
# PAM

Welcome to your **Personalized Assistant & Manager** - **PAM** for short! This is our group, the Avengers, Final Project for Professor Hill's CS-554 Class at Stevens Institute of Technology .

PAM is meant to make your hectic life a bit more simple with multiple integrations all on one platform. After setting up an account in PAM, you will have access to it's numerous features including:

- **Generate Emails:** This feature will allows users to enter the email of the recipient, the recipient's name, and the purpose of the email the user intends to send. Once that information is entered, an Email Draft is generated for the user to review and, with the click of button, the email is then sent!
- **View your Calendar:** After authorizing PAM to access the users Google Calendar, with the use of Google Calendar API, the user can view all upcoming events for the week. Along with generating an itinerary based on those events and either downloading said itinerary or emailing it to the user's email!
- **Generate an Itinerary:** Similar to the generate itinerary feature used in View your Calendar, the user can also create an itinerary for a specific day with a list of Events/Activties for the day, with the click of a button, an itinerary is made for the user based on their inputs!
- **Proofread Text:** The user has the option to use AI to format and proofread text in this feature. The user selects a Style and Tone for the text they want edited, paste in the text, and with the click of button the text is reformatted as necessary!
- **HTML to PDF:** This feature allows the user to enter in HTML type text and, with the click of a button, the HTML is then converted into a PDF for downloading!


## Prerequisites

To deploy this project you must have:

- MongoDb installed and running on the default port
- Redis installed and running on the default port
- Wkhtmltopdf installed on the server (in addition to the node libraries!)


## Run Locally

Clone the project

```bash
  git clone https://github.com/mattbayne/PAM
```

Go to the project directory

```bash
  cd PAM
```

---

## Running the Server

Go to the server directory

```bash
  cd /server
```

Install Dependencies

```bash
  npm install
```

Start the Server

```bash
  npm start
```


## Running the Client

Go to the client directory

```bash
  cd /client
```

Install Dependencies

```bash
  npm install
```

Build the Project

```bash
  npm run build
```

Start the Server

```bash
  npm start
```

The localhost should open automatically and your server/client should be up and running (don't forget the prerequisites!!)

## Authors

- [@FrenchRaoul](https://github.com/FrenchyRaoul)
- [@scolicodes](https://github.com/scolicodes)
- [@cbickler](https://github.com/cbickler)
- [@mattbayne](https://github.com/mattbayne)
- [@arjun3847](https://github.com/arjun3847)

