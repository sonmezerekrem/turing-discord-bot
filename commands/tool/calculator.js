const { evaluate } = require('mathjs');
const logger = require('../../utils/logger');


module.exports = {
    name: 'calculator',
    description: 'Calculates given expression',
    guildOnly: false,
    args: true,
    aliases: ['math', 'calculate'],
    usage: '',
    category: 'Tool',
    type: 'general',
    link: 'https://mathjs.org/index.html',
    execute(message, args) {
        logger.debug(`Calculator command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const exp = args.join(' ');
        try {
            const res = evaluate(exp);
            return message.channel.send(`**Expression:** _${exp}_\n**Result:** _${res}_`);
        }
        catch (e) {
            message.channel.send('Wrong expression! Detailed documentation: https://mathjs.org/index.html');
            logger.warn(e.message);
        }
    }
};
