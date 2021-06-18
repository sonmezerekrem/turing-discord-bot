const logger = require('../../utils/logger');
const api = require('../../utils/api');


module.exports = {
    name: 'weekly',
    description: 'Shows top ranked list for last week in server. Resets in every Monday',
    guildOnly: true,
    args: false,
    aliases: ['week'],
    usage: '',
    category: 'Leveling',
    cooldown: 10,
    async execute(message) {
        logger.debug(`Weekly command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const result = await api.getWeeklyTop(message.guild.id);

        if (result) {
            const members = result.map((member) => member.tag);
            message.channel.send(members.join('\n'));
        }
        else {
            message.channel.send('Sorry, I couldn\'t show weekly list right now');
        }
    }
};
