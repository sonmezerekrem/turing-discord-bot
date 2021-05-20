const fs = require('fs');
const logger = require('../../utils/logger');


module.exports = {
    name: 'start-record',
    description: 'Starts recording in user voice channel',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: 'Record',
    type: 'general',
    execute: async function(message, args) {
        logger.debug(`Start-record command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send('We are trying to implement this command. It will be ready soon. Thank you for your interest.');
        // message.member.voice.channel.join().then(connection => {
        //         logger.info(connection.receiver);
        //         const audio = connection.receiver.createStream(message.author, { mode: 'pcm' });
        //         logger.info(connection.receiver);
        //         message.channel.send('Record started');
        //         audio.pipe(fs.createWriteStream('user_audio'));
        //     }
        // ).catch(error => logger.error(error.message));
    }
};