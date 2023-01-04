require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;

// For Locally use of https cert instead of http
const fs = require("fs");
const https = require("https");
const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");

const trelloIntegration = require("./trello");
const server = https.createServer({ key, cert }, app);

// Slack live-events setup!.
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(slackSigningSecret);
const slackMessageEv = require("./slack").slackMessageEv;
app.use("/slack/events", slackEvents.requestListener());
slackEvents.on("message", slackMessageEv);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("You land on a wrong planet, no one lives here.");
});

trelloIntegration();

server.listen(port, () => {
    console.log(`App is listening at ${port}`);
});

module.exports = app;