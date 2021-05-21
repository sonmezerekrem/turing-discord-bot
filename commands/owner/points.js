const logger = require('../../utils/logger');
const { points } = require('../../utils/embeds');
const api = require('../../utils/api');


module.exports = {
    name: 'points',
    description: 'Gives points to tagged member and sends an embed in given channel. Max point is 20',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<channel name> <points> <member>',
    category: 'Owner',
    type: 'general',
    execute: async function(message, args) {
        logger.info(`Admin command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const guild = message.guild;

        const channel = guild.channels.cache.find(channel => channel.name === args[0]);
        if (channel && channel.type === 'text') {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                let point = parseInt(args[1]);
                if (!isNaN(point)) {
                    point = Math.min(point, 20);
                    channel.send(points(member, point, 'Gift'));
                    api.givePoints(message.guild.id, member.user.id, point);
                }
            }
        }
    }
};