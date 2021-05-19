const logger = require('../../utils/logger');


module.exports = {
    name: 'assist',
    description: 'Interact with bot with this command',
    guildOnly: false,
    args: false,
    aliases: ['chat'],
    usage: '',
    category: 'Helper',
    type: 'general',
    execute(message, args) {
        logger.info(`Assist command has been used at guild:${message.guild ? message.guild.id : 'DM'} by:${message.author.id}`);

        const client = message.client;
        const content = 'Hi, it\'s good to see you. How can I assist you? You can use \'end-assist\' command to end assist.';

        if (client.assists.get(message.author.id)) {
            return;
        }
        message.author.send(content).then((msg) => {
            logger.debug('DM is sent for assist');
            client.assists.set(message.author.id,
                {
                    guild: message.guild ? message.guild.id : 'DM',
                    channel: msg.channel.id,
                    user: message.author.id,
                    startTime: message.createdAt,
                    messages: [message.content, content],
                    endTime: null
                }
            );
        });

    }
};