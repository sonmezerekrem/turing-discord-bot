const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { turing } = require('../config.json');

module.exports = {
    name: 'guildBanAdd',
    execute: async function(guild, user) {
        logger.info(`User is banned at guild: ${guild.name} user:${user.id}`);

        if (guild.id === turing) {
            const banInfo = await guild.fetchBan(user)
            let moderatorChannel = guild.channels.cache.find(channel => channel.name === 'moderation');
            moderatorChannel.send(embed('Ban', [banInfo]));
        }
    }
};