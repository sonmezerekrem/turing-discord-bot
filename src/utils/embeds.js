const Discord = require('discord.js');
const logger = require('./logger');
const {
    prefix,
    color,
    version,
    contact,
    defaultActivity,
    defaultState
} = require('../config.json');
const {
    categories,
    colorSet,
    emojiLetters
} = require('./variables');
const {
    toTitleCase,
    getDateAsString
} = require('./functions');
const {
    topCanvas
} = require('./canvases');


function help(message, args) {
    const content = [];
    const { commands } = message.client;
    const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setThumbnail(message.client.user.avatarURL())
        .setFooter(`${message.guild ? message.guild.name : 'DM'} -  Discord`)
        .setTimestamp();

    if (args.length === 0) {
        embed.setTitle('Help');
        content.push('Here\'s a list of all commands by categories:\n');
        content.push(`**Info**\n${commands.filter((command) => command.category === 'Info')
            .map((command) => command.name)
            .join(', ')}\n`);
        content.push(`**Moderation**\n${commands.filter((command) => command.category === 'Moderation')
            .map((command) => command.name)
            .join(', ')}\n`);
        content.push(`**Sound**\n${commands.filter((command) => command.category === 'Sound')
            .map((command) => command.name)
            .join(', ')}\n`);
        content.push(`**Leveling**\n${commands.filter((command) => command.category === 'Leveling')
            .map((command) => command.name)
            .join(', ')}\n`);
        content.push(`**Fun**\n${commands.filter((command) => command.category === 'Fun')
            .map((command) => command.name)
            .join(', ')}\n`);
        content.push(`**Bot**\n${commands.filter((command) => command.category === 'Bot')
            .map((command) => command.name)
            .join(', ')}\n`);
        content.push(`**Tool**\n${commands.filter((command) => command.category === 'Tool')
            .map((command) => command.name)
            .join(', ')}\n`);
        if (message.channel.type !== 'dm' && message.author.id === message.guild.ownerID) {
            content.push(`**Owner**\n${commands.filter((command) => command.category === 'Owner')
                .map((command) => command.name)
                .join(', ')}\n`);
        }
        embed.attachFiles(new Discord.MessageAttachment('./assets/images/icons/help.png', 'help.png'));
        embed.setThumbnail('attachment://help.png');
        content.push(`\nYou can send  \`${prefix}help [category name]\` or \`${prefix}help [command name]\` to get info on a specific category or command!`);
        embed.setDescription(content.join('\n'));
    }
    else {
        const name = args[0].toLowerCase();
        if (Object.prototype.hasOwnProperty.call(categories, name)) {
            if (name === 'owner' && message.author.id !== message.guild.ownerID) {
                return 'Only owner of this guild access this commands!';
            }
            embed.setTitle(`${toTitleCase(name)} Commands`);
            const categoryCommands = commands.filter((command) => command.category === toTitleCase(name));
            content.push(`${categories[name]}\n`);
            categoryCommands.forEach((command) => {
                content.push(`**${command.name}:** ${command.description}`);
            });
            content.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            embed.attachFiles(new Discord.MessageAttachment(`./assets/images/icons/${name.toLowerCase()}.png`, 'help.png'));
            embed.setThumbnail('attachment://help.png');
            embed.setDescription(content.join('\n\n'));
        }
        else {
            const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

            if (!command || (command.category === 'Owner' && message.author.id !== message.guild.ownerID)) {
                return 'That\'s not a valid category or command!';
            }

            embed.setTitle(command.name);
            content.push(`${command.description}\n`);
            content.push(`**Category:** ${command.category}`);
            content.push(`**Aliases:** ${command.aliases.length > 0 ? command.aliases.join(', ') : '-'}`);
            content.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
            if (Object.prototype.hasOwnProperty.call(command, 'link')) {
                content.push(`**Link:** ${command.link}`);
            }
            if (Object.prototype.hasOwnProperty.call(command, 'guildOnly') && !command.guildOnly) {
                content.push('**Dm:** Available');
            }
            embed.attachFiles(new Discord.MessageAttachment(`./assets/images/icons/${command.category.toLowerCase()}.png`, 'help.png'));
            embed.setThumbnail('attachment://help.png');
            embed.setDescription(content.join('\n'));
        }
    }

    return embed;
}


