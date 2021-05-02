const logger = require('../../utils/logger');
const embed= require('../../embeds/songEmbed');
const { queue } = require('./commons');

module.exports = {
    name: 'song',
    description: 'Shows information about the current song',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    channel: true,
    execute(message, args) {
        logger.debug(`Song command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could show!');

        if (serverQueue.songs.length > 0) {
            if (serverQueue.playing !== null) {
                return message.channel.send(embed.execute(message,[serverQueue.songs[serverQueue.playing], serverQueue.connection.dispatcher.streamTime]));
            } else {
                return message.channel.send('There is no song that I could show!');
            }
        } else
            return message.channel.send('There is no song that I could show!');
    }
};