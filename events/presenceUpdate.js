const logger = require('../utils/logger');
const api = require('../utils/api');
const { presenceUpdate } = require('../utils/embeds');


module.exports = {
    name: 'presenceUpdate',
    async execute(oldPresence, newPresence) {
        if (newPresence && newPresence.activities.length > 0 && newPresence.activities[0].type === 'PLAYING') {
            const member = await api.getMember(newPresence.guild.id, newPresence.member.id);
            if (member && member.presenceUpdates.enabled) {
                logger.debug(`Member presence is changed ${newPresence.member.id}`);
                const channel = newPresence.guild.channels.get(member.presenceUpdates.channel);
                if (channel) {
                    channel.send(presenceUpdate(newPresence));
                }
            }
        }
    }
};
