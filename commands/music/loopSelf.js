const logger = require('../../utils/logger');
const { queue } = require('./utils');


module.exports = {
    name: 'loopself',
    description: 'Loops the current song',
    guildOnly: true,
    args: false,
    aliases: ['ls'],
    usage: '',
    channel: true,
    category: 'Music',
    type: 'general',
    execute(message) {
        logger.debug(`Loopself command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could loop!');

        if (!message.client.voice.connections.has(message.guild.id)) {
            return message.channel.send('There is no song that I could loop!');
        }

        serverQueue.loop = 2;

        message.channel.send('Current song is looped.');
    }
};