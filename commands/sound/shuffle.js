const logger = require('../../utils/logger');
const {
    getPlaylist
} = require('./utils');


module.exports = {
    name: 'shuffle',
    description: 'Turn on/off shuffle',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<on | off>',
    channel: true,
    speak: true,
    category: 'Sound',
    async execute(message, args) {
        logger.debug(`Next command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const playlist = getPlaylist(message.client, message.guild.id);

        if (playlist.songs.length === 0) {
            message.client.playlists.delete(message.guild.id);
            return;
        }

        if (args[0] === 'on') {
            playlist.shuffle = 1;
            message.react('✅')
                .then()
                .catch();
        }
        else if (args[0] === 'off') {
            playlist.shuffle = 0;
            message.react('✅')
                .then()
                .catch();
        }
        else {
            return message.channel.send(`The acceptable arguments are: \`${this.usage}\``);
        }
    }
};
