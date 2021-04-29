const axios = require('axios').default;
const ytdl = require('ytdl-core');

const logger = require('../../utils/logger');

const { queue, play, isValidUrl } = require('./commons');

const { youtubeKey } = require('../../env.json');

const { youtubeUrl, youtubeApiUrl } = require('../../configs/config.json');

module.exports = {
    name: 'play',
    description: 'Plays a music with given queries or Youtube URL',
    guildOnly: true,
    args: false,
    aliases: ['p'],
    usage: '[query  |  URL]',
    execute: async function(message, args) {
        const serverQueue = queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            logger.warning('Bot needs permission to speak and connect', message.guild.id);
            return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

        if (args.length === 0) {
            if (serverQueue) {
                if (serverQueue.songs.length > 0) {
                    return message.channel.send('There is no song in history');
                }
                play(message.guild, 0);
            } else {
                return message.channel.send('There is no song in history');
            }
        }

        let searchUrl = args[0];
        if (!isValidUrl(searchUrl)) {
            const youtubeResponse = await axios.get(youtubeApiUrl, {
                params: {
                    key: youtubeKey,
                    type: 'video',
                    part: 'snippet',
                    q: args.join(' '),
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
            length: songInfo.videoDetails.lengthSeconds,
            year: songInfo.videoDetails.publishDate,
            addedBy: message.author,
        };

        if (!serverQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 1,
                playing: null,
                loop: 0,
                lastPlayMessage: null,
            };

            queue.set(message.guild.id, queueContruct);

            queueContruct.songs.push(song);
            try {
                voiceChannel.join().then(connection => {
                    connection.voice.setSelfDeaf(true).then(() => {
                        logger.info(`${message.client.user.tag} is connected to voice and set to deaf`, message.guild.id);
                    });
                    queueContruct.connection = connection;
                    play(message.guild, 0);
                })
                    .catch(error => {
                        logger.error(error, message.guild.id);
                    });
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
    },
};