const logger = require('../../utils/logger');


module.exports = {
    name: 'clear-channel',
    description: 'Deletes messages in channel according to given argument',
    guildOnly: true,
    args: true,
    aliases: ['clc'],
    usage: '< all | number of messages (eg. 124) >',
    permissions: 'MANAGE_CHANNELS',
    execute: async function(message, args) {
        logger.debug(`Clear-channel command has been used at guild:${message.guild.id} by:${message.author.id}`);

        let deleteType = 'all';

        if (!isNaN(parseInt(args[0])))
            deleteType = 'message';

        if (deleteType === 'all') {
            try {
                message.channel.clone();
                message.channel.delete();
            }
            catch (e) {
                logger.error(e.message);
            }
        }
        else if (deleteType === 'message') {
            let count = parseInt(args[0]);
            while (count > 0) {
                await message.channel.bulkDelete(Math.min(100, count), true).catch(error => logger.error(error.message));
                count -= 100;
            }
        }
        else {
            return message.channel.send('You entered a invalid argument for clean channel. You can type "+help clear-channel"');
        }

    }
};