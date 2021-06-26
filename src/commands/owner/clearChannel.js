const logger = require('../../utils/logger');


module.exports = {
    name: 'clear-channel',
    description: 'Deletes messages in channel according to given argument.',
    guildOnly: true,
    args: true,
    aliases: ['clc'],
    usage: '< all | number of messages (eg. 124) >',
    category: 'Owner',
    async execute(message, args) {
        logger.debug(`Clear-channel command has been used at guild:${message.guild.id} by:${message.author.id}`);

        let deleteType = 'all';

        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(parseInt(args[0], 10))) {
            deleteType = 'message';
        }

        if (deleteType === 'all') {
            message.reply('Are you sure?')
                .then(async (msg) => {
                    try {
                        await msg.react('🟢');
                        await msg.react('🔴');

                        msg.awaitReactions((reaction, user) => user.id === message.author.id, {
                            max: 1,
                            time: 30000
                        })
                            .then(async (collected) => {
                                if (collected.first()) {
                                    if (collected.first().emoji.name === '🟢') {
                                        message.channel.clone();
                                        message.channel.delete();
                                    }
                                }
                            })
                            .catch((error) => {
                                logger.error(`Reaction error: ${error.message}`);
                            });
                        setTimeout(() => {
                            msg.reactions.removeAll();
                        }, 30000);
                    }
                    catch (error) {
                        logger.error(`Emoji error: ${error.message}`);
                    }
                });
        }
        else if (deleteType === 'message') {
            let count = parseInt(args[0], 10);
            while (count > 0) {
                await message.channel.bulkDelete(Math.min(100, count), true)
                    .catch((error) => logger.error(`Bulk delete error ${error.message}`));
                count -= 100;
            }
        }
        else {
            return message.channel.send('You entered a invalid argument for clean channel. You can type "+helper clear-channel"');
        }
    }
};
