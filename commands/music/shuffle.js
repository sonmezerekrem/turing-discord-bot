const logger = require('../../utils/logger');

const { queue } = require('./utils');

module.exports = {
    name: 'shuffle',
    description: 'Shuffles the play queue',
    guildOnly: true,
    args: false,
    aliases: ['shf'],
    usage: '',
    channel: true,
    execute(message, args) {
        logger.debug(`Shuffle command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could shuffle!');

        if (!message.client.voice.connections.has(message.guild.id))
            return message.channel.send('There is no song that I could shuffle!');

        if (serverQueue.songs.length > 0) {
            let array = serverQueue.songs;
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i);
                if (i !== serverQueue.playing && j !== serverQueue.playing) {
                    const temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
            serverQueue.songs = array;
            return message.channel.send('The play queue has shuffled.');
        }
        else
            return message.channel.send('There is no song that I could shuffle!');
    }
};