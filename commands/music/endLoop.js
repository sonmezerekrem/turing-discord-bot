const logger = require('../../utils/logger');

const { queue } = require('./commons');

module.exports = {
    name: 'endloop',
    description: 'Loops the entire play queue.',
    guildOnly: true,
    args: false,
    aliases: ['loopoff', 'lo'],
    usage: '',
    execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to endloop the music!');

        if (!serverQueue) return message.channel.send('There is no song that I could endloop!');

        serverQueue.loop = 0;

        message.channel.send('Play queue loop is ended.');
    },
};