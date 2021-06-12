const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').serverInfo;
const api = require('../../utils/api');


module.exports = {
    name: 'guild',
    description: 'Shows server information.',
    guildOnly: true,
    args: false,
    aliases: ['server'],
    usage: '',
    category: 'Info',
    type: 'general',
    async execute(message) {
        logger.debug(`Server command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const result = await api.getGuild(message.guild.id);
        return message.channel.send(embed(message, result));
    }
};
