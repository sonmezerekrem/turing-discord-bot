const { prefix, token } = require('../config.json');
const { client, queue } = require('../app');
const axios = require('axios').default;
const music = require('./music');
const logger = require('../utils/logger');
const embed = require('./embed');


client.on('message', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(`${prefix}join`)) {
        return await join(message);
    } else if (message.content.startsWith(`${prefix}leave`)) {
        return await leave(message);
    } else if (message.content.startsWith(`${prefix}play`)) {
        return await music.execute(message);
    } else if (message.content.startsWith(`${prefix}stop`)) {
        return music.stop(message);
    } else if (message.content.startsWith(`${prefix}skip`)) {
        return music.skip(message);
    } else if (message.content.startsWith(`${prefix}pause`)) {
        return music.pause(message);
    } else if (message.content.startsWith(`${prefix}resume`)) {
        return music.resume(message);
    } else if (message.content.startsWith(`${prefix}loop`)) {
        return music.loop(message);
    } else if (message.content.startsWith(`${prefix}clear`)) {
        return music.clear(message);
    } else if (message.content.startsWith(`${prefix}help`)) {
        return help(message);
    } else if (message.content.startsWith(`${prefix}info`)) {
        return info(message);
    } else if (message.content.startsWith(`${prefix}ping`)) {
        return ping(message);
    }else if (message.content.startsWith(`${prefix}me`)) {
        return me(message);
    }
    else if (message.content.startsWith(`${prefix}queue`)) {
        return music.showQueue(message);
    }
    else if (message.content.startsWith(`${prefix}top`)) {
        return top(message);
    }
    else {
        return message.channel.send(`You need to enter a valid command! To see possible commands -> ${prefix}help`);
    }
});


client.once('ready', () => {
    client.user.setActivity('Dota 2', { type: 'PLAYING' })
        .then((asd) => {
            logger.info(`${client.user.tag} is ready now.`, 0);
            logger.info('Activity is set to default.', 0);
        })
        .catch(err => {
            logger.error(err, 0);
        });
});


client.once('reconnecting', () => {
    client.user.setActivity('Dota 2', { type: 'PLAYING' }).then(() => {
        logger.info(`${client.user.tag} is reconnecting.`, 0);
        logger.info('Activity is set to default.', 0);
    });
});


client.once('disconnect', () => {
    logger.info(`${client.user.tag} is disconnecting.`, 0);
});


async function join(message) {
    if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        connection.voice.setSelfDeaf(true).then(() => {
            logger.info(`${client.user.tag} is connected to voice and set to deaf`, message.guild.id);
        });
        message.channel.send(`I am joined to ${message.member.voice.channel}`);
        return connection;
    } else {
        message.channel.send('You need to be in a voice channel!');
        return null;
    }
}


async function leave(message) {
    if (message.member.voice.channel) {
        message.member.voice.channel.leave();
        queue.delete(message.guild.id);
        client.user.setActivity('Dota 2', { type: 'PLAYING' }).then(() => {
            logger.info(`${client.user.tag} is disconnected to voice and set to default activity`, message.guild.id);
        });
        return message.channel.send(`I am leaving from ${message.member.voice.channel}`);
    } else {
        return message.channel.send('You need to be in a voice channel!');
    }
}


function help(message) {
    const args = message.content.split(' ');
    if (args.length === 1) {
        return message.channel.send(embed.helpEmbed(null));
    } else if (args.length === 2) {
        return message.channel.send(embed.helpEmbed(args[1]));
    } else {
        return message.channel.send('Invalid arguments');
    }
}


function info(message) {
    return message.channel.send(embed.infoEmbed(message));
}


function ping(message) {
    return message.reply(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
}

function me(message){
    return message.reply(embed.memberEmbed(message));
}

async function top(message) {
    return message.reply(embed.topEmbed(client.guilds.cache.get(message.guild.id)));
}


client.login(token);
