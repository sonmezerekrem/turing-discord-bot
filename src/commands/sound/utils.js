const yts = require('yt-search');
const ytdl = require('ytdl-core');

const logger = require('../../utils/logger');
const { nowPlaying } = require('../../utils/embeds');

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
const youtubeRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
const youtubeIdRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;


// https://stackoverflow.com/a/49849482/11388217
function isValidURL(string) {
    const res = string.match(urlRegex);
    return (res !== null);
}


// https://stackoverflow.com/a/28735961/11388217
function isYoutubeUrl(url) {
    if (url.match(youtubeRegex)) {
        return url.match(youtubeRegex)[1];
    }
    return false;
}


// https://stackoverflow.com/a/27728417/11388217
function getYoutubeVideoId(url) {
    if (url.match(youtubeIdRegex)) {
        return url.match(youtubeIdRegex)[1];
    }
    return false;
}


async function songInfo(args, message) {
    const song = {
        found: 0,
        id: null,
        type: 'Song',
        title: null,
        channel: null,
        thumbnail: null,
        url: null,
        length: null,
        seconds: null,
        release: null,
        textChannel: message.channel,
        message: null,
        addedBy: message.author
    };

    let video;

    if (!isValidURL(args[0])) {
        const title = args.join(' ');
        const result = await yts(title);
        // eslint-disable-next-line prefer-destructuring
        video = result.videos.slice(0, 1)[0];
    }
    if (isYoutubeUrl(args[0])) {
        const urlSearchParams = new URLSearchParams(args[0].split('?')[1]);
        const params = Object.fromEntries(urlSearchParams.entries());

        if (Object.prototype.hasOwnProperty.call(params, 'list')) {
            let videos = await yts({ listId: params.list });
            videos = videos.videos;
            let start = 0;
            const songList = [];
            if (Object.prototype.hasOwnProperty.call(params, 'index')) {
                start = parseInt(params.index, 10) - 1;
            }
            for (let i = start; i < videos.length; i++) {
                const songDetails = {
                    found: 1,
                    id: videos[i].videoId,
                    type: 'Song',
                    title: videos[i].title,
                    channel: null,
                    thumbnail: null,
                    url: null,
                    length: null,
                    seconds: null,
                    release: null,
                    textChannel: message.channel,
                    message: null,
                    addedBy: message.author
                };
                songList.push(songDetails);
            }
            return songList;
        }

        const id = getYoutubeVideoId(args[0]);
        video = await yts({ videoId: id });
        if (video.seconds === 0) {
            video = null;
            song.found = 2;
        }
    }

    if (video) {
        song.title = video.title;
        song.channel = video.author.name;
        song.thumbnail = video.thumbnail;
        song.length = video.timestamp;
        song.seconds = video.seconds;
        song.release = video.ago;
        song.url = video.url;
        song.found = 1;
    }

    return song;
}


async function liveStreamingInfo(args, message) {
    const live = {
        found: 0,
        type: 'Live',
        title: null,
        channel: null,
        thumbnail: null,
        url: null,
        watching: null,
        textChannel: message.channel,
        message: null,
        addedBy: message.author
    };

    let streaming;

    if (!isValidURL(args[0])) {
        const title = args.join(' ');
        const result = await yts(title);
        // eslint-disable-next-line prefer-destructuring
        streaming = result.live.slice(0, 1)[0];
    }
    else if (isYoutubeUrl(args[0])) {
        const id = getYoutubeVideoId(args[0]);
        if (id) {
            streaming = await yts({ videoId: id });
        }
    }

    if (streaming) {
        live.title = streaming.title;
        live.channel = streaming.author.name;
        live.thumbnail = streaming.thumbnail;
        live.watching = streaming.watching;
        live.url = streaming.url;
        live.found = 1;
    }

    return live;
}


function getPlaylist(client, guildId) {
    if (!client.playlists.has(guildId)) {
        client.playlists.set(guildId, {
            connection: null,
            songs: [],
            volume: 1,
            playing: null,
            loop: 0,
            shuffle: 0
        });
    }
    return client.playlists.get(guildId);
}


