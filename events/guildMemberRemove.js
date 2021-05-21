const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { turing } = require('../config.json');
const api = require('../utils/api');


module.exports = {
    name: 'guildMemberRemove',
    execute: async function(member) {
        logger.info(`User is leave or kicked at guild: ${member.guild.name} user:${member.user.id}`);

        if (member.guild.id === turing) {
            let moderatorChannel = member.guild.channels.cache.find(channel => channel.name === 'moderation');
            moderatorChannel.send(embed('Member Remove', [member]));
        }

        api.deleteMember(member.guild.id, member.user.id);
    }
};