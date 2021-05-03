const ytdl = require('ytdl-core');
const embed = require('../../embeds/playingEmbed');
const logger = require('../../utils/logger');

const queue = new Map();

const play = (guild, songNo) => {
    const serverQueue = queue.get(guild.id);

    if (songNo > serverQueue.songs.length - 1) {
        if (serverQueue.loop === 1)
            songNo = 0;
        else
            return;
    }
    logger.info(`Play method has been called with song:${serverQueue.songs[songNo].title} guild:${guild.id}`);

    deletePlayMessage(guild);

    const song = serverQueue.songs[songNo];

    serverQueue.playing = songNo;

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            logger.debug(`${songNo} is finished guild:${guild.id}`);
            if (queue.get(guild.id).loop < 2) {
                play(guild, songNo + 1);
            } else
                play(guild, songNo);
        })
        .on('error', (error) => logger.error(`${error} guild:${guild.id}`));
    dispatcher.setVolume(serverQueue.volume);
    serverQueue.textChannel.send(embed.execute(guild, [song])).then(sent => {
        serverQueue.lastPlayMessage = sent.id;
    });
};

const setServerQueue = (message, serverQueue, song) => {
    if (!serverQueue) {
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
        } catch (err) {
            logger.error(err.toString(), message.guild.id);
            queue.delete(message.guild.id);
        }
    }
    else {
        serverQueue.songs.push(song);
        if (serverQueue.songs.length === 1) {
            play(message.guild, 0);
        } else
            return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

const isValidUrl = (url) => {
    try {
        let Url = new URL(url);
        return Url.hostname.includes('youtube');
    } catch (e) {
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

const songInfo = async (url, author) => {
    const song = await ytdl.getInfo(url);
    return {
        title: song.videoDetails.title,
        url: song.videoDetails.video_url,
        image: song.videoDetails.thumbnails[0].url,
        length: song.videoDetails.lengthSeconds,
        year: song.videoDetails.publishDate,
        addedBy: author
    };
};

module.exports = {
    queue: queue,
    play: play,
    isValidUrl: isValidUrl,
    deletePlayMessage: deletePlayMessage,
    songInfo: songInfo,
    setServerQueue: setServerQueue
};


