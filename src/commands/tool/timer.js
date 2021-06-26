const logger = require('../../utils/logger');
const { formatTime } = require('../../utils/functions');


module.exports = {
    name: 'timer',
    description: 'Creates a timer with given seconds or default 10 minutes. It update remaining time every 10 seconds.',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '<seconds>',
    category: 'Tool',
    execute(message, args) {
        logger.debug(`Timer command has been used at guild:${message.guild.id} by:${message.author.id}`);

        let time = 600;

        time = parseInt(args[0], 10);
        time = Math.max(time, 3600000);

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(time)) return;

        const timerString = 'Timer: ';
        message.channel.send(`${timerString} ${formatTime(time)}`)
            .then((msg) => {
                const interval = setInterval(() => {
                    if (time <= 10) {
                        message.client.timers.delete(message.guild.id + message.channel.id);
                        clearInterval(interval);
                        message.channel.send('Timer is over!');
                    }
                    time -= 10;
                    msg.edit(`${timerString} ${formatTime(time)}`);
                }, 10000);

                message.client.timers.set(message.guild.id + message.channel.id, {
                    user: message.author.id,
                    startTime: message.createdAt,
                    interval
                });
            });
    }
};
