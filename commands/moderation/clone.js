const logger = require('../../utils/logger');


module.exports = {
    name: 'clone',
    description: 'Creates a clone of current text channel',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    permissions: 'MANAGE_CHANNELS',
    category: 'Moderation',
    type: 'general',
    execute(message) {
        logger.debug(`Clone command has been used at guild:${message.guild.id} by:${message.author.id}`);

        try {
            message.channel.clone();
            message.channel.send(`A clone of ${message.channel} is created`);
        }
        catch (e) {
            logger.error(e.message);
        }
    }
};