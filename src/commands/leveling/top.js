const logger = require('../../utils/logger');
const api = require('../../utils/api');
const { top } = require('../../utils/embeds');


module.exports = {
    name: 'top',
    description: 'Shows top ranked list in server.',
    guildOnly: true,
    args: false,
    aliases: ['t', 'levels', 'ranks'],
    usage: '',
    category: 'Leveling',
    cooldown: 10,
    async execute(message) {
        logger.debug(`Top command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const result = await api.getTopTen(message.guild.id);

        if (result) {
            const embed = await top(message.guild.name, message.guild.iconURL(), result);
            message.channel.send(embed);
        }
        else {
            message.channel.send('Sorry, I can\'t show top list right now');
        }
    }
};
