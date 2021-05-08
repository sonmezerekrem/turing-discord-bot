const logger = require('../utils/logger');
const Discord = require('discord.js');
const { prefix } = require('../config.json');


module.exports = {
    name: 'help',
    guildOnly: true,
    args: false,
    execute(message, args) {
        const song = args[0];
        const streamTime = Math.round(args[1] / 1000);

        const embed = new Discord.MessageEmbed()
            .setAuthor('Song Information')
            .setTitle(song.title != null ? song.title : song.youtubeTitle)
            .setThumbnail(song.thumbnail != null ? song.thumbnail : song.youtubeThumbnail)
            .setURL(song.youtubeUrl)
            .setColor(song.color)
            .setFooter('Powered by Genius');

        if (song.length != null) {
            const toMinute = (s) => {
                return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
            };

            const point = Math.round((streamTime) * 30 / song.length);
            let current = Array(30).fill('–');
            current[point] = '⁕';
            current = current.join('');

            embed.setDescription(`♪ ${toMinute(streamTime)} ${current} ${toMinute(song.length)}`);
        }

        if (song.artist != null)
            embed.addField('Artist', song.artist, true);
        if (song.album != null)
            embed.addField('Album', song.album, true);

        embed.addField('Year', song.release, true);

        if (song.lyricsUrl != null)
            embed.addField('Lyrics', song.lyricsUrl);
        if (song.spotifyUrl != null)
            embed.addField('Spotify', song.spotifyUrl);

        return embed;
    }
};