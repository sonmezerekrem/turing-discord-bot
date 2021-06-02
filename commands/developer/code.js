const logger = require('../../utils/logger');


module.exports = {
    name: 'code',
    description: 'Sends message in code format with mentioning the author',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '',
    category: 'Developer',
    type: 'general',
    execute(message) {
        logger.debug(`Code command has been used at guild:${message.guild.id} by:${message.author.id}`);

        message.delete();
        message.channel.send(`By ${message.author}
>>> ${message.content.substring(6)}`);
    }
};
