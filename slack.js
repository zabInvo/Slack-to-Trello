require("dotenv").config();

const { WebClient } = require("@slack/web-api");
const slackToken = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(slackToken);

const interactivityTest = async (req, res) => {
    try {
        console.log("This is request form", req.body);
        let card = new Array();

        if(resolvePipe(req.body.text) === -1){
            res.status(200).json({
                "text": "Error: Invalid format!",
            })
        } 
        else if(resolvePipe(req.body.text) === -2){
            res.status(200).json({
                "text": "Error: Empty Fields are not allowed!",
            })
        } 
        else {
            card = resolvePipe(req.body.text);
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
                                "text": "*Card Tile* : " + card[0],
                            }
                        ]
                    },
                    {
                        "type": "section",
                        "block_id": "section788",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "*Description* : " + card[1],
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
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ messages: "Internal Server Error", error: error });
    }
};

function resolvePipe(toConvert) {
    if(toConvert.split("|").length === 4){
        const [name, desc, board, list] = toConvert.split("|");
        if(name.length == 0 || desc.length == 0 || board.length == 0 || list.length == 0) {
            return -1 // 'Empty fields not allowed'
        }
        else {
            return [name, desc, board, list]
        };
    }
    else {
        return -2 // 'Invalid Format'
    }
}
module.exports = {
    interactivityTest
};