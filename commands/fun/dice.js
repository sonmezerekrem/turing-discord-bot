const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').points;

module.exports = {
    name: 'dice',
    description: 'Rolls a dice and give points if you know the number',
    guildOnly: true,
    args: false,
    aliases: ['roll'],
    usage: '',
    category: 'Fun',
    type: 'general',
    execute: async function(message, args) {
        logger.debug(`Dice command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

        const dice = numbers[Math.floor(Math.random() * 6)];
        logger.debug(`${dice}`);

        message.reply(`I roll a dice. If you can guess number you will earn points. Let's try!`).then(async msg => {
            try {
                await msg.react('1️⃣');
                await msg.react('2️⃣');
                await msg.react('3️⃣');
                await msg.react('4️⃣');
                await msg.react('5️⃣');
                await msg.react('6️⃣');

                msg.awaitReactions((reaction, user) =>
                    user.id === message.author.id, { max: 1, time: 30000 }
                ).then(async collected => {
                    if (collected.first()) {
                        if (collected.first().emoji.name === dice) {
                            message.channel.send(embed(message.member, 20, 'Dice'));
                        }
                        else {
                            message.channel.send('Opps, not this time. One more try?');
                        }
                        await msg.reactions.removeAll();
                    }
                }).catch((error) => {
                    logger.error(error.message);
                });
                setTimeout(() => {
                    msg.reactions.removeAll();
                }, 30000);
            }
            catch (error) {
                logger.error(`One of the emojis failed to react in dice guild:${message.guild.id}`);
            }
        });
    }
};