const logger = require('../utils/logger');


module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        logger.info(`New member is joined to guild:${member.guild.id} member:${member.id}`);
    }
};