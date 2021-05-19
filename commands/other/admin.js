const logger = require('../../utils/logger');
const { points, warning } = require('../../utils/embeds');

module.exports = {
    name: 'admin',
    description: 'Admin features',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '',
    category: 'Other',
    type: 'guild',
    execute(message, args) {
        logger.info(`Admin command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const guild = message.guild;

        if (args[0] === 'message') {
            const channel = guild.channels.cache.find(channel => channel.name === args[1]);
            const type = args[2]; //classic / code
            const content = message.content.substring(args.slice(0, 3).join(' ').length + 9);
            if (type === 'code') {
                channel.send(`>>> ${content}`);
            }
            else {
                channel.send(content);
            }
        }
        else if (args[0] === 'warning') {
            const channel = guild.channels.cache.find(channel => channel.name === args[1]);
            const member = message.guild.member(message.mentions.users.first());
            channel.send(warning(member, message.member.displayName, 'Admin Warning'));
        }
        else if (args[0] === 'points') {
            const channel = guild.channels.cache.find(channel => channel.name === args[1]);
            const member = message.guild.member(message.mentions.users.first());
            const point = args[2];
            channel.send(points(member, point, 'Gift'));
        }

    }
};