const logger = require('../utils/logger');
const Discord = require('discord.js');


module.exports = {
    name: 'help',
    guildOnly: true,
    args: false,
    execute(message, args) {
        const songs = args[0];
        const playing = args[1];
        const embed = new Discord.MessageEmbed()
            .setTitle('The Play Queue')
            .setColor('#0099ff')
            .setFooter(`${message.guild.name} -  Discord`)
            .setTimestamp();

        for (let i = 0; i < songs.length; i++) {
            if (playing != null && playing === i) {
                embed.addField('   Now Playing', `${i + 1}-  ${songs[i].title}`);
                embed.setThumbnail(songs[i].image);
            }
            else
                embed.addField('\u200b', `${i + 1}-  ${songs[i].title}`);
        }
        return embed;
    }
};