const logger = require('../../utils/logger');
const api = require('../../utils/api');

module.exports = {
    name: 'top',
    description: 'Shows top ranked list in server',
    guildOnly: true,
    args: false,
    aliases: ['t', 'levels', 'ranks'],
    usage: '',
    category: 'Leveling',
    type: 'general',
    cooldown: 30,
    execute: async function(message) {
        logger.debug(`Top command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const result = await api.getTopTen(message.guild.id);

        if (result) {
            const members = result.map(member => member.tag);
            message.channel.send(members.join('\n'));
        }
        else {
            message.channel.send('No member found for this guild!');
        }


    }
};