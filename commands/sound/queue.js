const logger = require('../../utils/logger');
const {
    getPlaylist
} = require('./utils');
const { queue } = require('../../utils/embeds');


module.exports = {
    name: 'queue',
    description: 'Shows song queue.',
    guildOnly: true,
    args: false,
    aliases: ['q'],
    usage: '',
    channel: true,
    speak: true,
    category: 'Sound',
    async execute(message) {
        logger.debug(`Queue command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        if (playlist.songs.length === 0) {
            message.client.playlists.delete(message.guild.id);
            return;
        }

        message.channel.send(queue(message.guild.name, playlist));
    }
};
