const logger = require('../../utils/logger');


module.exports = {
    name: 'issue',
    description: 'Report an issue about bot functionality',
    guildOnly: true,
    args: false,
    aliases: ['report', 'bug'],
    usage: '',
    category: 'Other',
    type: 'general',
    execute(message, args) {
        logger.debug(`Issue command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const guild = message.guild;

        if (guild.id === '840619177739419649') {
            if (message.channel.id !== '842156525635108874') {
                return message.channel.send(`Please use **${guild.channels.cache.find(channel => channel.name === 'bug-reporting')}** to use issue command.`);
            }
            logger.info(`An issue reported by ${message.author.id} at guild ${guild.id}. Issue: ${message.content}`);
            return message.channel.send(`Thank you for reporting this issue. My developers will be analyze this issue.`);
        }

        logger.info(`An issue reported by ${message.author.id} at guild ${guild.id}. Issue: ${message.content}`);
        return message.channel.send(`Thank you for reporting this issue. My developers will be analyze this issue.`);

    }
};