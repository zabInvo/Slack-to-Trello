const axios = require('axios');
const trelloKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;

// Trello Apis.

const createCard = async ({heading, description}, listId) => {
    try {
        const response = 
        await axios.post(`https://api.trello.com/1/cards?idList=${listId}&name=${heading}&desc=${description}&key=${trelloKey}&token=${trelloToken}`, {
            Accept: "application/json"
        })
        console.log(response);
    } catch (error) {
        console.log(`ERR: ${error}`)
    }
};

const createReply = async (message, cardId) => {
    try {
        const response = 
        await axios.post(`https://api.trello.com/1/cards/${cardId}/actions/comments?text=${message}&key=${trelloKey}&token=${trelloToken}`, {
            Accept: "application/json"
        })
        console.log(response);
    } catch (error) {
        console.log(`ERR: ${error}`)
    }
};

module.exports = {
    createCard,
    createReply
}
