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
        } else
            return message.channel.send('There is no song that I could shuffle!');
    },
};