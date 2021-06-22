const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').points;
const api = require('../../utils/api');


module.exports = {
    name: 'daily',
    description: 'Gives 10 point to user every day.',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: 'Leveling',
    async execute(message) {
        logger.debug(`Daily command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const result = await api.getMember(message.guild.id, message.author.id);

        if (result) {
            const today = new Date();
            if (result.lastDaily == null || new Date(result.lastDaily).getDate() !== today.getDate()) {
                message.channel.send(embed(message.member, 10, 'Daily'));
                api.givePoints(message.guild.id, message.author.id, 10);
                api.updateMember(message.guild.id, message.author.id, { lastDaily: today.toString() });
            }
            else {
                message.channel.send('You already get your daily points!');
            }
        }
    }
};
