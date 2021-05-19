const logger = require('../../utils/logger');
const { formatTime } = require('../../utils/functions');


module.exports = {
    name: 'timer',
    description: 'Creates a timer with given seconds or default 10 minutes. IT update remaining time every 10 seconds. With block option delete all messages until the timer runs out.',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '[seconds] [\'block\']',
    category: 'Other',
    type: 'general',
    execute(message, args) {
        logger.debug(`Timer command has been used at guild:${message.guild.id} by:${message.author.id}`);

        let time = 600;
        let block = false;
        if (args.length === 1) {
            if (args[0] !== 'block')
                time = parseInt(args[0]);
            else
                block = true;
        }
        if (isNaN(time)) return;
        if (args.length > 1 && args[1] === 'block')
            block = true;

        const timerString = `Timer ${block ? '(block mode):' : ':'}`;
        message.channel.send(`${timerString} ${formatTime(time)}`).then(msg => {
            const interval = setInterval(() => {
                if (time <= 10) {
                    message.client.timers.delete(message.guild.id + message.channel.id);
                    clearInterval(interval);
                }
                time -= 10;
                msg.edit(`${timerString} ${formatTime(time)}`);
            }, 10000);

            message.client.timers.set(message.guild.id + message.channel.id, {
                user: message.author.id,
                startTime: message.createdAt,
                interval: interval,
                block: block
            });
        });

    }
};