const logger = require('../../utils/logger');
const {
    turing,
    bugReporting
} = require('../../config.json');


module.exports = {
    name: 'issue',
    description: 'Report an issue about bot functionality',
    guildOnly: true,
    args: false,
    aliases: ['report', 'bug'],
    usage: '',
    category: 'Other',
    type: 'general',
    execute(message) {
        logger.debug(`Issue command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const { guild } = message;

        if (guild.id === turing) {
            if (message.channel.id !== bugReporting) {
                try {
                    message.delete();
                    message.channel.send(`Please use **${guild.channels.cache.find((channel) => channel.name === 'bug-reporting')}** channel to use **issue** command.`)
                        .then((msg) => {
                            msg.delete({ timeout: 5000 });
                        });
                    return;
                }
                catch (e) {
                    logger.error(e.message);
                }
            }
            logger.info(`An issue reported by ${message.author.id} at guild ${guild.id}. Issue: ${message.content}`);
            return message.channel.send('Thank you for reporting this issue. My developers will  analyze this issue.');
        }

        logger.info(`An issue reported by ${message.author.id} at guild ${guild.id}. Issue: ${message.content}`);
        return message.channel.send('Thank you for reporting this issue. My developers will be analyze this issue.');
    }
};
