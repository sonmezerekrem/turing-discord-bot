const logger = require('../../utils/logger');
const { queue } = require('./utils');


module.exports = {
    name: 'endloop',
    description: 'Loops the entire play queue.',
    guildOnly: true,
    args: false,
    aliases: ['loopoff', 'lo'],
    usage: '',
    channel: true,
    category: 'Music',
    type: 'general',
    execute(message) {
        logger.debug(`Endloop command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could endloop!');

        if (!message.client.voice.connections.has(message.guild.id)) {
            return message.channel.send('There is no song that I could endloop!');
        }

        serverQueue.loop = 0;

        message.channel.send('Play queue loop is ended.');
    }
};
