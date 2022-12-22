const trello = req.app.get("trello");

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