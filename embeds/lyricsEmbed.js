const logger = require('../utils/logger');
const Discord = require('discord.js');
const { prefix } = require('../config.json');


module.exports = {
    name: 'lyrics',
    guildOnly: true,
    args: false,
    execute(message, args) {
        const song = args[0];
        const title = (song.artist != null ? song.artist + ' - ' : '') + (song.title != null ? song.title : song.youtubeTitle);
        const embed = new Discord.MessageEmbed()
            .setColor(song.color)
            .setTitle(`${title} Lyrics`)
            .setDescription(song.lyrics)
            .setThumbnail(song.thumbnail != null ? song.thumbnail : song.youtubeThumbnail)
            .setFooter('Powered by Genius')
            .setTimestamp();

        return embed;
    }
};