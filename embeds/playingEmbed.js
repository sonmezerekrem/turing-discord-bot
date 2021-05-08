const logger = require('../utils/logger');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    guildOnly: true,
    args: false,
    execute(guild, args) {
        const song = args[0];
        const title = (song.artist != null ? song.artist + ' - ' : '') + (song.title != null ? song.title : song.youtubeTitle);
        return new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(song.color)
            .setURL(song.youtubeUrl)
            .setAuthor('Now Playing')
            .setFooter(`${guild.name} -  Discord`)
            .setThumbnail(song.thumbnail != null ? song.thumbnail : song.youtubeThumbnail)
            .addField('\u200B', '\u200B'.repeat(500));
    }
};