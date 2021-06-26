const logger = require('../../utils/logger');
const {
    liveStreamingInfo,
    getPlaylist,
    player,
    joinTheVoice
} = require('./utils');


module.exports = {
    name: 'live',
    description: 'Plays a live streaming in Youtube.',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '< query | Youtube URL >',
    channel: true,
    speak: true,
    category: 'Sound',
    async execute(message, args) {
        logger.debug(`Live command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const live = await liveStreamingInfo(args, message);

        if (live.found !== 7) {
            return message.channel.send('Sorry, I couldn\'t any live streaming for this.');
        }

        const playlist = getPlaylist(message.client, message.guild.id);

        await joinTheVoice(message);

        if (playlist.playing !== null) {
            playlist.songs.push(live);
            const content = `**${live.title}** has added to queue.`;
            message.channel.send(content);
        }
        else {
            playlist.songs.push(live);
            await player(message);
        }
    }
};
