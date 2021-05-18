const logger = require('../../utils/logger');


module.exports = {
    name: 'assist',
    description: 'Interact with bot with this command',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '',
    category: "Helper",
    type: "general",
    execute(message, args) {
        logger.info(`Assist command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const client = message.client;
        const content = 'Hi, it\'s good to see you. How can I assist you? You can use \'end-assist\' command to end assist.';

        if (client.assists.get(message.author.id)) {
            return message.channel.send('Please use the assist command on only one channel at a time');
        }

        client.assists.set(message.author.id,
            {
                guild: message.guild.id,
                channel: message.channel.id,
                user: message.author.id,
                startTime: message.createdAt,
                messages: [message.content, content],
                endTime: null
            }
        );
        message.reply(content);
    }
};