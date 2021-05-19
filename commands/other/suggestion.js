const logger = require('../../utils/logger');
const {turing, suggestions} = require("../../config.json")


module.exports = {
    name: 'suggestion',
    description: 'Report an issue about bot functionality',
    guildOnly: true,
    args: false,
    aliases: ['advice'],
    usage: '',
    category: 'Other',
    type: 'general',
    execute(message, args) {
        logger.debug(`Suggestion command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const guild = message.guild;

        if (guild.id === turing) {
            if (message.channel.id !== suggestions) {
                try {
                    message.delete();
                    message.channel.send(`Please use **${guild.channels.cache.find(channel => channel.name === 'suggestions')}** channel to use **suggestion** command.`)
                        .then(msg => {
                            msg.delete({ timeout: 5000 });
                        });
                    return;
                }
                catch (e) {
                    logger.error(e.message);
                }
            }
            logger.info(`A suggestion is written by ${message.author.id} at guild ${guild.id}. Suggestion: ${message.content}`);
            return message.channel.send(`Thank you for your suggestion. My developers will evaluate this suggestion.`);
        }

        logger.info(`A suggestion is written by ${message.author.id} at guild ${guild.id}. Suggestion: ${message.content}`);
        return message.channel.send(`Thank you for your suggestion. My developers will evaluate this suggestion.`);

    }
};