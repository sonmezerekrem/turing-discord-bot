const logger = require('../../utils/logger');


module.exports = {
    name: 'code',
    description: 'Sends message in code format with mentioning the author.',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '',
    category: 'Tool',
    execute(message) {
        logger.debug(`Code command has been used at guild:${message.guild.id} by:${message.author.id}`);

        message.delete();
        message.channel.send(`By ${message.author}\n>>> ${message.content.substring(6)}`);
    }
};
