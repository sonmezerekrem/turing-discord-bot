const logger = require('../../utils/logger');

const { queue } = require('./commons');

module.exports = {
    name: 'shuffle',
    description: 'Shuffles the play queue',
    guildOnly: true,
    args: false,
    aliases: ['shf'],
    usage: '',
    execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to shuffle the play queue!');

        if (!serverQueue) return message.channel.send('There is no song that I could shuffle!');

        if (serverQueue.songs.length > 0) {
            //TODO
            return message.channel.send('The play queue has shuffled.');
        } else
            return message.channel.send('There is no song that I could shuffle!');
    },
};