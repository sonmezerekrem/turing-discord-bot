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

        const { commands } = message.client;

        if (!args.length) {
            embed.setTitle('Help');
            embed.setDescription('Here\'s a list of all commands:');
            embed.addField('\u200b', commands.map(command => command.name).join(', '));
            embed.addField('\u200b', `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            return embed;
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('That\'s not a valid command!');
        }
        embed.setTitle(command.name);
        embed.setDescription(command.description);
        let aliases = '-';
        if (command.aliases.length > 0)
            aliases = command.aliases.join(', ');
        embed.addField('Aliases', aliases);
        embed.addField('Usage', `${prefix}${command.name} ${command.usage}`);
        if (command.hasOwnProperty('example')) {
            embed.addField('Examples', command.example);
        }
        return embed;
    }
};