const logger = require('../../utils/logger');
const embed = require('../../embeds/queueEmbed');
const { queue } = require('./utils');

module.exports = {
    name: 'queue',
    description: 'Shows the play queue',
    guildOnly: true,
    args: false,
    aliases: ['q'],
    usage: '',
    channel: true,
    execute(message, args) {
        logger.debug(`Queue command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could show!');

        if (!message.client.voice.connections.has(message.guild.id))
            return message.channel.send('There is no song that I could show!');

        if (serverQueue.songs.length > 0)
            return message.channel.send(embed.execute(message, [serverQueue.songs, serverQueue.playing]));
        else
            return message.channel.send('There is no song that I could show!');
    }
};