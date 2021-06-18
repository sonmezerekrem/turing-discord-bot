const logger = require('../../utils/logger');


module.exports = {
    name: 'leave',
    description: 'Joins the voice channel',
    guildOnly: true,
    args: false,
    aliases: ['l', 'disconnect'],
    usage: '',
    category: 'Sound',
    async execute(message) {
        logger.debug(`Leave command has been used at guild:${message.guild.id} by:${message.author.id}`);

        if (message.client.voice.connections.has(message.guild.id)) {
            message.member.voice.channel.leave();
        }

        message.client.playlists.delete(message.guild.id);
        return message.channel.send(`I am leaving the ${message.member.voice.channel}`);
    }
};
