const logger = require('../utils/logger');
const Discord = require('discord.js');
const { monthNames } = require('../utils/variables');


module.exports = {
    name: 'role',
    guildOnly: true,
    args: true,
    execute(message, args) {
        const role = message.guild.roles.cache.find(role => role.name === args.join(' '));

        if (role == null)
            return 'This role is not exists in this guild!';

        const date = role.createdAt.getDate() + ' ' + monthNames[role.createdAt.getMonth()] + ' ' + role.createdAt.getFullYear();

        return new Discord.MessageEmbed()
            .setTitle(role.name)
            .setAuthor('Role Information')
            .setColor(role.hexColor)
            .setFooter(`${message.guild.name} -  Discord`)
            .setTimestamp()
            .addField('Created At', date, true)
            .addField('Mentionable', role.mentionable ? 'Yes' : 'No', true)
            .addField('Hoist', role.hoist ? 'Yes' : 'No', true)
            .addField('Position', role.position, true)
            .addField('Color', role.hexColor, true)
            .addField('Administrator', role.permissions.toArray().includes('ADMINISTRATOR') ? 'Yes' : 'No', true);
    }
};