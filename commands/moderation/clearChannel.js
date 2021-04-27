const logger = require('../../utils/logger');

module.exports = {
    name: 'clear-channel',
    description: 'Deletes all messages in channel',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '[number of messages]',
    permissions: 'MANAGE_CHANNELS',
    execute: async function(message, args) {

        if (args.length > 0) {
            logger.info('ok');
            //TODO
        } else {

            message.reply(`${message.channel.name} is going to clear. Are you sure?`).then(async msg => {
                try {
                    await msg.react('👍');
                    await msg.react('👎');

                    msg.awaitReactions((reaction, user) =>
                        user.id === message.author.id && (reaction.emoji.name === '👍' || reaction.emoji.name === '👎'),
                        { max: 1, time: 30000 },
                    ).then(async collected => {
                        if (collected.first().emoji.name === '👍') {
                            //TODO
                        }
                        setTimeout(() => {
                            msg.reactions.removeAll();
                        }, 30000);
                    }).catch((error) => {
                        logger.error(error, message.guild.id);
                        msg.reply('No reaction after 30 seconds, operation canceled');
                    });
                } catch (error) {
                    logger.error('One of the emojis failed to react in clear channel.', message.guild.id);
                }
            });
        }

    },
};