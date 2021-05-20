const logger = require('../../utils/logger');
const { prefix } = require('../../config.json');


module.exports = {
    name: 'announce',
    description: 'Sends the message every text channel in guild',
    guildOnly: true,
    args: true,
    aliases: ['broadcast', 'publish'],
    usage: '<message content>',
    permissions: 'ADMINISTRATOR',
    category: 'Moderation',
    type: 'general',
    execute(message, args) {
        logger.debug(`Announce command has been used at guild:${message.guild.id} by:${message.author.id}`);

        let startWith;
        if (message.content.startsWith(prefix + 'announce'))
            startWith = 10;
        else if (message.content.startsWith(prefix + 'broadcast'))
            startWith = 11;
        else
            startWith = 9;

        const content = message.content.substring(startWith);

        message.guild.channels.cache.forEach((channel => {
            if (channel.type === 'text') {
                if (!(message.guild.rulesChannelID && message.guild.rulesChannelID !== channel.id))
                    channel.send(content);
            }
        }));

    }
};