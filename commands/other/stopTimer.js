const logger = require('../../utils/logger');
const { formatTime } = require('../../utils/functions');


module.exports = {
    name: 'stop-timer',
    description: 'Stop the timer in this channel',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: 'Other',
    type: 'general',
    execute(message) {
        logger.debug(`Stop-Timer command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const client = message.client;

        const timerObject = client.timers.get(message.guild.id + message.channel.id);
        if (timerObject) {
            const content = 'Timer is stopped';
            clearInterval(timerObject.interval);
            client.timers.delete(message.guild.id + message.channel.id);
            message.channel.send(content).then(msg => msg.delete({ timeout: 3000 }));
        }

    }
};