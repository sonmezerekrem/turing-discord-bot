const logger = require('../utils/logger');
const Discord = require('discord.js');
const { prefix } = require('../config.json');


module.exports = {
    name: 'help',
    guildOnly: true,
    args: false,
    execute(guild, args) {
        const song = args[0];
        return new Discord.MessageEmbed()
            .setTitle(song.title)
            .setColor('#0099ff')
            .setURL(song.url)
            .setAuthor('Now Playing')
            .setFooter(`${guild.name} -  Discord`)
            .setThumbnail(song.image);
    }
};