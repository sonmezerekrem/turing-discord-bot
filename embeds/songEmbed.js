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
            .setTitle(song.title)
            .setThumbnail(song.image)
            .setURL(song.url);

        const toMinute = (s) => {
            return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
        };

        const point = Math.round((streamTime) * 30 / song.length);
        let current = Array(30).fill('–');
        current[point] = '⁕';
        current = current.join('');

        embed.setDescription(`♪ ${toMinute(streamTime)} ${current} ${toMinute(song.length)}`);

        embed.addFields(
            { name: 'Year', value: `${song.year.substr(0, 4)}`, inline: true },
            { name: 'Added by', value: song.addedBy, inline: true });
        return embed;
    }
};