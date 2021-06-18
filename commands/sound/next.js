const logger = require('../../utils/logger');
const {
    getPlaylist
} = require('./utils');


module.exports = {
    name: 'next',
    description: 'Skips the current song',
    guildOnly: true,
    args: false,
    aliases: ['n', 'skip'],
    usage: '',
    channel: true,
    speak: true,
    category: 'Sound',
    async execute(message) {
        logger.debug(`Next command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        if (playlist.songs.length === 0) {
            message.client.playlists.delete(message.guild.id);
            return;
        }

        if (playlist.playing !== null) {
            if (playlist.loop === 0) {
                if (playlist.playing === playlist.songs.length - 1) {
                    message.channel.send('There is not any next song!');
                    return;
                }
            }
            if (playlist.loop === 2) {
                if (playlist.playing < playlist.songs.length - 1) {
                    playlist.playing++;
                }
            }
            try {
                if (playlist.connection.dispatcher != null) {
                    playlist.connection.dispatcher.end();
                    message.react('✅')
                        .then()
                        .catch();
                }
            }
            catch (err) {
                logger.error(err.message);
            }
        }
    }
};
