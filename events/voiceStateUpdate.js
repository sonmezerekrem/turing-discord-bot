const logger = require('../utils/logger');


module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        if (oldState.channelID !== oldState.guild.me.voice.channelID || newState.channel) return;

        if (oldState.channel.members.size === 1) {
            setTimeout(() => {
                if (!oldState.channel.members.size - 1) {
                    logger.debug('I am leaving voice');
                    oldState.channel.leave();
                }
            }, 300000);
        }
    }
};
