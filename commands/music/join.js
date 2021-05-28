const logger = require('../../utils/logger');


module.exports = {
    name: 'join',
    description: 'Joins the voice channel where is is connected',
    guildOnly: true,
    args: false,
    aliases: ['j', 'connect'],
    usage: '',
    category: 'Music',
    type: 'general',
    execute(message) {
        logger.debug(`Join command has been used at guild:${message.guild.id} by:${message.author.id}`);
        if (message.member.voice.channel) {
            message.member.voice.channel.join().then(connection => {
                connection.voice.setSelfDeaf(true).then(() => {
                    logger.info(`${message.client.user.tag} has connected to voice and set to deaf at guild:${message.guild.id}`);
                });
            }).catch(error => {
                logger.error(error.message, message.guild.id);
            });
            message.channel.send(`I am joined to ${message.member.voice.channel}`);
        }
        else {
            message.channel.send('You need to be in a voice channel!');
        }
    }
};