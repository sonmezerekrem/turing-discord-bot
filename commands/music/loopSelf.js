const logger = require('../../utils/logger');

const { queue } = require('./commons');

module.exports = {
    name: 'loopself',
    description: 'Loops the current song',
    guildOnly: true,
    args: false,
    aliases: ['ls'],
    usage: '',
    channel: true,
    execute(message, args) {
        logger.debug(`Loopself command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could loop!');

        serverQueue.loop = 2;

        message.channel.send('Current song is looped.');
    }
};