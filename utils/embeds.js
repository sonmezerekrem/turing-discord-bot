const Discord = require('discord.js');
const {
    uniqueNamesGenerator,
    adjectives,
    colors
} = require('unique-names-generator');
const logger = require('./logger');
const {
    prefix,
    color,
    website,
    version,
    contact,
    defaultActivity,
    defaultState
} = require('../config.json');
const {
    categories,
    colorSet
} = require('./variables');
const {
    toTitleCase,
    getDateAsString
} = require('./functions');


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
                name: 'Info',
                value: commands.filter((command) => command.category === 'Info')
                    .map((command) => command.name)
                    .join(', ')
            },
            {
                name: 'Moderation',
                value: commands.filter((command) => command.category === 'Moderation')
                    .map((command) => command.name)
                    .join(', ')
            },
            {
                name: 'Sound',
                value: commands.filter((command) => command.category === 'Sound')
                    .map((command) => command.name)
                    .join(', ')
            },
            {
                name: 'Leveling',
                value: commands.filter((command) => command.category === 'Leveling')
                    .map((command) => command.name)
                    .join(', ')
            },
            {
                name: 'Fun',
                value: commands.filter((command) => command.category === 'Fun')
                    .map((command) => command.name)
                    .join(', ')
            },
            {
                name: 'Member',
                value: commands.filter((command) => command.category === 'Member')
                    .map((command) => command.name)
                    .join(', ')
            },
            {
                name: 'Other',
                value: commands.filter((command) => command.category === 'Other')
                    .map((command) => command.name)
                    .join(', ')
            }, {
                name: 'Tool',
                value: commands.filter((command) => command.category === 'Tool')
                    .map((command) => command.name)
                    .join(', ')
            }
        );
        if (message.channel.type !== 'dm' && message.author.id === message.guild.ownerID) {
            embed.addField('Owner', commands.filter((command) => command.category === 'Owner')
                .map((command) => command.name)
                .join(', '));
        }
        embed.addField('\u200b', `\nYou can send  \`${prefix}help [category name]\` or \`${prefix}help [command name]\` to get info on a specific category or command!`);
        return embed;
    }

    const name = args[0].toLowerCase();
    if (Object.prototype.hasOwnProperty.call(categories, name)) {
        if (name === 'owner' && message.author.id !== message.guild.ownerID) {
            return 'Only owner of this guild access this commands!';
        }
        embed.setTitle(`${toTitleCase(name)} Commands`);
        const categoryCommands = commands.filter((command) => command.category === toTitleCase(name));
        const content = [`${categories[name]}\n`];
        categoryCommands.forEach((command) => {
            content.push(`**${command.name}:** ${command.description}`);
        });
        content.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
        embed.setDescription(content.join('\n\n'));
        return embed;
    }

    const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command || (command.category === 'Owner' && message.author.id !== message.guild.ownerID)) {
        return 'That\'s not a valid category or command!';
    }

    embed.setTitle(command.name);
    embed.setDescription(command.description);
    embed.addField('Category', command.category);
    let aliases = '-';
    if (command.aliases.length > 0) {
        aliases = command.aliases.join(', ');
    }
    embed.addField('Aliases', aliases);
    embed.addField('Usage', `${prefix}${command.name} ${command.usage}`);
    if (Object.prototype.hasOwnProperty.call(command, 'example')) {
        embed.addField('Examples', command.example);
    }
    if (Object.prototype.hasOwnProperty.call(command, 'link')) {
        embed.addField('Link', command.link);
    }
    embed.addField('Guild Only', `${command.guildOnly ? 'Yes' : 'No'}`);
    return embed;
}


