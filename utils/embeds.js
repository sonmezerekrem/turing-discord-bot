const logger = require('../utils/logger');
const Discord = require('discord.js');
const { prefix, color, website, defaultActivity, version } = require('../config.json');
const { categories, colorSet } = require('./variables');
const { uniqueNamesGenerator, adjectives, colors } = require('unique-names-generator');
const { toTitleCase, getDateAsString } = require('./functions');


function help(message, args) {
    const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setThumbnail(message.client.user.avatarURL())
        .setFooter(`${message.guild ? message.guild.name : 'DM'} -  Discord`)
        .setTimestamp();

    const { commands } = message.client;

    if (!args.length) {
        embed.setTitle('Help');
        embed.setDescription('Here\'s a list of all commands by categories:');
        embed.addFields(
            {
                name: 'Help',
                value: commands.filter(command => command.category === 'Helper').map(command => command.name).join(', ')
            },
            {
                name: 'Info',
                value: commands.filter(command => command.category === 'Info').map(command => command.name).join(', ')
            },
            {
                name: 'Moderation',
                value: commands.filter(command => command.category === 'Moderation').map(command => command.name).join(', ')
            },
            {
                name: 'Music',
                value: commands.filter(command => command.category === 'Music').map(command => command.name).join(', ')
            },
            {
                name: 'Leveling',
                value: commands.filter(command => command.category === 'Leveling').map(command => command.name).join(', ')
            },
            {
                name: 'Fun',
                value: commands.filter(command => command.category === 'Fun').map(command => command.name).join(', ')
            },
            {
                name: 'Record',
                value: commands.filter(command => command.category === 'Record').map(command => command.name).join(', ')
            },
            {
                name: 'Other',
                value: commands.filter(command => command.category === 'Other').map(command => command.name).join(', ')
            });
        if (message.author.id === message.guild.ownerID) {
            embed.addField('Owner', commands.filter(command => command.category === 'Owner').map(command => command.name).join(', '));
        }
        embed.addField('\u200b', `\nYou can send  \`${prefix}help [category name]\` or \`${prefix}help [command name]\` to get info on a specific category or command!`);
        return embed;
    }

    const name = args[0].toLowerCase();

    if (categories.hasOwnProperty(name)) {
        if (name === 'owner' && message.author.id !== message.guild.ownerID) {
            return 'Only owner of this guild access this commands!';
        }
        embed.setTitle(`${toTitleCase(name)} Commands`);
        embed.setDescription(categories[name]);
        const categoryCommands = commands.filter(command => command.category === toTitleCase(name));
        categoryCommands.forEach(command => {
            embed.addField(command.name, command.description);
        });

        embed.addField('\u200b', `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
        return embed;
    }

    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command || (command.category === 'Owner' && message.author.id !== message.guild.ownerID)) {
        return 'That\'s not a valid category or command!';
    }

    embed.setTitle(command.name);
    embed.setDescription(command.description);
    embed.addField('Category', command.category);
    let aliases = '-';
    if (command.aliases.length > 0)
        aliases = command.aliases.join(', ');
    embed.addField('Aliases', aliases);
    embed.addField('Usage', `${prefix}${command.name} ${command.usage}`);
    if (command.hasOwnProperty('example')) {
        embed.addField('Examples', command.example);
    }
    embed.addField('Guild Only', `${command.guildOnly ? 'Yes' : 'No'}`);
    return embed;
}

function serverInfo(message) {
    const guild = message.guild;

    logger.info('Server info is requested', guild.id);

    const date = getDateAsString(guild.createdAt);

    const embed = new Discord.MessageEmbed()
        .setTitle(guild.name)
        .setColor(color)
        .setDescription(guild.description ? guild.description : guild.name)
        .addFields(
            { name: 'Owner', value: `${guild.owner}`, inline: true },
            { name: 'Members', value: `${guild.members.cache.filter(member => !member.user.bot).size}`, inline: true },
            { name: 'Bots', value: guild.members.cache.filter(member => member.user.bot).size, inline: true },
            {
                name: 'Most Online',
                value: guild.members.cache.filter(member => member.presence.status === 'online').size,
                inline: true
            },
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

    if (guild.rulesChannel) {
        embed.addField('Rules Channel', guild.rulesChannel.name);
    }
    return embed;
}

function lyrics(song) {
    const title = (song.artist != null ? song.artist + ' - ' : '') + (song.title != null ? song.title : song.youtubeTitle);
    return new Discord.MessageEmbed()
        .setColor(song.color)
        .setTitle(`${title}`)
        .setDescription(`You can find the lyrics on the link below\n\n ${song.lyricsUrl}\n`)
        .setThumbnail(song.thumbnail != null ? song.thumbnail : song.youtubeThumbnail)
        .setFooter('Powered by Genius')
        .setTimestamp();
}

function member(message) {
    const member = message.member;
    const roles = message.guild.roles;

    const date = getDateAsString(member.joinedAt);
    const roleList = member._roles.map((id) => roles.cache.get(id)['name']).join(', ');
    const connections = [];

    const embed = new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setDescription('General information about member')
        .setColor(color)
        .addFields(
            { name: 'Roles', value: `${roleList.length > 0 ? roleList : 'No Roles'}` },
            { name: 'Joined At', value: `${date}`, inline: true },
            { name: 'Points ', value: 0, inline: true },
            { name: 'Level ', value: 1, inline: true },
            { name: 'Rank In The Server', value: '#' }
        )
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());

    if (connections.length > 0) {
        connections.forEach(conn => {
            embed.addField(conn.name, conn.url);
        });
    }

    return embed;
}

function playingSong(guild, song) {
    return new Discord.MessageEmbed()
        .setTitle(song.isGenius ? song.artist + ' - ' + song.title : song.youtubeTitle)
        .setColor(song.color)
        .setURL(song.youtubeUrl)
        .setAuthor('Now Playing')
        .setFooter(`Powered By Genius -  ${guild.name} -  Discord`)
        .setThumbnail(song.isGenius ? song.thumbnail : song.youtubeThumbnail)
        .addField('\u200B', '\u200B'.repeat(500));
}

function queue(guildName, songs, playing) {
    const embed = new Discord.MessageEmbed()
        .setTitle('The Play Queue')
        .setColor(color)
        .setFooter(`Powered By Genius -  ${guildName} -  Discord`)
        .setTimestamp();
    let content = [];
    for (let i = 0; i < songs.length; i++) {
        if (playing != null && playing === i) {
            content.push(`**Now Playing**\n__${i + 1}- ${songs[i].isGenius ? songs[i].artist + ' - ' + songs[i].title : songs[i].youtubeTitle}__\n`);
            embed.setThumbnail(songs[i].isGenius ? songs[i].thumbnail : songs[i].youtubeThumbnail);
        }
        else {
            content.push(`${i + 1}- ${songs[i].isGenius ? songs[i].artist + ' - ' + songs[i].title : songs[i].youtubeTitle}\n`);
        }
    }
    embed.setDescription(content);
    return embed;
}

function role(message, roleName) {
    const role = message.guild.roles.cache.find(role => role.name === roleName.join(' '));

    if (role == null)
        return 'This role is not exists in this guild!';

    const date = getDateAsString(role.createdAt);

    return new Discord.MessageEmbed()
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
}

function search(message, args) {
    const songOptions = args.map(s => [s.snippet.title, s.snippet.channelTitle]);
    return new Discord.MessageEmbed()
        .setColor(color)
        .setThumbnail(args[0].snippet.thumbnails.medium.url)
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setTitle('Here\'s what I found for you')
        .setDescription('You can use reactions to choose a song')
        .addFields(
            { name: `1- ${songOptions[0][0]}`, value: `by ${songOptions[0][1]}` },
            { name: `2- ${songOptions[1][0]}`, value: `by ${songOptions[0][1]}` },
            { name: `3- ${songOptions[2][0]}`, value: `by ${songOptions[0][1]}` },
            { name: `4- ${songOptions[3][0]}`, value: `by ${songOptions[0][1]}` },
            { name: `5- ${songOptions[4][0]}`, value: `by ${songOptions[0][1]}` });
}

function songInfo(song, streamTime) {
    streamTime = Math.round(streamTime / 1000);

    const embed = new Discord.MessageEmbed()
        .setAuthor('Song Information')
        .setTitle(song.isGenius ? song.title : song.youtubeTitle)
        .setThumbnail(song.isGenius ? song.thumbnail : song.youtubeThumbnail)
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

    if (song.isGenius) {
        embed.addField('Artist', song.artist);
        embed.addField('Album', song.album);
    }
    if (song.release)
        embed.addField('Release Date', getDateAsString(song.release));

    if (song.lyricsUrl != null)
        embed.addField('Lyrics', song.lyricsUrl);
    if (song.spotifyUrl != null)
        embed.addField('Spotify', song.spotifyUrl);

    return embed;
}

function teams(message, teams) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Teams')
        .setColor(color)
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

    const joinDate = getDateAsString(member.joinedAt);

    return new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setColor(color)
        .addFields(
            { name: 'Roles', value: `${roleList.length > 0 ? roleList : 'No Roles'}` },
            { name: 'Server Count ', value: `${1}`, inline: true },
            { name: 'Joined At ', value: `${joinDate}`, inline: true },
            { name: 'Prefix ', value: `${prefix}`, inline: true },
            { name: 'Help Command', value: `${prefix}help`, inline: true },
            { name: 'Issue Report', value: `${prefix}issue`, inline: true },
            { name: 'Language', value: 'English', inline: true },
            {
                name: 'Activity ',
                value: `${prefix}${defaultActivity.name} ${toTitleCase(defaultActivity.type)}`,
                inline: true
            },
            { name: 'Status ', value: `online`, inline: true },
            { name: 'Version', value: version, inline: true }
        )
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(user.avatarURL());
}

function helloOnJoin(guild) {
    const user = guild.client.user;
    const member = guild.members.cache.get(user.id);

    const joinDate = getDateAsString(member.joinedAt);

    return new Discord.MessageEmbed()
        .setTitle(`Hello I am ${member.displayName}.`)
        .setColor(color)
        .setDescription(`I am happy to here. Thank you for adding me to ${guild.name}. I am a multipurpose bot with many capabilities.
                        Here's a little bit information about me and configurations for this guild.`)
        .addField('Website', website)
        .addFields(
            { name: 'Server Count', value: `${guild.client.guilds.cache.size}`, inline: true },
            { name: 'Joined At ', value: `${joinDate}`, inline: true },
            { name: 'Prefix ', value: `${prefix}`, inline: true },
            { name: 'Status ', value: `online`, inline: true },
            { name: 'Activity ', value: `Playing help`, inline: true },
            { name: 'Help Command', value: `${prefix}help`, inline: true },
            { name: 'Leveling', value: 'Active', inline: true },
            { name: 'Role Management', value: 'Inactive', inline: true },
            { name: 'Welcome/Leave Messages', value: 'Inactive', inline: true },
            { name: 'Warnings', value: 'Inactive', inline: true },
            { name: 'Moderation Messages', value: 'Inactive', inline: true }
        )
        .setFooter(`${guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(user.avatarURL());
}

function moderation(action, args) {
    const embed = new Discord.MessageEmbed()
        .setTimestamp();
    try {
        if (action === 'Ban') {
            embed.setTitle('Ban')
                .setDescription('Ban Details')
                .setColor(colorSet.Red)
                .addField('Banned User', `${args[0].user.tag} (${args[0].user.id})`)
                .addField('Reason', `${args[0].reason ? args[0].reason : 'No reason'}`)
                .setThumbnail(args[0].user.avatarURL());
        }
        else if (action === 'Ban Remove') {
            embed.setTitle('Ban Remove')
                .setDescription('Ban Remove Details')
                .setColor(colorSet.GreenYellow)
                .addField('Unbanned User', `${args[0].tag} (${args[0].id})`)
                .setThumbnail(args[0].avatarURL());
        }
        else if (action === 'Member Remove') {
            embed.setTitle('Member Leave')
                .setDescription('Member is left or kicked')
                .setThumbnail(args[0].user.avatarURL())
                .setColor(colorSet.DarkOrange)
                .addField('Member', `${args[0].displayName} (${args[0].id})`);
        }
        else if (action === 'Channel Create') {
            embed.setTitle('Channel Create')
                .setDescription('New channel is created at guild')
                .setColor(colorSet.RoyalBlue)
                .addField('Type', args[0].type)
                .addField('Name', `${args[0].name} (${args[0].id})`)
                .setFooter(`${args[1]} -  Discord`)
                .setThumbnail(args[2]);
        }
        else if (action === 'Channel Delete') {
            embed.setTitle('Channel Delete')
                .setDescription('Channel is deleted at guild')
                .setColor(colorSet.Blue)
                .addField('Type', args[0].type)
                .addField('Name', `${args[0].name} (${args[0].id})`)
                .setFooter(`${args[1]} -  Discord`)
                .setThumbnail(args[2]);
        }
        else if (action === 'Channel Update') {
            embed.setTitle('Channel Update')
                .setDescription('Channel is updated at guild')
                .setColor(colorSet.MediumBlue)
                .addField('Type', args[1].type)
                .addField('Name', `${args[1].name} (${args[1].id})`)
                .setFooter(`${args[2]} -  Discord`)
                .setThumbnail(args[3]);
        }
        else if (action === 'Invite Create') {
            embed.setTitle('Invite Created')
                .setDescription('New invite is created')
                .setColor(colorSet.Indigo)
                .addField('Url', args[1])
                .setThumbnail(args[0].avatarURL())
                .setFooter(`${args[3]} -  Discord`)
                .addField('Creator User', `${args[0].tag} (${args[0].id})`)
                .addField('Expires At', getDateAsString(args[2]));
        }
        else if (action === 'Role Request') {
            embed.setTitle('Role Request')
                .setDescription('New role is requested')
                .setColor(colorSet.Lime)
                .addField('User', `${args[0].tag} (${args[0].id})`)
                .setThumbnail(args[0].avatarURL())
                .setFooter(`${args[2]} -  Discord`)
                .addField('Role', `${args[1]}`);
        }

    }
    catch (e) {
        logger.error(e.message);
    }

    return embed;
}

function welcomeMessage(member) {
    return new Discord.MessageEmbed()
        .setTitle(`Welcome to The ${member.guild.name}`)
        .setDescription(`We are happy to see you here. If you need me just use **${prefix}help** command.`)
        .setThumbnail(member.guild.iconURL())
        .setFooter(`${member.guild.name} -  Discord`)
        .setColor(colorSet.LightYellow)
        .setTimestamp();
}

function points(member, point, source) {
    return new Discord.MessageEmbed()
        .setTitle(`Congratulations ${member.displayName}!`)
        .setDescription('You earn points')
        .addField('Points', point)
        .addField('Source', source)
        .setColor(colorSet.Yellow)
        .setFooter(`${member.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());
}

function warning(member, warner, reason) {
    return new Discord.MessageEmbed()
        .setTitle(`Warning: ${member.displayName}`)
        .setFooter(`${member.guild.name} -  Discord`)
        .setTimestamp()
        .setColor(colorSet.Orange)
        .setThumbnail(member.user.avatarURL())
        .setDescription(`**Warned By:** ${warner} \n\n**Member:** ${member.user.tag} - (${member.id}) \n\n**Reason:** ${reason}`);
}

module.exports = {
    help,
    serverInfo,
    lyrics,
    member,
    playingSong,
    queue,
    role,
    search,
    songInfo,
    teams,
    botInfo,
    helloOnJoin,
    moderation,
    welcomeMessage,
    points,
    warning
};