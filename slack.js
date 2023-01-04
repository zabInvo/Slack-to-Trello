require("dotenv").config();

const { WebClient } = require("@slack/web-api");
const e = require("express");
const slackToken = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(slackToken);

const createTrelloCard = require("./trelloApi").createTrelloCard;
const replyOnTrelloCard = require("./trelloApi").replyOnTrelloCard;

const mappingModel = require('./models').Mapping;
const slackToTrelloModel = require('./models').SlackToTrello;

const slackMessageEv = async (ev) => {
    if ((ev.type === 'message' && !ev.subtype) || (ev.type === 'message' && ev.subtype === "file_share")) {
        if (ev.thread_ts) {
            await replyOnTrelloCard(ev);
        }
        else {
            await createTrelloCard(ev);
        }
    }
};

const updateActivityOnSlack = async (event, type) => {
    console.log("updateActivityOnSlack", event);
    try {
        if (type === 'commentCard') {
            const isMapped = await slackToTrelloModel.findOne({
                where: {
                    boardId: event.data.board.id
                },
            });
            if (isMapped) {
                console.log('isMapped',isMapped);
                const channelId = isMapped.channelId;
                console.log("This is channel id" , channelId);
                const cardMapping = await mappingModel.findOne({
                    where: {
                        cardId: event.data.card.id
                    },
                });
                if (cardMapping) {
                    const slackPostId = cardMapping.postId;
                    console.log("channelId",channelId);
                    console.log("slackPostId",slackPostId);

                    const postComment = await web.chat.postMessage({
                        channel: channelId,
                        thread_ts: slackPostId,
                        text: "Comment Posted:",
                        'blocks': [
                            {
                                "type": "section",
                                "text": {
                                    "type": "mrkdwn",
                                    "text": `*${event.memberCreator.fullName}*\n ${event.data.text}`
                                }
                            },
                        ]
                    });
                    console.log("postComment",postComment);
                } else {
                    console.log("Error: Post is not mapped with any card");
                }
            } else {
                console.log("Error: Channel is not mapped with any board");
            }
        } else if (type === 'updateCard') {

        } else if (type === 'addMemberToCard') {

        } else if (type === 'removeMemberFromCard') {

        } else if (type === 'deleteCard') {

        }
    } catch (error) {
        console.log("Error While updateActivityOnSlack : ", error)
    }
}


module.exports = {
    slackMessageEv,
    updateActivityOnSlack
};