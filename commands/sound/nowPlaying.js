const logger = require('../../utils/logger');
const {
    getPlaylist
} = require('./utils');
const { nowPlaying } = require('../../utils/embeds');


module.exports = {
    name: 'now-playing',
    description: 'Shows currently playing song',
    guildOnly: true,
    args: false,
    aliases: ['np'],
    usage: '',
    channel: true,
    speak: true,
    category: 'Sound',
    type: 'general',
    async execute(message) {
        logger.debug(`Now-playing command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        if (playlist.songs.length === 0) {
            message.client.playlists.delete(message.guild.id);
            return;
        }

        if (playlist.playing !== null) {
            message.channel.send(nowPlaying(message.guild.name, playlist.songs[playlist.playing]));
        }
    }
};
