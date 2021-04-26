const { youtubeKey, apiUrl } = require('../config.json');
const { client, queue } = require('../app');
const axios = require('axios').default;
const ytdl = require('ytdl-core');

const utils = require('../utils/utils');
const logger = require('../utils/logger');
const embed = require('./embed');
const isValidUrl = utils.isValidUrl;
const songEmbed = embed.songEmbed;

const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search`;
const youtubeUrl = 'https://www.youtube.com/watch?v=';

async function execute(message) {
    const serverQueue = queue.get(message.guild.id);
    const args = message.content.split(' ');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        logger.warning('Bot needs permission to speak and connect', message.guild.id);
        return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }

    let searchUrl = args[1];
    if (!isValidUrl(searchUrl)) {
        const youtubeResponse = await axios.get(youtubeApiUrl, {
            params: {
                key: youtubeKey,
                type: 'video',
                part: 'snippet',
                maxResults: 1,
                q: args.slice(1).join(' '),
            },
        });
        if (youtubeResponse.status === 200) {
            searchUrl = youtubeUrl + youtubeResponse.data.items[0].id.videoId;
        } else {
            return message.channel.send('Song couldn\'t found');
        }
    }

    const songInfo = await ytdl.getInfo(searchUrl);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        image: songInfo.videoDetails.thumbnails[0].url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: null,
            loop: 0,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);
        try {
            queueContruct.connection = await voiceChannel.join();
            play(message.guild, 0);
        } catch (err) {
            logger.error(err.toString(), message.guild.id);
            queue.delete(message.guild.id);
        }
    } else {
        serverQueue.songs.push(song);
        if (serverQueue.songs.length === 1) {
            play(message.guild, 0);
        } else
            return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
        return message.channel.send('You have to be in a voice channel to stop the music!');

    if (!serverQueue) return message.channel.send('There is no song that I could skip!');

    serverQueue.connection.dispatcher.end();
}

function stop(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
        return message.channel.send('You have to be in a voice channel to stop the music!');

    if (!serverQueue) return message.channel.send('There is no song that I could stop!');

    serverQueue.songs = [];
    serverQueue.playing = null;
    serverQueue.connection.dispatcher.end();
}

function play(guild, songNo) {
    const serverQueue = queue.get(guild.id);
    if (songNo > serverQueue.songs.length - 1) {
        if (serverQueue.loop === 1) {
            songNo = 0;
        } else {
            client.user.setActivity('Dota 2', { type: 'PLAYING' }).then(() => {
                logger.info('Activity is set to default.', guild.id);
            });
            return;
        }
    }
    const song = serverQueue.songs[songNo];

    serverQueue.playing = songNo;

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            if (queue.get(guild.id).loop < 2)
                play(guild, songNo + 1);
            else
                play(guild, songNo);
        })
        .on('error', (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    client.user.setActivity('Music', { type: 'STREAMING' }).then(() => {
        logger.info('Activity is set to streaming music.', guild.id);
    });
    serverQueue.textChannel.send(songEmbed(guild, song));
}

function pause(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
        return message.channel.send('You have to be in a voice channel to pause the music!');

    if (!serverQueue) return message.channel.send('There is no song that I could pause!');

    if (!serverQueue.connection.dispatcher.paused)
        serverQueue.connection.dispatcher.pause();
}

function resume(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
        return message.channel.send('You have to be in a voice channel to resume the music!');

    if (!serverQueue) return message.channel.send('There is no song that I could resume!');

    if (serverQueue.connection.dispatcher.paused)
        serverQueue.connection.dispatcher.resume();
}

function loop(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
        return message.channel.send('You have to be in a voice channel to loop the music!');

    if (!serverQueue) return message.channel.send('There is no song that I could loop!');

    const args = message.content.split(' ');
    if (args.length === 1) {
        serverQueue.loop = 1;
    } else if (args.length === 2) {
        if (args[1] === 'self')
            serverQueue.loop = 2;
    } else {
        return message.channel.send('Invalid arguments');
    }
}

function clear(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
        return message.channel.send('You have to be in a voice channel to clear the play queue!');

    if (!serverQueue) return message.channel.send('There is no song that I could clear!');

    serverQueue.songs = [];
    serverQueue.playing = null;
}

function showQueue(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
        return message.channel.send('You have to be in a voice channel to show  the play queue!');

    if (!serverQueue) return message.channel.send('There is no song that I could show!');

    if (serverQueue.songs.length > 0)
        return message.channel.send(embed.queueEmbed(message, serverQueue.songs, serverQueue.playing));
    else
        return message.channel.send('There is no song that I could show!');
}

function shuffle(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel)
        return message.channel.send('You have to be in a voice channel to show  the play queue!');

    if (!serverQueue) return message.channel.send('There is no song that I could show!');

    if (serverQueue.songs.length > 0) {

        return message.channel.send('The play queue has shuffled.');
    } else
        return message.channel.send('There is no song that I could show!');
}

function playlist(message) {
}

function savePlaylist(message) {
}

function deletePlaylist(message) {
}

function playlists(message) {
}

module.exports = {
    execute,
    stop,
    skip,
    pause,
    resume,
    loop,
    clear,
    showQueue,
};
