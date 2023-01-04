const axios = require("axios");
const Trello = require("trello-events");
const trelloApiKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;

const slackToTrelloModel = require("./models").SlackToTrello;
const slackCommentIds = require("./trelloApi").slackCommentIds;
const updateActivityOnSlack = require("./slack").updateActivityOnSlack;

module.exports = async () => {
    const getAllDataFromTrello = await axios.get(`https://api.trello.com/1/members/me/boards?key=${trelloApiKey}&token=${trelloToken}`);
    const trelloData = getAllDataFromTrello.data;
    for (let i = 0; i < trelloData.length; i++) {
        const boardExist = await slackToTrelloModel.findOne({
            where: {
                boardId: trelloData[i].id,
            },
        });
        if (!boardExist) {
            const payload = {
                boardId: trelloData[i].id,
                boardName: trelloData[i].name,
                organizationId: trelloData[i].idOrganization,
            };
            await slackToTrelloModel.create(payload);
        }
    }

    const getTrelloBoards = await slackToTrelloModel.findAll();
    const allTrelloBoards = [];
    getTrelloBoards.forEach((item) => {
        allTrelloBoards.push(item.boardId);
    })

    const trello = new Trello({
        pollFrequency: 100 * 60,
        minId: 0,
        start: true,
        trello: {
            boards: allTrelloBoards,
            key: trelloApiKey,
            token: trelloToken,
        },
    });

    setTimeout(() => {
        trello.on('commentCard', function (event, boardId) {
            if (!slackCommentIds.includes(event.id)) {
                updateActivityOnSlack(event, 'commentCard');
            }
        });

        trello.on('updateCard', function (event, boardId) {
            updateActivityOnSlack(event, 'updateCard');
        });

        trello.on('addMemberToCard', function (event, boardId) {
            updateActivityOnSlack(event, 'addMemberToCard');
        });

        trello.on('removeMemberFromCard', function (event, boardId) {
            updateActivityOnSlack(event, 'removeMemberFromCard');
        });

        trello.on('deleteCard', function (event, boardId) {
            updateActivityOnSlack(event, 'deleteCard');
        });

    }, 5000);
}