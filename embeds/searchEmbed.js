const logger = require('../utils/logger');
const Discord = require('discord.js');
const { prefix } = require('../config.json');


module.exports = {
    name: 'help',
    guildOnly: true,
    args: false,
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setThumbnail(message.client.user.avatarURL())
            .setFooter(`${message.guild.name} -  Discord`)
            .setTimestamp();
    }
};