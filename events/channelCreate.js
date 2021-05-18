const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { turing } = require('../config.json');

module.exports = {
    name: 'channelCreate',
    execute: async function(channel) {
        if (channel.type !== 'dm') {
            logger.info(`New channel is created at guild: ${channel.guild.name} channel:${channel.id}`);

            if (channel.guild.id === turing) {
                let moderatorChannel = channel.guild.channels.cache.find(channel => channel.name === 'moderation');
                moderatorChannel.send(embed('Channel Create', [channel, channel.guild.name, channel.guild.iconURL()]));
            }
        }

    }
};