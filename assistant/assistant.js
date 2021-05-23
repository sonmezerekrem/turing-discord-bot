const { prefix } = require('../config.json');

function assist(message, assist) {
    const now = new Date();
    if (now.getTime() - assist.lastMessage.getTime() > 3600000) {
        message.client.assists.delete(message.author.id);
    }
    else {
        assist.lastMessage = message.createdAt;
        message.author.send(`I am sorry. My chat features still under development. It will be ready soon. You can use **${prefix}end-assist** command to end assisting.`)
            .catch(error => logger.error(error.message));
    }
}

module.exports = assist;