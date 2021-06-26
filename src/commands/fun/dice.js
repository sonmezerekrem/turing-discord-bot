const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').points;
const api = require('../../utils/api');


module.exports = {
    name: 'dice',
    description: 'Rolls a dice and give points if you know the number.',
    guildOnly: true,
    args: false,
    aliases: ['roll'],
    usage: '',
    category: 'Fun',
    async execute(message) {
        logger.debug(`Dice command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const dice = Math.floor(Math.random() * 6) + 1;
        logger.debug(`${dice}`);


        const filter = (m) => m.content === '1'
            || m.content === '2'
            || m.content === '3'
            || m.content === '4'
            || m.content === '5'
            || m.content === '6';

        message.channel.send('I roll a dice. If you can guess number you will earn points. You can write numbers between 1 and 6. Let\'s try!')
            .then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                })
                    .then((collected) => {
                        // eslint-disable-next-line no-restricted-syntax, prefer-const
                        for (let value of collected.values()) {
                            if (value.author.id === message.author.id) {
                                if (value.content === dice.toString()) {
                                    message.channel.send(embed(message.member, 20, 'Dice'));
                                    api.givePoints(message.guild.id, message.author.id, 10);
                                }
                                else {
                                    message.channel.send('Opps, not this time. One more try?');
                                }
                                break;
                            }
                        }
                    })
                    .catch(() => {
                        message.channel.send('Looks like nobody got the answer this time.');
                    });
            })
            .catch(() => {
                message.channel.send('Looks like nobody got the answer this time.');
            });
    }
};
