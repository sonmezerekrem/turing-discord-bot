const logger = require('../../utils/logger');

const { queue } = require('./commons');

module.exports = {
    name: 'pause',
    description: 'Pauses the player',
    guildOnly: true,
    args: false,
    aliases: ['ps'],
    usage: '',
    execute(message, args) {
        logger.debug(`Pause command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to pause the music!');

        if (!serverQueue) return message.channel.send('There is no song that I could pause!');

        if (!serverQueue.connection.dispatcher.paused)
            serverQueue.connection.dispatcher.pause();
    }
};