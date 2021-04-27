const Discord = require('discord.js');
const { prefix } = require('../config.json');
const logger = require('./logger');


const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

function nowPlayingEmbed(guild, song) {
    return new Discord.MessageEmbed()
        .setTitle(song.title)
        .setColor('#0099ff')
        .setURL(song.url)
        .setAuthor('Now Playing')
        .setFooter(`${guild.name} -  Discord`)
        .setThumbnail(song.image);
}


function infoEmbed(message) {
    const guild = message.guild;

    logger.info('Server info is requested', guild.id);

    const date = guild.createdAt.getDate() + ' ' + monthNames[guild.createdAt.getMonth()] + ' ' + guild.createdAt.getFullYear();

    return new Discord.MessageEmbed()
        .setTitle(guild.name)
        .setColor('#0099ff')
        .setDescription(guild.description ? guild.description : guild.name)
        .addFields(
            { name: 'Owner', value: `${guild.owner}`, inline: true },
            { name: 'Members', value: `${guild.memberCount}`, inline: true },
            { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
            { name: 'AFK Channel', value: `${guild.afkChannel ? guild.afkChannel : 'Not Set'}`, inline: true },
            {
                name: 'Region',
                value: `${guild.region.charAt(0).toUpperCase() + guild.region.substring(1)}`,
                inline: true,
            },
            { name: 'Created', value: `${date}`, inline: true },
        )
        .setFooter(`${guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(guild.iconURL());
}


function queueEmbed(message, songs, playing) {
    const embed = new Discord.MessageEmbed()
        .setTitle('The Play Queue')
        .setColor('#0099ff')
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp();

    for (let i = 0; i < songs.length; i++) {
        if (playing != null && playing === i) {
            embed.addField('   Now Playing', `${i + 1}-  ${songs[i].title}`);
            embed.setThumbnail(songs[i].image);
        } else
            embed.addField('\u200b', `${i + 1}-  ${songs[i].title}`);
    }
    return embed;
}


function memberEmbed(message) {
    const member = message.member;
    const roles = message.guild.roles;

    logger.info(`Member info has requested for ${member.id}`, member.guild.id);

    const date = member.joinedAt.getDate() + ' ' + monthNames[member.joinedAt.getMonth()] + ' ' + member.joinedAt.getFullYear();
    const roleList = member._roles.map((id) => roles.cache.get(id)['name']).join(', ');

    return new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setColor('#0099ff')
        .addFields(
            { name: 'Roles', value: `${roleList.length > 0 ? roleList : 'No Roles'}` },
            { name: 'Joined At', value: `${date}`, inline: true },
            { name: 'Message Points ', value: `${0}`, inline: true },
            { name: 'Voice Points ', value: `${0}`, inline: true },
        )
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());
}


function topEmbed(guild) {

    logger.info(`Top list info has requested`, guild.id);

    const embed = new Discord.MessageEmbed()
        .setTitle('Top List')
        .setColor('#0099ff')
        .setFooter(`${guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(guild.iconURL());

    const toplist = guild.members.cache;

    for (let i = 0; i < Math.min(10, toplist.length); i++) {
        if (i < 3) {
            embed.addField('   ', `${i + 1}-  ${toplist[i].name}`);
        } else
            embed.addField('\u200b', `${i + 1}-  ${toplist[i].name}`);
    }
    embed.setThumbnail(toplist[0].image);
    return embed;
}


function helpEmbed(message, args) {
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


function songEmbed(song) {
    const embed = new Discord.MessageEmbed()
        .setAuthor('Song Information')
        .setTitle(song.title)
        .setThumbnail(song.image)
        .setURL(song.url);
    let s = song.length;
    embed.addFields(
        { name: 'Length', value: `${(s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s}`, inline: true },
        { name: 'Year', value: `${song.year.substr(0, 4)}`, inline: true });

    return embed;
}


module.exports = {
    playingEmbed: nowPlayingEmbed,
    infoEmbed: infoEmbed,
    helpEmbed: helpEmbed,
    memberEmbed: memberEmbed,
    queueEmbed: queueEmbed,
    topEmbed: topEmbed,
    songEmbed: songEmbed,
};
