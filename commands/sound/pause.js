const logger = require('../../utils/logger');
const {
    getPlaylist
} = require('./utils');


module.exports = {
    name: 'pause',
    description: 'Pauses the music.',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    channel: true,
    speak: true,
    category: 'Sound',
    async execute(message) {
        logger.debug(`Pause command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        if (playlist.songs.length === 0) {
            message.client.playlists.delete(message.guild.id);
            return;
        }

        if (playlist.connection !== null && !playlist.connection.dispatcher.paused) {
            playlist.connection.dispatcher.pause();
            message.react('✅')
                .then()
                .catch();
        }
    }
};
