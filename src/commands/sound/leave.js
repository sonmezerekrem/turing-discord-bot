const logger = require('../../utils/logger');
const { deletePlayMessage } = require('./utils');


module.exports = {
    name: 'leave',
    description: 'Joins the voice channel.',
    guildOnly: true,
    args: false,
    aliases: ['l', 'disconnect'],
    usage: '',
    category: 'Sound',
    channel: true,
    async execute(message) {
        logger.debug(`Leave command has been used at guild:${message.guild.id} by:${message.author.id}`);

        if (message.client.voice.connections.has(message.guild.id)) {
            const voice = message.client.voice.connections.get(message.guild.id);
            voice.disconnect();
            deletePlayMessage(message.client, message.guild.id);
            message.client.playlists.delete(message.guild.id);
            return message.channel.send('I am leaving the voice');
        }
    }
};
