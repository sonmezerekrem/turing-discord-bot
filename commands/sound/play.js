const logger = require('../../utils/logger');
const {
    songInfo,
    getPlaylist,
    player,
    joinTheVoice
} = require('./utils');


module.exports = {
    name: 'play',
    description: 'Plays a music with given queries or Youtube URL',
    guildOnly: true,
    args: true,
    aliases: ['p'],
    usage: '< query | Youtube URL >',
    channel: true,
    speak: true,
    category: 'Sound',
    type: 'general',
    async execute(message, args) {
        logger.debug(`Play command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        const song = await songInfo(args, message);

        if (Array.isArray(song)) {
            playlist.songs.push(...song);

            await joinTheVoice(message);

            if (playlist.playing !== null) {
                const content = 'Playlist has added to queue.';
                message.channel.send(content);
            }
            else {
                await player(message);
            }
        }
        else {
            if (song.found === 2) {
                message.channel.send('This is a live streaming. Please use `live` command.');
                message.client.playlists.delete(message.guild.id);
                return;
            }
            if (song.found !== 1) {
                message.channel.send('Sorry, I couldn\'t any song for this.');
                message.client.playlists.delete(message.guild.id);
                return;
            }

            await joinTheVoice(message);

            playlist.songs.push(song);

            if (playlist.playing !== null) {
                const content = `**${song.title}** has added to queue.`;
                message.channel.send(content);
            }
            else {
                await player(message);
            }
        }
    }
};
