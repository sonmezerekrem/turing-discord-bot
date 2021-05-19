const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').points;

module.exports = {
    name: 'daily',
    description: 'Gives 10 point to user every day',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: 'Leveling',
    type: 'general',
    execute(message, args) {
        logger.debug(`Daily command has been used at guild:${message.guild.id} by:${message.author.id}`);

        message.channel.send(embed(message.member, 10, 'Daily'));

    }
};