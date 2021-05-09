const logger = require('../utils/logger');
const Discord = require('discord.js');


module.exports = {
    name: 'lyrics',
    guildOnly: true,
    args: false,
    execute(message, args) {
        const song = args[0];
        const title = (song.artist != null ? song.artist + ' - ' : '') + (song.title != null ? song.title : song.youtubeTitle);
        return new Discord.MessageEmbed()
            .setColor(song.color)
            .setTitle(`${title} Lyrics`)
            .setDescription(song.lyrics)
            .setThumbnail(song.thumbnail != null ? song.thumbnail : song.youtubeThumbnail)
            .setFooter('Powered by Genius')
            .setTimestamp();
    }
};