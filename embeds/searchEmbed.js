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
            .setTimestamp()
            .setTitle('Here\'s what I found for you')
            .setDescription('You can use reactions to choose a song');
        embed.addFields(
            { name: `1- ${args[1][0].snippet.title}`, value: `by ${args[1][1].snippet.channelTitle}` },
            { name: `2- ${args[1][1].snippet.title}`, value: `by ${args[1][1].snippet.channelTitle}` },
            { name: `3- ${args[1][2].snippet.title}`, value: `by ${args[1][1].snippet.channelTitle}` },
            { name: `4- ${args[1][3].snippet.title}`, value: `by ${args[1][1].snippet.channelTitle}` },
            { name: `5- ${args[1][4].snippet.title}`, value: `by ${args[1][1].snippet.channelTitle}` });
        return embed;
    }
};