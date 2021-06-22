const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').role;


module.exports = {
    name: 'role',
    description: 'Shows the information about role.',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<role_name>',
    permissions: 'MANAGE_ROLES',
    category: 'Info',
    execute(message, args) {
        logger.debug(`Role command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send(embed(message, args));
    }
};
