const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        logger.info(`New User "${member.user.username}" has joined "${member.guild.name}"`, member.guild.id);
    }
};