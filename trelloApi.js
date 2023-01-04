const axios = require("axios");

const trelloApiKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;

const mappingModel = require('./models').Mapping;
const slackToTrelloModel = require('./models').SlackToTrello;

const createTrelloCard = async (event) => {
    console.log('event', event);
    try {
        const isMapped = await slackToTrelloModel.findOne({
            where: {
                channelId: event.channel
            }
        });
        if (isMapped) {
            const boardId = isMapped.boardId;
            const getListIds = await axios.get(`https://api.trello.com/1/boards/${boardId}/lists?key=${trelloApiKey}&token=${trelloToken}`);
            const createCard = await axios.post(`https://api.trello.com/1/cards?idList=${getListIds.data[0].id}&name=${event.text.split("\n")[0]}&desc=${event.text.split("\n")[1]}&key=${trelloApiKey}&token=${trelloToken}`, {
                Accept: "application/json"
            });
            const cardId = createCard.data.id;
            const postId = event.event_ts;
            const payload = {
                cardId,
                postId
            };
            await mappingModel.create(payload);
            console.log("Card Created Successfully");
        } else {
            console.log("Error: Channel is not mapped with any board");
        }
    } catch (error) {
        console.log(`ERR:`, error);
    }
}

let slackCommentIds = [];
const replyOnTrelloCard = async (event) => {
    console.log('replyOnTrelloCard', event);
    try {
        const isMapped = await slackToTrelloModel.findOne({
            where: {
                channelId: event.channel
            }
        });
        if (isMapped) {
            const cardMapping = await mappingModel.findOne({
                where: {
                    postId: event.thread_ts
                },
            });
            if (cardMapping) {
                const postReply = await axios.post(`https://api.trello.com/1/cards/${cardMapping.cardId}/actions/comments?text=${event.text}&key=${trelloApiKey}&token=${trelloToken}`, {
                    Accept: "application/json"
                })
                console.log("Reply Posted Successfully");
                slackCommentIds.push(postReply.data.id);
            }
            else {
                console.log("Error: Post is not mapped with any card");
            }
        }
        else {
            console.log("Error: Channel is not mapped with any board");
        }
        return;
    } catch (error) {
        console.log(`Error:`, error);
    }
}

module.exports = {
    createTrelloCard,
    replyOnTrelloCard,
    slackCommentIds
}