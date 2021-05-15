const logger = require('../utils/logger');
const Discord = require('discord.js');
const { monthNames } = require('../utils/variables');


module.exports = {
    name: 'help',
    guildOnly: true,
    args: false,
    execute(message, args) {
        const guild = message.guild;

        logger.info('Server info is requested', guild.id);

        const date = guild.createdAt.getDate() + ' ' + monthNames[guild.createdAt.getMonth()] + ' ' + guild.createdAt.getFullYear();

        return new Discord.MessageEmbed()
            .setTitle(guild.name)
            .setColor('#0099ff')
            .setDescription(guild.description ? guild.description : guild.name)
            .addFields(
                { name: 'Owner', value: `${guild.owner}`, inline: true },
                { name: 'Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Bots', value: 0, inline: true },
                { name: 'Most Online', value: 1, inline: true },
                { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'AFK Channel', value: `${guild.afkChannel ? guild.afkChannel : 'Not Set'}`, inline: true },
                {
                    name: 'Region',
                    value: `${guild.region.charAt(0).toUpperCase() + guild.region.substring(1)}`,
                    inline: true
                },
                { name: 'Created', value: `${date}`, inline: true }
            )
            .setFooter(`${guild.name} -  Discord`)
            .setTimestamp()
            .setThumbnail(guild.iconURL());
    }
};