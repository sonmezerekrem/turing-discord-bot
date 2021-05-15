const logger = require('../utils/logger');
const Discord = require('discord.js');
const { prefix } = require('../config.json');
const { monthNames } = require('./variables');
const { uniqueNamesGenerator, adjectives, colors } = require('unique-names-generator');
const { toTitleCase } = require('./functions');


function help(message, args) {
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
        return 'That\'s not a valid command!';
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

function serverInfo(message) {
    const guild = message.guild;

    logger.info('Server info is requested', guild.id);

    const date = guild.createdAt.getDate() + ' ' + monthNames[guild.createdAt.getMonth()] + ' ' + guild.createdAt.getFullYear();

    const embed = new Discord.MessageEmbed()
        .setTitle(guild.name)
        .setColor('#0099ff')
        .setDescription(guild.description ? guild.description : guild.name)
        .addFields(
            { name: 'Owner', value: `${guild.owner}`, inline: true },
            { name: 'Members', value: `${guild.memberCount}`, inline: true },
            { name: 'Bots', value: 0, inline: true },
            { name: 'Most Online', value: 1, inline: true },
            { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
            { name: 'AFK Channel', value: `${guild.afkChannel ? guild.afkChannel : 'Not Set'}`, inline: true },
            {
                name: 'Region',
                value: `${guild.region.charAt(0).toUpperCase() + guild.region.substring(1)}`,
                inline: true
            },
            { name: 'Created', value: `${date}`, inline: true }
        )
        .setFooter(`${guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(guild.iconURL());
    return embed;
}

function lyrics(song) {
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

function member(message) {
    const member = message.member;
    const roles = message.guild.roles;

    const date = member.joinedAt.getDate() + ' ' + monthNames[member.joinedAt.getMonth()] + ' ' + member.joinedAt.getFullYear();
    const roleList = member._roles.map((id) => roles.cache.get(id)['name']).join(', ');

    return new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setColor('#0099ff')
        .addFields(
            { name: 'Roles', value: `${roleList.length > 0 ? roleList : 'No Roles'}` },
            { name: 'Joined At', value: `${date}`, inline: true },
            { name: 'Message Points ', value: `${0}`, inline: true },
            { name: 'Voice Points ', value: `${0}`, inline: true }
        )
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());
}

function playingSong(guild, song) {
    const title = (song.artist != null ? song.artist + ' - ' : '') + (song.title != null ? song.title : song.youtubeTitle);
    const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(song.color)
        .setURL(song.youtubeUrl)
        .setAuthor('Now Playing')
        .setFooter(`${guild.name} -  Discord`)
        .setThumbnail(song.thumbnail != null ? song.thumbnail : song.youtubeThumbnail)
        .addField('\u200B', '\u200B'.repeat(500));
    return embed;
}

function queue(guildName, songs, playing) {
    const embed = new Discord.MessageEmbed()
        .setTitle('The Play Queue')
        .setColor('#0099ff')
        .setFooter(`${guildName} -  Discord`)
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

function role(message, roleName) {
    const role = message.guild.roles.cache.find(role => role.name === roleName.join(' '));

    if (role == null)
        return 'This role is not exists in this guild!';

    const date = role.createdAt.getDate() + ' ' + monthNames[role.createdAt.getMonth()] + ' ' + role.createdAt.getFullYear();

    const embed = new Discord.MessageEmbed()
        .setTitle(role.name)
        .setAuthor('Role Information')
        .setColor(role.hexColor)
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .addField('Created At', date, true)
        .addField('Mentionable', role.mentionable ? 'Yes' : 'No', true)
        .addField('Hoist', role.hoist ? 'Yes' : 'No', true)
        .addField('Position', role.position, true)
        .addField('Color', role.hexColor, true)
        .addField('Administrator', role.permissions.toArray().includes('ADMINISTRATOR') ? 'Yes' : 'No', true);
    return embed;
}

function search(message, args) {
    const songOptions = args.map(s => [s.snippet.title, s.snippet.channelTitle]);
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setThumbnail(args[0].snippet.thumbnails.medium.url)
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setTitle('Here\'s what I found for you')
        .setDescription('You can use reactions to choose a song');
    embed.addFields(
        { name: `1- ${songOptions[0][0]}`, value: `by ${songOptions[0][1]}` },
        { name: `2- ${songOptions[1][0]}`, value: `by ${songOptions[0][1]}` },
        { name: `3- ${songOptions[2][0]}`, value: `by ${songOptions[0][1]}` },
        { name: `4- ${songOptions[3][0]}`, value: `by ${songOptions[0][1]}` },
        { name: `5- ${songOptions[4][0]}`, value: `by ${songOptions[0][1]}` });
    return embed;
}

function songInfo(song, streamTime) {
    streamTime = Math.round(streamTime / 1000);

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

function teams(message, teams) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Teams')
        .setDescription(`Here's the randomly created teams for you`)
        .setThumbnail(message.client.user.avatarURL())
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp();

    for (let i = 0; i < teams.length; i++) {
        const teamName = toTitleCase(uniqueNamesGenerator({ dictionaries: [adjectives, colors] })
            .replace('_', ' '));

        const members = teams[i].join(', ');
        embed.addField(`${i + 1}.  ${teamName}`, members);
    }

    return embed;
}

function botInfo(message) {
    const user = message.client.user;
    const member = message.guild.members.cache.get(user.id);
    const roles = message.guild.roles;

    const roleList = member._roles.map((id) => roles.cache.get(id)['name']).join(', ');

    const createDate = user.createdAt.getDate() + ' ' + monthNames[user.createdAt.getMonth()] + ' ' + user.createdAt.getFullYear();
    const joinDate = member.joinedAt.getDate() + ' ' + monthNames[member.joinedAt.getMonth()] + ' ' + member.joinedAt.getFullYear();

    return new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setColor('#0099ff')
        .addFields(
            { name: 'Roles', value: `${roleList.length > 0 ? roleList : 'No Roles'}` },
            { name: 'Server Count ', value: `${1}`, inline: true },
            { name: 'Joined At ', value: `${joinDate}`, inline: true },
            { name: 'Prefix ', value: `${prefix}`, inline: true },
            { name: 'Status ', value: `online`, inline: true },
            { name: 'Activity ', value: `Playing help`, inline: true },
            { name: 'Help Command', value: `${prefix}help`, inline: true }
        )
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(user.avatarURL());
}

module.exports = {
    help, serverInfo, lyrics, member, playingSong, queue, role, search, songInfo, teams, botInfo
};