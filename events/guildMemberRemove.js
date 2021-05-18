const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { turing } = require('../config.json');

module.exports = {
    name: 'guildMemberRemove',
    execute: async function(member) {
        logger.info(`User is leave or kicked at guild: ${guild.name} user:${user.id}`);

        if (guild.id === turing) {
            let moderatorChannel = member.guild.channels.cache.find(channel => channel.name === 'moderation');
            moderatorChannel.send(embed('Member Remove', [member]));
        }
    }
};