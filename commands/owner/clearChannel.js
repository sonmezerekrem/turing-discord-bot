const logger = require('../../utils/logger');


module.exports = {
    name: 'clear-channel',
    description: 'Deletes messages in channel according to given argument',
    guildOnly: true,
    args: true,
    aliases: ['clc'],
    usage: '< all | number of messages (eg. 124) >',
    category: 'Owner',
    type: 'general',
    execute: async function(message, args) {
        logger.debug(`Clear-channel command has been used at guild:${message.guild.id} by:${message.author.id}`);

        let deleteType = 'all';

        if (!isNaN(parseInt(args[0])))
            deleteType = 'message';

        if (deleteType === 'all') {
            message.reply(`Are you sure?`).then(async msg => {
                try {
                    await msg.react('🟢');
                    await msg.react('🔴');

                    msg.awaitReactions((reaction, user) =>
                        user.id === message.author.id, { max: 1, time: 30000 }
                    ).then(async collected => {
                        if (collected.first()) {
                            if (collected.first().emoji.name === '🟢') {
                                message.channel.clone();
                                message.channel.delete();
                            }
                        }
                    }).catch((error) => {
                        logger.error(error.message);
                    });
                    setTimeout(() => {
                        msg.reactions.removeAll();
                    }, 30000);
                }
                catch (error) {
                    logger.error(`One of the emojis failed to react in clc-all guild:${message.guild.id}`);
                }
            });
        }
        else if (deleteType === 'message') {
            let count = parseInt(args[0]);
            while (count > 0) {
                await message.channel.bulkDelete(Math.min(100, count), true).catch(error => logger.error(error.message));
                count -= 100;
            }
        }
        else {
            return message.channel.send('You entered a invalid argument for clean channel. You can type "+helper clear-channel"');
        }

    }
};