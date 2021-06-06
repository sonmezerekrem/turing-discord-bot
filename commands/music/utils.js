const ytdl = require('ytdl-core');
const axios = require('axios').default;
const embed = require('../../utils/embeds').playingSong;
const logger = require('../../utils/logger');
const {
    geniusApi,
    youtubeUrl,
    youtubeSearchApiUrl
} = require('../../config.json');


const queue = new Map();

const isSongUrl = (url) => {
    try {
        const Url = new URL(url);
        return Url.hostname.includes('youtube');
    }
    catch (e) {
        return false;
    }
};


const songInfo = async (args, author) => {
    const song = {
        title: null,
        artist: null,
        album: null,
        release: null,
        lyricsUrl: null,
        color: '#0099ff',
        length: null,
        thumbnail: null,
        youtubeUrl: null,
        youtubeThumbnail: null,
        youtubeTitle: null,
        youtubeChannel: null,
        spotifyUrl: null,
        soundcloudUrl: null,
        geniusSongUrl: null,
        isGenius: null,
        addedBy: author
    };

    if (!isSongUrl(args[0])) {
        const title = args.join(' ');
        try {
            const result = await axios({
                method: 'get',
                url: `${geniusApi}/search`,
                data: {
                    q: title
                },
                headers: {
                    Authorization: `Bearer ${process.env.GENIUS_TOKEN}`
                }
            })
                .catch((error) => logger.error(error.message));
            if (result.status === 200 && result.data.meta.status === 200) {
                for (let i = 0; i < result.data.response.hits.length; i++) {
                    if (result.data.response.hits[i].type === 'song') {
                        const songDetail = await axios({
                            method: 'get',
                            url: geniusApi + result.data.response.hits[i].result.api_path,
                            headers: {
                                Authorization: `Bearer ${process.env.GENIUS_TOKEN}`
                            }
                        })
                            .catch((error) => logger.error(error.message));

                        if (songDetail.status === 200 && songDetail.data.meta.status === 200) {
                            song.title = songDetail.data.response.song.title_with_featured;
                            song.artist = songDetail.data.response.song.primary_artist.name;
                            song.album = songDetail.data.response.song.album.name;
                            song.release = songDetail.data.response.song.release_date;
                            song.lyricsUrl = songDetail.data.response.song.url;
                            song.color = songDetail.data.response.song.song_art_primary_color;
                            song.thumbnail = songDetail.data.response.song.song_art_image_thumbnail_url;
                            for (let j = 0; j < songDetail.data.response.song.media.length; j++) {
                                if (songDetail.data.response.song.media[j].provider === 'youtube') {
                                    song.youtubeUrl = songDetail.data.response.song.media[j].url;
                                }
                                if (songDetail.data.response.song.media[j].provider === 'spotify') {
                                    song.spotifyUrl = songDetail.data.response.song.media[j].url;
                                }
                                if (songDetail.data.response.song.media[j].provider === 'soundcloud') {
                                    song.soundcloudUrl = songDetail.data.response.song.media[j].url;
                                }
                            }
                            song.geniusSongUrl = songDetail.data.response.song.description_annotation.url;
                            song.isGenius = true;
                        }
                        break;
                    }
                }
            }
        }
        catch (e) {
            logger.error(e.message);
        }

        if (song.youtubeUrl == null) {
            const youtubeSearch = await axios.get(youtubeSearchApiUrl, {
                params: {
                    key: process.env.YOUTUBE_KEY,
                    type: 'video',
                    part: 'snippet',
                    q: args.join(' ')
                }
            })
                .catch((error) => {
                    logger.error(error.message);
                    return null;
                });

            if (youtubeSearch.status === 200) {
                song.youtubeUrl = youtubeUrl + youtubeSearch.data.items[0].id.videoId;
                song.youtubeChannel = youtubeSearch.data.items[0].snippet.channelTitle;
                song.youtubeTitle = youtubeSearch.data.items[0].snippet.title;
                song.youtubeThumbnail = youtubeSearch.data.items[0].snippet.thumbnails.default.url;
                song.release = youtubeSearch.data.items[0].snippet.publishedAt.substr(0, 10);
            }
        }
    }
    else {
        const youtubeSearch = await ytdl.getInfo(args[0])
            .catch((error) => {
                logger.error(error.message);
                return null;
            });
        song.youtubeTitle = youtubeSearch.videoDetails.title;
        song.youtubeUrl = youtubeSearch.videoDetails.video_url;
        song.youtubeThumbnail = youtubeSearch.videoDetails.thumbnails[0].url;
        song.length = youtubeSearch.videoDetails.lengthSeconds;
        song.release = youtubeSearch.videoDetails.publishDate;
    }

    return song;
};


const deletePlayMessage = (guild) => {
    const serverQueue = queue.get(guild.id);
    if (serverQueue.lastPlayMessage != null) {
        serverQueue.textChannel.messages.fetch(serverQueue.lastPlayMessage)
            .then((msg) => {
                msg.delete()
                    .then(() => {
                        logger.debug(`Play message is deleted with id - ${serverQueue.lastPlayMessage} guild:${guild.id}`);
                        serverQueue.lastPlayMessage = null;
                    });
            });
    }
};


const play = (guild, songNo) => {
    const serverQueue = queue.get(guild.id);

    if (songNo > serverQueue.songs.length - 1) {
        if (serverQueue.loop === 1) {
            songNo = 0;
        }
        else {
            return;
        }
    }
    logger.info(`Play method has been called with song:${serverQueue.songs[songNo].youtubeTitle} guild:${guild.id}`);

    deletePlayMessage(guild);

    const song = serverQueue.songs[songNo];

    serverQueue.playing = songNo;

    const dispatcher = serverQueue.connection
        .play(ytdl(song.youtubeUrl))
        .on('finish', () => {
            logger.debug(`${songNo} is finished guild:${guild.id}`);
            if (queue.get(guild.id).loop < 2) {
                play(guild, songNo + 1);
            }
            else {
                play(guild, songNo);
            }
        })
        .on('error', (error) => logger.error(`${error.message} guild:${guild.id}`));
    dispatcher.setVolume(serverQueue.volume);
    serverQueue.textChannel.send(embed(guild, song))
        .then((sent) => {
            serverQueue.lastPlayMessage = sent.id;
        });
};


const setServerQueue = (message, serverQueue, song) => {
    if (!message.client.voice.connections.has(message.guild.id) || !serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: message.member.voice.channel,
            connection: null,
            songs: [],
            volume: 1,
            playing: null,
            loop: 0,
            lastPlayMessage: null
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);
        try {
            message.member.voice.channel.join()
                .then((connection) => {
                    connection.voice.setSelfDeaf(true)
                        .then(() => {
                            logger.info(`${message.client.user.tag} has connected to voice and set to deaf at guild:${message.guild.id}`);
                        });
                    queueContruct.connection = connection;
                    play(message.guild, 0);
                })
                .catch((error) => {
                    logger.error(error.message);
                });
        }
        catch (err) {
            logger.error(err.message, message.guild.id);
            queue.delete(message.guild.id);
        }
    }
    else {
        serverQueue.songs.push(song);
        if (serverQueue.songs.length === 1) {
            play(message.guild, 0);
        }
        else {
            return message.channel.send(`${song.title != null ? `${song.artist} - ${song.title}` : song.youtubeTitle} has been added to the queue!`);
        }
    }
};


module.exports = {
    queue,
    play,
    isValidUrl: isSongUrl,
    deletePlayMessage,
    songInfo,
    setServerQueue
};
