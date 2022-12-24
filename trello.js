const Trello = require("trello-events");
const trelloApiKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;

module.exports = () => {

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

    trello.on('updateCard', function (event, boardId) {
        console.log("This is updateCard event", event);
    });

    trello.on('addMemberToBoard', function (event, boardId) {
        console.log("This is addMemberToBoard event", event);
    });

    trello.on('addCommentToCard', function (event, boardId) {
        console.log("This is addCommentToCard event", event);
    });

    trello.on('addMemberToCard', function (event, boardId) {
        console.log("This is addMemberToCard event", event);
    });

    trello.on('removeMemberFromCard', function (event, boardId) {
        console.log("This is removeMemberFromCard event", event);
    });

}