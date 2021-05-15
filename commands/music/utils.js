const ytdl = require('ytdl-core');
const axios = require('axios').default;
const stringSimilarity = require('string-similarity');
const embed = require('../../embeds/playingEmbed');
const logger = require('../../utils/logger');
const { geniusApi, youtubeUrl, youtubeApiUrl } = require('../../config.json');
const youtubeKey = process.env.youtubeKey;
const geniusToken = process.env.geniusToken;
const queue = new Map();


const songInfo = async (args, author) => {
    const song = {
        title: null,
        artist: null,
        album: null,
        release: null,
        lyricsUrl: null,
        lyrics: null,
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
        addedBy: author
    };

    if (!isSongUrl(args[0])) {
        const youtubeSearch = await axios.get(youtubeApiUrl, {
            params: {
                key: youtubeKey,
                type: 'video',
                part: 'snippet',
                q: args.join(' ')
            }
        })
            .catch(error => {
                logger.error(error);
                return null;
            });

        if (youtubeSearch.status === 200) {
            song.youtubeUrl = youtubeUrl + youtubeSearch.data.items[0].id.videoId;
            song.youtubeChannel = youtubeSearch.data.items[0].snippet.channelTitle;
            song.youtubeTitle = youtubeSearch.data.items[0].snippet.title;
            song.youtubeThumbnail = youtubeSearch.data.items[0].snippet.thumbnails.default.url;
            song.release = youtubeSearch.data.items[0].snippet.publishedAt.substr(0, 4);
        }
    }
    else {
        const youtubeSearch = await ytdl.getInfo(args[0])
            .catch(error => {
                logger.error(error);
                return null;
            });
        song.youtubeTitle = youtubeSearch.videoDetails.title;
        song.youtubeUrl = youtubeSearch.videoDetails.video_url;
        song.youtubeThumbnail = youtubeSearch.videoDetails.thumbnails[0].url;
        song.length = youtubeSearch.videoDetails.lengthSeconds;
        song.release = youtubeSearch.videoDetails.publishDate;
    }

    const title = getTitle(song.youtubeTitle);
    try {
        const result = await axios({
            method: 'get',
            url: geniusApi + '/search',
            data: {
                q: title
            },
            headers: {
                Authorization: 'Bearer ' + geniusToken
            }
        }).catch(error => logger.error(error));
        if (result.status === 200 && result.data.meta.status === 200) {
            for (let i = 0; i < result.data.response.hits.length; i++) {
                if (result.data.response.hits[i].type === 'song') {
                    if (stringSimilarity.compareTwoStrings(title, result.data.response.hits[i].result.full_title) > 0.4) {
                        const songDetail = await axios({
                            method: 'get',
                            url: geniusApi + result.data.response.hits[i].result.api_path,
                            headers: {
                                Authorization: 'Bearer ' + geniusToken
                            }
                        }).catch(error => logger.error(error));

                        if (songDetail.status === 200 && songDetail.data.meta.status === 200) {
                            song.title = songDetail.data.response.song.title_with_featured;
                            song.artist = songDetail.data.response.song.primary_artist.name;
                            song.album = songDetail.data.response.song.album.name;
                            song.release = songDetail.data.response.song.release_date.substr(0, 4);
                            song.lyricsUrl = songDetail.data.response.song.url;
                            song.color = songDetail.data.response.song.song_art_primary_color;
                            song.thumbnail = songDetail.data.response.song.song_art_image_thumbnail_url;
                            song.spotifyUrl = songDetail.data.response.song.media[1].url;
                            song.soundcloudUrl = songDetail.data.response.song.media[2].url;
                            song.geniusSongUrl = songDetail.data.response.song.description_annotation.url;
                        }
                        break;
                    }
                }
            }
        }
    }
    catch (e) {
        logger.error(e);
    }

    return song;
};


const getTitle = (youtubeTitle) => {
    let title = youtubeTitle.toLowerCase();
    return title.replace(/official/g, '')
        .replace(/video/g, '')
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .replace(/lyrics/g, '')
        .replace(/lyric/g, '')
        .replace(/music/g, '')
        .replace(/original/g, '')
        .replace(/clip/g, '');
};


const play = (guild, songNo) => {
    const serverQueue = queue.get(guild.id);

    if (songNo > serverQueue.songs.length - 1) {
        if (serverQueue.loop === 1)
            songNo = 0;
        else
            return;
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
            else
                play(guild, songNo);
        })
        .on('error', (error) => logger.error(`${error} guild:${guild.id}`));
    dispatcher.setVolume(serverQueue.volume);
    serverQueue.textChannel.send(embed.execute(guild, [song])).then(sent => {
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
            message.member.voice.channel.join().then(connection => {
                connection.voice.setSelfDeaf(true).then(() => {
                    logger.info(`${message.client.user.tag} has connected to voice and set to deaf at guild:${message.guild.id}`);
                });
                queueContruct.connection = connection;
                play(message.guild, 0);
            })
                .catch(error => {
                    logger.error(error, message.guild.id);
                });
        }
        catch (err) {
            logger.error(err.toString(), message.guild.id);
            queue.delete(message.guild.id);
        }
    }
    else {
        serverQueue.songs.push(song);
        if (serverQueue.songs.length === 1) {
            play(message.guild, 0);
        }
        else
            return message.channel.send(`${song.title != null ? song.artist + ' - ' + song.title : song.youtubeTitle} has been added to the queue!`);
    }
};


const isSongUrl = (url) => {
    try {
        let Url = new URL(url);
        return Url.hostname.includes('youtube');
    }
    catch (e) {
        return false;
    }
};


const deletePlayMessage = (guild) => {
    const serverQueue = queue.get(guild.id);
    if (serverQueue.lastPlayMessage != null) {
        serverQueue.textChannel.messages.fetch(serverQueue.lastPlayMessage).then((msg) => {
            msg.delete().then(() => {
                logger.debug(`Play message is deleted with id - ${serverQueue.lastPlayMessage} guild:${guild.id}`);
                serverQueue.lastPlayMessage = null;
            });
        });
    }
};


module.exports = {
    queue: queue,
    play: play,
    isValidUrl: isSongUrl,
    deletePlayMessage: deletePlayMessage,
    songInfo: songInfo,
    setServerQueue: setServerQueue
};


