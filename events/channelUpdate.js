const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { turing } = require('../config.json');

module.exports = {
    name: 'channelUpdate',
    execute: async function(oldChannel, newChannel) {
        if (newChannel.type !== 'dm') {
            logger.info(`Channel is updated at guild: ${newChannel.guild.name} channel:${newChannel.id}`);

            if (newChannel.guild.id === turing) {
                let moderatorChannel = newChannel.guild.channels.cache.find(channel => channel.name === 'moderation');
                moderatorChannel.send(embed('Channel Update', [oldChannel, newChannel, newChannel.guild.name, newChannel.guild.iconURL()]));
            }
        }
    }
};