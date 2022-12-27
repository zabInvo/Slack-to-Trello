require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Trello = require("trello-events");
const port = process.env.PORT || 8080;
const trelloApiKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;

const { createCard, createReply } = require('./trelloApi');
createCard({
    heading: 'Assalam o alaikum from node side!',
    description: "This is a test card!!",
}, '63a2dcc1ba3b6805237ed321');

// For Locally use of https cert instead of http
const fs = require("fs");
const https = require("https");
const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");

const interactivity = require("./slack").interactivityTest;

const server = https.createServer({ key, cert }, app);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("You land on a wrong planet, no one lives here.");
});

app.post("/interactivity", interactivity);

const trello = new Trello({
    pollFrequency: 1000 * 60,
    minId: 0,
    start: true,
    trello: {
        boards: ['63a2a0e50efce800a6863706', '63a3005f026382044d778b41'],
        key: trelloApiKey,
        token: trelloToken,
    },
});
app.set('trello', trello);

server.listen(port, () => {
    console.log(`App is listening at ${port}`);
});

module.exports = app;