function serverInfo(message) {
    const { guild } = message;

    const embed = new Discord.MessageEmbed()
        .setTitle(guild.name)
        .setColor(color)
        .setDescription(guild.description ? guild.description : `Information about ${guild.name}`)
        .addFields(
            {
                name: '**Members**',
                value: `${guild.members.cache.filter((member) => !member.user.bot).size}`,
                inline: true
            },
            {
                name: '**Bots**',
                value: guild.members.cache.filter((member) => member.user.bot).size,
                inline: true
            },
            {
                name: '**Online**',
                value: guild.members.cache.filter((member) => member.presence.status === 'online').size,
                inline: true
            },
            {
                name: '**AFK Channel**',
                value: `${guild.afkChannel ? guild.afkChannel : 'Not Set'}`,
                inline: true
            },
            {
                name: '**Region**',
                value: `${guild.region.charAt(0)
                    .toUpperCase() + guild.region.substring(1)}`,
                inline: true
            },
            {
                name: '**Created**',
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
    return embed;
}


function memberEmbed(message, result) {
    const { member } = message;
    const { roles } = message.guild;

    const date = getDateAsString(member.joinedAt);
    // eslint-disable-next-line no-underscore-dangle
    const roleList = member._roles.map((id) => roles.cache.get(id).name)
        .join(', ');

    if (result == null || result === 404) {
        result = {
            points: '-',
            level: '-'
        };
    }

    return new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setDescription(`Roles, points... All about ${member.user.tag}`)
        .setColor(color)
        .addFields(
            {
                name: '**Roles**',
                value: `${roleList.length > 0 ? roleList : 'No Roles'}`
            },
            {
                name: '**Joined At**',
                value: `${date}`,
                inline: true
            },
            {
                name: '**Points**',
                value: result.points,
                inline: true
            },
            {
                name: '**Level**',
                value: result.level,
                inline: true
            }
        )
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL() != null ? member.user.avatarURL() : 'https://cdn.discordapp.com/embed/avatars/0.png');
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
        .setColor(color)
        .setThumbnail(message.guild.iconURL())
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
        const teamName = `Team ${i + 1}`;

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
        .setURL(contact.website)
        .addFields(
            {
                name: '**Website**',
                value: contact.website
            },
            {
                name: '**Github**',
                value: contact.github
            },
            {
                name: '**Joined At**',
                value: `${joinDate}`,
                inline: true
            },
            {
                name: '**Prefix **',
                value: `${prefix}`,
                inline: true
            },
            {
                name: '**Help Command**',
                value: `${prefix}help`,
                inline: true
            },
            {
                name: '**Issue Report**',
                value: `${prefix}issue`,
                inline: true
            },
            {
                name: '**Language**',
                value: 'English',
                inline: true
            },
            {
                name: '**Version**',
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
    description.push(`**Website**\n ${contact.website}\n`);
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
        .setURL(contact.website)
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
        logger.error(`Moderation embed error: ${e.message}`);
    }

    return embed;
}


function channelEvents(type, args) {
    if (type === 'create') {
        const content = [
            `**Channel ID:** ${args.id}`,
            `**Channel Name:** ${args.name}`,
            `**Channel Type:** ${args.type}`
        ];
        return new Discord.MessageEmbed()
            .setTitle('Channel Created')
            .setDescription(content.join('\n'))
            .setTimestamp()
            .setThumbnail(args.guild.iconURL() != null ? args.guild.iconURL() : 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setFooter(`${args.guild.name} -  Discord`)
            .setColor(colorSet.RoyalBlue);
    }
    else if (type === 'delete') {
        const content = [
            `**Channel ID:** ${args.id}`,
            `**Channel Name:** ${args.name}`,
            `**Channel Type:** ${args.type}`
        ];
        return new Discord.MessageEmbed()
            .setTitle('Channel Deleted')
            .setDescription(content.join('\n'))
            .setTimestamp()
            .setThumbnail(args.guild.iconURL() != null ? args.guild.iconURL() : 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setFooter(`${args.guild.name} -  Discord`)
            .setColor(colorSet.RoyalBlue);
    }
    else {
        const content = [
            `**Channel ID:** ${args[0].id}`,
            `**Channel Name:** ${args[0].name}`,
            `**Updated Property:** ${args[1].field}`,
            `**Message:** ${args[1].message}`
        ];
        if (args[1].id) {
            content.push(`**ID of Affected Role/Member:** ${args[1].id}`);
        }
        return new Discord.MessageEmbed()
            .setTitle('Channel Updated')
            .setDescription(content.join('\n'))
            .setTimestamp()
            .setThumbnail(args[0].guild.iconURL() != null ? args[0].guild.iconURL() : 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setFooter(`${args[0].guild.name} -  Discord`)
            .setColor(colorSet.RoyalBlue);
    }
}


function inviteEvent(args) {
    const content = ['New invite is created',
        `**Url:** ${args.url}`,
        `**Creator:** ${args.tag}(${args.id})`,
        `**Expires At:** ${getDateAsString(args.expires)}`];
    return new Discord.MessageEmbed()
        .setTitle('Invite Created')
        .setDescription(content.join('\n'))
        .setColor(colorSet.Indigo)
        .setThumbnail(args.avatar != null ? args.avatar : 'https://cdn.discordapp.com/embed/avatars/0.png')
        .setFooter(`${args.guild} -  Discord`);
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
        .setDescription(`You earn points\n\n**Points:** ${point}\n\n**Source:** ${source}`)
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
                name: '**Discord Community**',
                value: contact.invite
            },
            {
                name: '**Website**',
                value: contact.website
            },
            {
                name: '**Instagram**',
                value: contact.instagram
            },
            {
                name: '**Github Repository**',
                value: contact.github
            }
        )
        .setThumbnail()
        .setFooter(`${message.guild.name} -  Discord`)
        .setTimestamp()
        .setColor(color)
        .setThumbnail(message.client.user.avatarURL());
}


function userEmbed(member, result) {
    const { roles } = member.guild;
    // eslint-disable-next-line no-underscore-dangle
    const roleList = member._roles.map((id) => roles.cache.get(id).name)
        .join(', ');

    return new Discord.MessageEmbed()
        .setTitle(member.displayName)
        .setDescription(`General information about ${member.displayName}`)
        .setColor(color)
        .addFields(
            {
                name: '**Roles**',
                value: `${roleList.length > 0 ? roleList : 'No Roles'}`
            },
            {
                name: '**Level**',
                value: result.level,
                inline: true
            }
        )
        .setFooter(`${member.guild.name} -  Discord`)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());
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
        const song = playlist.songs[i];
        if (song.found === 3 || song.found === 4) {
            if (i === playlist.playing) {
                content.push(`**${i + 1}. ${song.spotify}**\n${song.length ? song.length : '-:-'}`);
            }
            else {
                content.push(`${i + 1}. ${song.spotify}\n${song.length ? song.length : '-:-'}`);
            }
        }
        else {
            // eslint-disable-next-line no-lonely-if
            if (i === playlist.playing) {
                content.push(`**${i + 1}. ${song.title}**\n${song.length ? song.length : '-:-'}`);
            }
            else {
                content.push(`${i + 1}. ${song.title}\n${song.length ? song.length : '-:-'}`);
            }
        }
    }
    const embed = new Discord.MessageEmbed()
        .setTitle('Play Queue')
        .setDescription(content.join('\n'))
        .setColor(color)
        .setTimestamp()
        .setFooter(`${guildName} -  Discord`);


    if (playlist.playing != null && playlist.playing !== -2 && playlist.playing !== -3) {
        embed.setThumbnail(playlist.songs[playlist.playing].thumbnail);
    }
    return embed;
}


function search(guildName, searchQuery, videos) {
    const content = [`Search results for: _${searchQuery}_. You can choose one of them just sending a number between 1 and 5.\n`];

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


async function top(guildName, thumbnail, toplist) {
    const image = await topCanvas(toplist);
    const embed = new Discord.MessageEmbed()
        .setTitle(`Toplist at ${guildName}`)
        .setColor(color)
        .setDescription(`Top ranked members by points at ${guildName}`)
        .setImage('attachment://top.jpg')
        .setThumbnail(thumbnail)
        .setTimestamp()
        .setFooter(`${guildName} -  Discord`);
    return {
        files: [image],
        // eslint-disable-next-line object-shorthand
        embed: embed
    };
}


function pollAnswers(question, answers, guild, member) {
    const content = [
        `**Created by:** ${member}\n`,
        `**Question:** ${question}\n`
    ];
    for (let i = 0; i < answers.length; i++) {
        content.push(`${emojiLetters[i]} ${answers[i]}\n`);
    }
    return new Discord.MessageEmbed()
        .setTitle('Poll')
        .setDescription(content.join('\n').substring(0, 2048))
        .setFooter(`${guild} -  Discord`)
        .setTimestamp()
        .setColor(color)
        .setThumbnail(member.user.avatarURL() != null ? member.user.avatarURL() : 'https://cdn.discordapp.com/embed/avatars/0.png');
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
    nowPlaying,
    queue,
    search,
    top,
    pollAnswers,
    channelEvents,
    inviteEvent
};
