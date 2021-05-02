const ytdl = require('ytdl-core');
const embed = require('../../embeds/playingEmbed');
const logger = require('../../utils/logger');

const queue = new Map();

const play = (guild, songNo) => {
    const serverQueue = queue.get(guild.id);
    logger.info(`Play method has been called with songNo:${serverQueue.songs[songNo].title} guild:${guild.id}`);
    if (songNo > serverQueue.songs.length - 1) {
        if (serverQueue.loop === 1)
            songNo = 0;
        else
            return;
    }

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
    songInfo: songInfo
};


