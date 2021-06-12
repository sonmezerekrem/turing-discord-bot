const logger = require('../../utils/logger');
const api = require('../../utils/api');


module.exports = {
    name: 'issue',
    description: 'Report an issue about bot functionality',
    guildOnly: true,
    args: false,
    aliases: ['report', 'bug'],
    usage: '',
    category: 'Other',
    type: 'general',
    cooldown: 60,
    execute(message) {
        logger.debug(`Issue command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const report = {
            guild: message.guild.id,
            guildname: message.guild.name,
            user: message.author.id,
            username: message.author.username,
            time: new Date().toString(),
            content: message.content
        };

        api.reportIssue(report);

        return message.channel.send('Thank you for reporting this issue. My developers will analyze this issue.');
    }
};
