const logger = require('../../utils/logger');
const {
    getPlaylist
} = require('./utils');


module.exports = {
    name: 'resume',
    description: 'Resumes the music ',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    channel: true,
    speak: true,
    category: 'Sound',
    async execute(message) {
        logger.debug(`Resume command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        if (playlist.songs.length === 0) {
            message.client.playlists.delete(message.guild.id);
            return;
        }

        if (playlist.connection !== null && playlist.connection.dispatcher.paused) {
            playlist.connection.dispatcher.resume();
            message.react('✅')
                .then()
                .catch();
        }
    }
};
