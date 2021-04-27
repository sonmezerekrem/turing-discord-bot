const logger = require('../../utils/logger');

const { queue } = require('./commons');

module.exports = {
    name: 'loop',
    description: 'Loops the entire play queue.',
    guildOnly: true,
    args: false,
    aliases: ['lp'],
    usage: '',
    execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to loop the music!');

        if (!serverQueue) return message.channel.send('There is no song that I could loop!');

        serverQueue.loop = 1;

        message.channel.send('Play queue is looped.');
    },
};