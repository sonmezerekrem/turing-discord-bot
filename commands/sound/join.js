const logger = require('../../utils/logger');


module.exports = {
    name: 'join',
    description: 'Joins the voice channel.',
    guildOnly: true,
    args: false,
    aliases: ['j', 'connect'],
    usage: '',
    channel: true,
    speak: true,
    category: 'Sound',
    async execute(message) {
        logger.debug(`Join command has been used at guild:${message.guild.id} by:${message.author.id}`);

        message.member.voice.channel.join()
            .then((connection) => {
                connection.setSpeaking(0);
                connection.voice.setDeaf(true)
                    .then(() => {
                        message.channel.send(`I am joined to ${message.member.voice.channel}`);
                    });
            })
            .catch((error) => {
                logger.error(error.message);
            });
    }
};
