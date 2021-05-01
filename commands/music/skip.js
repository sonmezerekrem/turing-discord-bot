const logger = require('../../utils/logger');

const { queue, deletePlayMessage } = require('./commons');

module.exports = {
    name: 'skip',
    description: 'Skips the current song.',
    guildOnly: true,
    args: false,
    aliases: ['next', 'n'],
    usage: '',
    execute(message, args) {
        logger.debug(`Skip command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to stop the music!');

        if (!serverQueue) return message.channel.send('There is no song that I could skip!');

        serverQueue.connection.dispatcher.end();
    }
};