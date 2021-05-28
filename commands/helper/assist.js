const logger = require('../../utils/logger');


module.exports = {
    name: 'assist',
    description: 'Interact with bot with this command',
    guildOnly: false,
    dmOnly: true,
    args: false,
    aliases: ['chat'],
    usage: '',
    category: 'Helper',
    type: 'general',
    execute(message) {
        logger.info(`Assist command has been used at guild:${message.guild ? message.guild.id : 'DM'} by:${message.author.id}`);

        const client = message.client;

        if (client.assists.get(message.author.id)) {
            return;
        }

        const content = 'Hi, it\'s good to see you. How can I assist you? You can use \'end-assist\' command to end assist.';

        message.author.send(content).then(() => {
            logger.debug('DM is sent for assist');
            client.assists.set(message.author.id,
                {
                    startTime: message.createdAt,
                    lastMessage: message.createdAt,
                    endTime: null
                }
            );
        });

    }
};