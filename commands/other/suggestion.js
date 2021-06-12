const logger = require('../../utils/logger');
const api = require('../../utils/api');


module.exports = {
    name: 'suggestion',
    description: 'Report an issue about bot functionality',
    guildOnly: true,
    args: false,
    aliases: ['advice'],
    usage: '',
    category: 'Other',
    type: 'general',
    cooldown: 60,
    execute(message) {
        logger.debug(`Suggestion command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const suggest = {
            guild: message.guild.id,
            guildname: message.guild.name,
            user: message.author.id,
            username: message.author.username,
            time: new Date().toString(),
            content: message.content
        };

        api.saveSuggestion(suggest);
        message.channel.send('Thank you for your suggestion. My developers will evaluate this suggestion.');
    }
};
