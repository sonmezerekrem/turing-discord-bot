const logger = require('../../utils/logger');
const {
    getPlaylist
} = require('./utils');


module.exports = {
    name: 'loop',
    description: 'Change loop options',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<on | self | off>',
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
            playlist.loop = 1;
            message.react('✅')
                .then()
                .catch();
        }
        else if (args[0] === 'off') {
            playlist.loop = 0;
            message.react('✅')
                .then()
                .catch();
        }
        else if (args[0] === 'self') {
            playlist.loop = 2;
            message.react('✅')
                .then()
                .catch();
        }
        else {
            return message.channel.send(`The acceptable arguments are: \`${this.usage}\``);
        }
    }
};
