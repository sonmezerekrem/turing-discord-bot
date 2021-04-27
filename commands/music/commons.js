const ytdl = require('ytdl-core');
const { playingEmbed } = require('../../utils/embed');
const logger = require('../../utils/logger');
const { defaultActivity } = require('../../config.json');

const queue = new Map();

const play = (guild, songNo) => {
    const serverQueue = queue.get(guild.id);
    if (songNo > serverQueue.songs.length - 1) {
        if (serverQueue.loop === 1) {
            songNo = 0;
        } else {
            guild.client.user.setActivity(defaultActivity.name, { type: defaultActivity.type }).then(() => {
                logger.info('Activity is set to default.', guild.id);
            });
            return;
        }
    }

    deletePlayMessage(guild);

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
    dispatcher.setVolume(serverQueue.volume);
    guild.client.user.setActivity('Music', { type: 'STREAMING' }).then(() => {
        logger.info('Activity is set to streaming music.', guild.id);
    });
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
                logger.info(`Play message is deleted with id - ${serverQueue.lastPlayMessage}`, guild.id);
                serverQueue.lastPlayMessage = null;
            });
        });
    }
};

module.exports = {
    queue: queue,
    play: play,
    isValidUrl: isValidUrl,
    deletePlayMessage: deletePlayMessage,
};