async function fillSongInfo(client, guildId) {
    const playlist = getPlaylist(client, guildId);

    const song = playlist.songs[playlist.playing];

    const video = await yts({ videoId: song.id });

    if (video) {
        song.title = video.title;
        song.channel = video.author.name;
        song.thumbnail = video.thumbnail;
        song.length = video.timestamp;
        song.seconds = video.seconds;
        song.release = video.ago;
        song.url = video.url;
        song.found = 1;
    }
}


function deletePlayMessage(client, guildId) {
    const playlist = getPlaylist(client, guildId);
    if (playlist.playing !== null) {
        let curr;
        if (playlist.playing === -1) {
            // eslint-disable-next-line prefer-destructuring
            curr = playlist.songs[0];
        }
        else {
            curr = playlist.songs[playlist.playing];
        }
        if (curr.textChannel !== null && curr.message !== null) {
            curr.textChannel.messages.fetch(curr.message)
                .then((msg) => {
                    msg.delete()
                        .then(() => {
                            curr.message = null;
                        });
                })
                .catch((error) => logger.error(error.message));
        }
    }
}


async function joinTheVoice(message) {
    const playlist = getPlaylist(message.client, message.guild.id);

    if (playlist.connection == null) {
        try {
            const connection = await message.member.voice.channel.join();
            connection.setSpeaking(0);
            await connection.voice.setDeaf(true);
            playlist.connection = connection;
        }
        catch (err) {
            logger.error(err.message);
        }
    }
}


async function playerAux(client, guildId) {
    const playlist = getPlaylist(client, guildId);

    if (playlist.connection) {
        const curr = playlist.songs[playlist.playing];
        if (curr != null) {
            if (curr.url == null) {
                await fillSongInfo(client, guildId);
            }
            if (curr.url != null) {
                curr.textChannel.send(nowPlaying(curr.textChannel.guild.name, curr))
                    .then((msg) => {
                        curr.message = msg.id;
                    })
                    .catch((error) => logger.error(error.message));
                const dispatcher = playlist.connection
                    .play(ytdl(`${curr.url}&html5=1&c=TVHTML5&cver=5.20150304`))
                    .on('finish', () => {
                        deletePlayMessage(client, guildId);
                        if (playlist.loop === 0 && playlist.shuffle === 0) {
                            if (playlist.playing < playlist.songs.length - 1) {
                                playlist.playing++;
                                playerAux(client, guildId);
                            }
                        }
                        else if (playlist.loop === 0 && playlist.shuffle === 1) {
                            if (playlist.playing < playlist.songs.length - 1) {
                                // eslint-disable-next-line max-len
                                playlist.playing = Math.floor(Math.random() * (playlist.songs.length - playlist.playing)) + playlist.playing;
                                playerAux(client, guildId);
                            }
                        }
                        else if (playlist.loop === 1 && playlist.shuffle === 0) {
                            if (playlist.playing === playlist.songs.length - 1) {
                                playlist.playing = 0;
                            }
                            else {
                                playlist.playing++;
                            }
                            playerAux(client, guildId);
                        }
                        else if (playlist.loop === 1 && playlist.shuffle === 1) {
                            playlist.playing = Math.floor(Math.random() * playlist.songs.length);
                            playerAux(client, guildId);
                        }
                        else if (playlist.loop === 2) {
                            playerAux(client, guildId);
                        }
                        else {
                            playlist.playing = null;
                        }
                    })
                    .on('error', (error) => {
                        deletePlayMessage(client, guildId);
                        curr.textChannel.send('Sorry, an error is occurred when trying to play the song');
                        logger.error(error.message);
                        playlist.playing = -2;
                    });
                dispatcher.setVolume(playlist.volume);
            }
        }
    }
}


async function player(message, next = 0) {
    const playlist = getPlaylist(message.client, message.guild.id);
    playlist.playing = next;
    await playerAux(message.client, message.guild.id);
    deletePlayMessage(message.client, message.guild.id);
}


module.exports = {
    songInfo,
    liveStreamingInfo,
    getPlaylist,
    player,
    joinTheVoice,
    deletePlayMessage
};
