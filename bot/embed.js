const Discord = require('discord.js');
const logger = require('../utils/logger');

const commands = {
    'join': 'Bot joins to the channel where member is joined.',
    'leave': 'Bot leaves the channel.',
    'play': 'Takes song url or name and plays it.',
    'stop': 'Stops the playing and deletes the song queue',
    'skip': 'Skips the song currently playing',
    'loop': 'Loops the current song or all songs have played. To loop current song use it with \'self\' argument.',
    'pause': 'Pauses the current song.',
    'resume': 'Resumes the last song.',
    'clear': 'Clear the song queue.',
    'help': 'Shows list of commands. To show a specific command give command name as argument.',
    'info': 'Shows server info',
    'top': 'Shows top ranked members.',
    'me': 'Shows member information.',
    'ping': 'Shows member ping',
    'queue': 'Shows the song queue',
    'shuffle': 'Shuffles the song queue',
};
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

function sendSongEmbed(guild, song) {
    return new Discord.MessageEmbed()
        .setTitle(song.title)
        .setColor('#0099ff')
        .setURL(song.url)
        .setAuthor('Now Playing')
        .setFooter(`${guild.name} -  Discord`)
        .setThumbnail(song.image);
}


function sendInfoEmbed(message) {
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


function sendQueueEmbed(message, songs, playing) {
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


function sendMemberEmbed(message) {
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


function sendHelpEmbed(command) {
    if (command) {
        if (command in commands) {
            return new Discord.MessageEmbed()
                .setTitle(command)
                .setColor('#0099ff')
                .setDescription(commands[command]);
        } else {
            return 'This commands is not exists';
        }
    }
    return new Discord.MessageEmbed()
        .setTitle('List of commands')
        .setColor('#0099ff')
        .setDescription(Object.keys(commands).join(', '));
}


function sendTopEmbed(guild) {

    logger.info(`Top list info has requested`, guild.id);

    const embed = new Discord.MessageEmbed()
        .setTitle('Top List')
        .setColor('#0099ff')
        .setFooter(`${guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(guild.iconURL());

    const toplist = guild.members.cache

    for (let i = 0; i < Math.min(10, toplist.length); i++) {
        if (i < 3) {
            embed.addField('   ', `${i + 1}-  ${toplist[i].name}`);
        } else
            embed.addField('\u200b', `${i + 1}-  ${toplist[i].name}`);
    }
    embed.setThumbnail(toplist[0].image);
    return embed;
}

module.exports = {
    songEmbed: sendSongEmbed,
    infoEmbed: sendInfoEmbed,
    helpEmbed: sendHelpEmbed,
    memberEmbed: sendMemberEmbed,
    queueEmbed: sendQueueEmbed,
    topEmbed: sendTopEmbed,
};
