const logger = require('../../utils/logger');
const { points, warning } = require('../../utils/embeds');

module.exports = {
    name: 'points',
    description: 'Gives points to tagged member and sends an embed in given channel. Max point is 20 and this command can be used up to twice a day',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<channel name> <points> <member>',
    category: 'Owner',
    type: 'general',
    execute(message, args) {
        logger.info(`Admin command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const guild = message.guild;

        const channel = guild.channels.cache.find(channel => channel.name === args[0]);
        if (channel && channel.type === 'text') {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                const point = parseInt(args[1]);
                if (!isNaN(point)) {
                    channel.send(points(member, point, 'Gift'));
                }
            }
        }
    }
};