function serverInfo(message, result) {
    const { guild } = message;

    const embed = new Discord.MessageEmbed()
        .setTitle(guild.name)
        .setColor(color)
        .setDescription(guild.description ? guild.description : guild.name)
        .addFields(
            {
                name: 'Owner',
                value: `${guild.owner}`,
                inline: true
            },
            {
                name: 'Members',
                value: `${guild.members.cache.filter((member) => !member.user.bot).size}`,
                inline: true
            },
            {
                name: 'Bots',
                value: guild.members.cache.filter((member) => member.user.bot).size,
                inline: true
            },
            {
                name: 'Online',
                value: guild.members.cache.filter((member) => member.presence.status === 'online').size,
                inline: true
            },
            {
                name: 'AFK Channel',
                value: `${guild.afkChannel ? guild.afkChannel : 'Not Set'}`,
                inline: true
            },
            {
                name: 'Region',
                value: `${guild.region.charAt(0)
                    .toUpperCase() + guild.region.substring(1)}`,
                inline: true
            },
            {
                name: 'Created',
                value: `${getDateAsString(guild.createdAt)}`,
                inline: true
            }
        )
        .setFooter(`${guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(guild.iconURL());

    if (guild.rulesChannel) {
        embed.addField('Rules Channel', guild.rulesChannel.name);
    }

    if (result !== null && result.connections.length > 0) {
        const connections = [];
        result.connections.forEach((conn) => {
            connections.push(`__${conn.name}__\n${conn.url}\n`);
        });
        embed.addField('Connections', connections.join(''));
    }
    return embed;
}


function memberEmbed(message, result) {
    const { member } = message;
    const { roles } = message.guild;

    const date = getDateAsString(member.joinedAt);
    // eslint-disable-next-line no-underscore-dangle
    const roleList = member._roles.map((id) => roles.cache.get(id).name)
        .join(', ');

    if (result == null) {
        result = {};
        result.weeklyPoints = '-';
        result.level = '-';
        result.connections = [];
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setDescription(member.user.tag)
        .setColor(color)
        .addFields(
            {
                name: 'Roles',
                value: `${roleList.length > 0 ? roleList : 'No Roles'}`
            },
            {
                name: 'Joined At',
                value: `${date}`,
                inline: true
            },
            {
                name: 'Weekly Points',
                value: result.weeklyPoints,
                inline: true
            },
            {
                name: 'Level ',
                value: result.level,
                inline: true
            }
        )
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL() != null ? member.user.avatarURL() : 'https://cdn.discordapp.com/embed/avatars/0.png');

    if (member.presence && member.presence.activities.length > 0) {
        if (member.presence.activities[0].name === 'Spotify') {
            embed.addField('Status', `**${member.presence.activities[0].name}** - ${member.presence.activities[0].state.replace(';', ',')} - ${member.presence.activities[0].details}`);
        }
        else {
            embed.addField('Status', `${toTitleCase(member.presence.activities[0].type)} - ${member.presence.activities[0].name}`);
        }
    }

    if (result.connections.length > 0) {
        const connections = [];
        result.connections.forEach((conn) => {
            connections.push(`__${conn.name}__\n${conn.url}\n`);
        });
        embed.addField('Connections', connections.join(''));
    }

    return embed;
}


function roleEmbed(message, roleName) {
    const role = message.guild.roles.cache.find((r) => r.name === roleName.join(' '));

    if (role == null) {
        return 'This role is not exists in this guild!';
    }

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
        .addField('Administrator', role.permissions.toArray()
            .includes('ADMINISTRATOR') ? 'Yes' : 'No', true);
}


function teamsEmbed(message, teams) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Teams')
        .setColor(color)
        .setDescription('Here\'s the randomly created teams for you')
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
    const { user } = message.client;
    const member = message.guild.members.cache.get(user.id);

    const joinDate = getDateAsString(member.joinedAt);

    return new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setDescription('Information about bot')
        .setColor(color)
        .setURL(website)
        .addFields(
            {
                name: 'Website',
                value: website
            },
            {
                name: 'Joined At ',
                value: `${joinDate}`,
                inline: true
            },
            {
                name: 'Prefix ',
                value: `${prefix}`,
                inline: true
            },
            {
                name: 'Help Command',
                value: `${prefix}help`,
                inline: true
            },
            {
                name: 'Issue Report',
                value: `${prefix}issue`,
                inline: true
            },
            {
                name: 'Language',
                value: 'English',
                inline: true
            },
            {
                name: 'Version',
                value: version,
                inline: true
            }
        )
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(user.avatarURL());
}


function helloOnJoin(guild, db) {
    const { user } = guild.client;
    const memberObj = guild.members.cache.get(user.id);

    const joinDate = getDateAsString(memberObj.joinedAt);

    const description = [];
    description.push(`I am happy to here. Thank you for adding me to ${guild.name}. I am a multipurpose bot with many capabilities. Here's a little bit information about me and configurations for this guild.\n`);
    description.push(`**Website**\n ${website}\n`);
    description.push(`**Joined At:** ${joinDate}`);
    description.push(`**Prefix:** ${prefix}`);
    description.push(`**Status and Activity:** ${toTitleCase(defaultState)}, ${toTitleCase(`${defaultActivity.type} ${defaultActivity.name}`)}`);
    description.push(`**Help Command:** ${prefix}help`);
    description.push(`**Role Management:** ${db !== null && db.roleManagement ? 'Active' : 'Inactive'}`);
    description.push(`**Welcome Messages:** ${db !== null && db.welcomeMessage.enabled ? 'Active' : 'Inactive'}`);
    description.push(`**Warnings for Members:** ${db !== null && db.warnings ? 'Active' : 'Inactive'}`);
    description.push(`**Moderation Messages:** ${db !== null && db.moderationMessages.enabled ? 'Active' : 'Inactive'}`);
    description.push(`**Disabled Music Embeds:** ${db !== null && db.disableMusicEmbeds ? 'Active' : 'Inactive'}`);

    return new Discord.MessageEmbed()
        .setTitle(`Hello I am ${memberObj.displayName}.`)
        .setColor(color)
        .setDescription(description.join('\n'))
        .setURL(website)
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
            if (args[1] === '') {
                embed.addField('Banned By', args[1]);
            }
        }
        else if (action === 'Ban Remove') {
            embed.setTitle('Ban Remove')
                .setDescription('Ban Remove Details')
                .setColor(colorSet.GreenYellow)
                .addField('Unbanned User', `${args[0].tag} (${args[0].id})`)
                .setThumbnail(args[0].avatarURL());
        }
        else if (action === 'Member Remove') {
            if (args[1] === '') {
                embed.setTitle('Member Leave')
                    .setDescription('Member is left the guild')
                    .setThumbnail(args[0].user.avatarURL())
                    .setColor(colorSet.DarkOrange)
                    .addField('Member', `${args[0].displayName} (${args[0].id})`);
            }
            else {
                embed.setTitle('Member Kicked')
                    .setDescription('Member is kicked from the guild')
                    .setThumbnail(args[0].user.avatarURL())
                    .setColor(colorSet.DarkOrange)
                    .addField('Member', `${args[0].displayName} (${args[0].id})`)
                    .addField('Kicked By', args[1]);
            }
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
        .setDescription(`**Warned By:** ${warner} \n**Member:** ${member.user.tag} - (${member.id}) \n**Reason:** ${reason}`);
}


function support(message) {
    return new Discord.MessageEmbed()
        .setTitle(`Here's contact channels for ${message.client.user.username}`)
        .setDescription('You can reach community from this channels')
        .addFields(
            {
                name: 'Discord Community',
                value: contact.invite
            },
            {
                name: 'Website',
                value: contact.website
            },
            {
                name: 'Instagram',
                value: contact.instagram
            }
        )
        .setThumbnail()
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(message.client.user.avatarURL());
}


function userEmbed(member, result) {
    const { roles } = member.guild;
    // eslint-disable-next-line no-underscore-dangle
    const roleList = member._roles.map((id) => roles.cache.get(id).name)
        .join(', ');

    if (result == null) {
        result = {
            level: '-',
            connections: []
        };
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setDescription('General information about memberEmbed')
        .setColor(color)
        .addFields(
            {
                name: 'Roles',
                value: `${roleList.length > 0 ? roleList : 'No Roles'}`
            },
            {
                name: 'Level ',
                value: result.level,
                inline: true
            }
        )
        .setFooter(`${member.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());

    if (result.connections.length > 0) {
        const connections = [];
        const length = 0;
        result.connections.forEach((conn) => {
            const text = `__${conn.name}__\n${conn.url}\n`;
            if (length + text.length > 1024) {
                embed.addField('\u200B', connections.join('')
                    .substr());
                connections.length = 0;
            }
            else {
                connections.push(text);
            }
        });
        if (connections.length > 0) {
            embed.addField('\u200B', connections.join('')
                .substr());
        }
    }

    return embed;
}


function presenceUpdate(presence) {
    return new Discord.MessageEmbed()
        .setTitle(`${presence.member.displayName} now Playing`)
        .setDescription(`${presence.activities[0].name} - ${presence.activities[0].details}`)
        .setThumbnail(presence.activities[0].assets.largeImage)
        .setFooter(`${presence.guild.name} -  Discord`)
        .setTimestamp();
}


function nowPlaying(guildName, song) {
    const embed = new Discord.MessageEmbed()
        .setTitle(song.title)
        .setAuthor(`Now Playing${song.type === 'Live' ? ' - LIVE' : ''}`)
        .setURL(song.url)
        .setColor(color)
        .setThumbnail(song.thumbnail)
        .setTimestamp()
        .setFooter(`${guildName} -  Discord`);

    const content = [`**Channel:** ${song.channel}`];

    if (Object.prototype.hasOwnProperty.call(song, 'length')) {
        content.push(`**Length:** ${song.length}`);
    }
    if (Object.prototype.hasOwnProperty.call(song, 'watching') && song.watching != null) {
        content.push(`**Watching:** ${song.watching}`);
    }
    content.push(`**Added By:** ${song.addedBy}`);

    embed.setDescription(content.join('\n'));
    return embed;
}


function queue(guildName, playlist) {
    const content = [];
    let i = 0;
    let end = playlist.songs.length;
    if (playlist.songs.length > 16) {
        i = Math.max(playlist.playing - 5, 0);
        end = Math.min(playlist.playing + 10, playlist.songs.length);
    }

    for (i; i < end; i++) {
        if (i === playlist.playing) {
            content.push(`**${i + 1}. ${playlist.songs[i].title}**`);
        }
        else {
            content.push(`${i + 1}. ${playlist.songs[i].title}`);
        }
    }

    return new Discord.MessageEmbed()
        .setTitle('Play Queue')
        .setDescription(content.join('\n'))
        .setColor(color)
        .setThumbnail(playlist.songs[playlist.playing].thumbnail)
        .setTimestamp()
        .setFooter(`${guildName} -  Discord`);
}


function search(guildName, searchQuery, videos) {
    const content = [`Search results for: _${searchQuery}_\n`];

    for (let i = 0; i < videos.length; i++) {
        content.push(`**${i + 1}. ${videos[i].title}**\n${videos[i].author.name}\n`);
    }

    return new Discord.MessageEmbed()
        .setTitle('Search')
        .setColor(color)
        .setDescription(content.join('\n'))
        .setThumbnail(videos[0].thumbnail)
        .setTimestamp()
        .setFooter(`${guildName} -  Discord`);
}


module.exports = {
    help,
    serverInfo,
    member: memberEmbed,
    role: roleEmbed,
    teams: teamsEmbed,
    botInfo,
    helloOnJoin,
    moderation,
    welcomeMessage,
    points,
    warning,
    support,
    user: userEmbed,
    presenceUpdate,
    nowPlaying,
    queue,
    search
};
