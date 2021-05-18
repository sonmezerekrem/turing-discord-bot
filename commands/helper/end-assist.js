const logger = require('../../utils/logger');


module.exports = {
    name: 'end-assist',
    description: 'Ends interact with bot',
    guildOnly: false,
    args: false,
    aliases: ['end-chat'],
    usage: '',
    category: 'Helper',
    type: 'general',
    execute(message, args) {
        logger.info(`End-Assist command has been used at guild:${message.guild ? message.guild.id : 'DM'} by:${message.author.id}`);
        const client = message.client;

        const assistObject = client.assists.get(message.author.id);
        if (assistObject) {
            const content = 'Thanks for the chat. If you need assist you can always use the \'assist\' command';
            assistObject.messages.push(content);
            client.assists.delete(message.author.id);
            message.channel.send(content);
        }

    }
};