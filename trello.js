const axios = require("axios");
const Trello = require("trello-events");
const trelloApiKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;

module.exports = async () => {
    const allTrelloBoards = []
    const organizationId = '63a2a0bb26dbea0030f7addc';

    const getAllBoardsID = await axios.get(`https://api.trello.com/1/organizations/${organizationId}/boards?key=${trelloApiKey}&token=${trelloToken}`);
    await getAllBoardsID.data.forEach(item => {
        allTrelloBoards.push(item.id);
    });
    console.log("allTrelloBoards", allTrelloBoards);
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
        trello.on('updateCard', function (event, boardId) {
            console.log("This is updateCard event", event);
        });
    
        trello.on('addMemberToBoard', function (event, boardId) {
            console.log("This is addMemberToBoard event", event);
        });
    
        trello.on('addMemberToCard', function (event, boardId) {
            console.log("This is addMemberToCard event", event);
        });
    
        trello.on('removeMemberFromCard', function (event, boardId) {
            console.log("This is removeMemberFromCard event", event);
        });
    
        trello.on('commentCard', function (event, boardId) {
            console.log("This is commentCard event", event);
        });
    }, 5000);
}