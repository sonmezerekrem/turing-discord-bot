const logger = require('../utils/logger');
const Discord = require('discord.js');
const { prefix } = require('../config.json');

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

module.exports = {
    name: 'help',
    guildOnly: true,
    args: false,
    execute(message, args) {
        const member = message.member;
        const roles = message.guild.roles;

        const date = member.joinedAt.getDate() + ' ' + monthNames[member.joinedAt.getMonth()] + ' ' + member.joinedAt.getFullYear();
        const roleList = member._roles.map((id) => roles.cache.get(id)['name']).join(', ');

        return new Discord.MessageEmbed()
            .setTitle(member.displayName)
            .setColor('#0099ff')
            .addFields(
                { name: 'Roles', value: `${roleList.length > 0 ? roleList : 'No Roles'}` },
                { name: 'Joined At', value: `${date}`, inline: true },
                { name: 'Message Points ', value: `${0}`, inline: true },
                { name: 'Voice Points ', value: `${0}`, inline: true }
            )
            .setFooter(`${message.guild.name} -  Discord`)
            .setTimestamp()
            .setThumbnail(member.user.avatarURL());
    }
};