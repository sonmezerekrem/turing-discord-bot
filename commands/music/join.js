const logger = require('../../utils/logger');


module.exports = {
    name: 'join',
    description: 'Joins the voice channel where is is connected',
    guildOnly: true,
    args: false,
    aliases: ['j', 'connect'],
    usage: '',
    execute(message, args) {
        if (message.member.voice.channel) {
            message.member.voice.channel.join().then(connection => {
                connection.voice.setSelfDeaf(true).then(() => {
                    logger.info(`${message.client.user.tag} is connected to voice and set to deaf`, message.guild.id);
                });
            }).catch(error => {
                logger.error(error, message.guild.id);
            });
            message.channel.send(`I am joined to ${message.member.voice.channel}`);
        } else {
            message.channel.send('You need to be in a voice channel!');
        }
    },
};