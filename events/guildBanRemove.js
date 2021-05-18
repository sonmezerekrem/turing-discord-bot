const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { turing } = require('../config.json');

module.exports = {
    name: 'guildBanRemove',
    execute: async function(guild, user) {
        logger.info(`User ban is removed at guild: ${guild.name} user:${user.id}`);

        if (guild.id === turing) {
            let moderatorChannel = guild.channels.cache.find(channel => channel.name === 'moderation');
            moderatorChannel.send(embed('Ban Remove', [user]));
        }
    }
};