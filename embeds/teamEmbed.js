const logger = require('../utils/logger');
const Discord = require('discord.js');
const { uniqueNamesGenerator, adjectives, colors } = require('unique-names-generator');

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}


module.exports = {
    name: 'help',
    guildOnly: true,
    args: false,
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Teams')
            .setDescription(`Here's the randomly created teams for you`)
            .setThumbnail(message.client.user.avatarURL())
            .setFooter(`${message.guild.name} -  Discord`)
            .setTimestamp();

        for (let i = 0; i < args.length; i++) {
            const teamName = toTitleCase(uniqueNamesGenerator({ dictionaries: [adjectives, colors] })
                .replace('_', ' '));

            const members = args[i].join(', ');
            embed.addField(`${i + 1}.  ${teamName}`, members);
        }

        return embed;
    }
};