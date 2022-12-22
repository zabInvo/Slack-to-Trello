require("dotenv").config();

const { WebClient } = require("@slack/web-api");
const slackToken = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(slackToken);

const interactivityTest = async (req, res) => {
    try {
        console.log("This is request form", req.body);

        res.status(200).json({
            "text": "Card Created Sucessfully",
        });

        const result = await web.chat.postMessage({
            channel: req.body.channel_id,
            text: 'Hello World New',
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Trello Card Created:*"
                    }
                },
                {
                    "type": "section",
                    "block_id": "section789",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Card Tile* : Slack Integration With Trello",
                        }
                    ]
                },
                {
                    "type": "section",
                    "block_id": "section788",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Description* : Design a node.js app that communicates/binds data between slack and Trello",
                        }
                    ]
                },
                {
                    "type": "section",
                    "block_id": "section778",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": `*Created by* : ${req.body.user_name}`,
                        }
                    ]
                }
            ]
        });

        const reply = await web.chat.postMessage({
            channel: req.body.channel_id,
            thread_ts: result.message.ts,
            text: "Hello again :wave:"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ messages: "Internal Server Error", error: error });
    }
};


module.exports = {
    interactivityTest
};