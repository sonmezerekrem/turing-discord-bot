const ytdl = require('ytdl-core');
const { playingEmbed } = require('../../utils/embed');
const logger = require('../../utils/logger');
const { defaultActivity } = require('../../config.json');

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
        .on('error', (error) => logger.error(`${error} guild:${message.guild.id}`));
    dispatcher.setVolume(serverQueue.volume);
    serverQueue.textChannel.send(playingEmbed(guild, song)).then(sent => {
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

module.exports = {
    queue: queue,
    play: play,
    isValidUrl: isValidUrl,
    deletePlayMessage: deletePlayMessage
};


