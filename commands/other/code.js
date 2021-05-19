const logger = require('../../utils/logger');
const { turing, bugReporting } = require('../../config.json');


module.exports = {
    name: 'code',
    description: 'Sends message in code format with mentioning the author',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '',
    category: 'Other',
    type: 'general',
    execute(message, args) {
        logger.debug(`Code command has been used at guild:${message.guild.id} by:${message.author.id}`);

        message.delete();
        message.channel.send(`By ${message.author}
>>> ${message.content.substring(6)}`);

    }
};