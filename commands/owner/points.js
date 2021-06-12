const logger = require('../../utils/logger');
const { points } = require('../../utils/embeds');
const api = require('../../utils/api');


module.exports = {
    name: 'points',
    description: 'Gives points to tagged member and sends an embed in given channel. Max point is 20',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<points> <member>',
    category: 'Owner',
    type: 'general',
    async execute(message, args) {
        logger.info(`Admin command has been used at guild:${message.guild.id} by:${message.author.id}`);


        const member = message.guild.member(message.mentions.users.first());
        if (member) {
            let point = parseInt(args[0], 10);
            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(point)) {
                point = Math.min(point, 20);
                message.channel.send(points(member, point, 'Gift'));
                api.givePoints(message.guild.id, member.user.id, point);
            }
        }
    }

};
