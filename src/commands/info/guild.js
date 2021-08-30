const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').serverInfo;


module.exports = {
    name: 'guild',
    description: 'Shows server information.',
    guildOnly: true,
    args: false,
    aliases: ['server'],
    usage: '',
    category: 'Info',
    async execute(message) {
        logger.debug(`Server command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send(embed(message));
    }
};
