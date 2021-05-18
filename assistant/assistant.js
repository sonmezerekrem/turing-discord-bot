const { prefix } = require('../config.json');

function assist(message) {
    message.channel.send(`I am sorry. My chat features still under development. It will be ready soon. You can use **${prefix}end-assist** command to end assisting.`);
}

module.exports = assist;