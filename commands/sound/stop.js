const logger = require('../../utils/logger');
const {
    getPlaylist,
    deletePlayMessage
} = require('./utils');


module.exports = {
    name: 'stop',
    description: 'Stops the music ',
    guildOnly: true,
    args: false,
    aliases: ['s'],
    usage: '',
    channel: true,
    speak: true,
    category: 'Sound',
    async execute(message) {
        logger.debug(`Stop command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        if (playlist.songs.length === 0) {
            message.client.playlists.delete(message.guild.id);
            return;
        }

        deletePlayMessage(message.client, message.guild.id);
        message.client.playlists.delete(message.guild.id);
        playlist.songs = [];
        if (playlist.connection.dispatcher != null) {
            playlist.connection.dispatcher.end();
            message.react('✅')
                .then()
                .catch();
        }
    }
};
