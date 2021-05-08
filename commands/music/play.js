const logger = require('../../utils/logger');
const { queue, play, songInfo, setServerQueue } = require('./utils');

module.exports = {
    name: 'play',
    description: 'Plays a music with given queries or Youtube URL',
    guildOnly: true,
    args: false,
    aliases: ['p'],
    usage: '< query | URL >',
    channel: true,
    execute: async function(message, args) {
        logger.debug(`Play command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        const permissions = message.member.voice.channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            logger.debug(`Bot needs permission to speak and connect at guild:${message.guild.id} by:${message.author.id}`);
            return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

        if (args.length === 0) {
            if (serverQueue) {
                if (serverQueue.songs.length > 0) {
                    return message.channel.send('There is no song in history');
                }
                play(message.guild, 0);
            }
            else {
                return message.channel.send('There is no song in history');
            }
        }

        const x = message.client.voice;

        const song = await songInfo(args, message.author);

        if (song == null) {
            return message.channel.send('Sorry, something went wrong');
        }

        setServerQueue(message, serverQueue, song);
    }
};