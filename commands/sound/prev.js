const logger = require('../../utils/logger');
const {
    getPlaylist
} = require('./utils');


module.exports = {
    name: 'prev',
    description: 'Skips the previous song',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    channel: true,
    speak: true,
    category: 'Sound',
    type: 'general',
    async execute(message) {
        logger.debug(`Prev command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        if (playlist.songs.length === 0) {
            message.client.playlists.delete(message.guild.id);
            return;
        }

        if (playlist.playing !== null) {
            if (playlist.shuffle === 1) {
                return;
            }
            if (playlist.loop === 1) {
                if (playlist.playing === 0) {
                    playlist.playing = playlist.songs.length - 2;
                }
                else {
                    playlist.playing -= 2;
                }
                playlist.connection.dispatcher.end();
                message.react('✅')
                    .then()
                    .catch();
            }
            else if (playlist.playing === 0) {
                return message.channel.send('There is not any previous song!');
            }
            else {
                playlist.playing -= 2;
                playlist.connection.dispatcher.end();
                message.react('✅')
                    .then()
                    .catch();
            }
        }
    }
};
