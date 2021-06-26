const logger = require('../../utils/logger');
const { prefix } = require('../../config.json');
const { pollAnswers } = require('../../utils/embeds');
const { emojiLetters } = require('../../utils/variables');


module.exports = {
    name: 'poll',
    description: 'Starts a poll.',
    guildOnly: true,
    args: true,
    aliases: ['survey'],
    usage: '<question ends with ?> [answers separated by comma]',
    category: 'Tool',
    execute(message) {
        logger.debug(`Poll command has been used at guild:${message.guild.id} by:${message.author.id}`);

        let command = 6;
        let question = '';
        const answers = [];

        if (message.content.startsWith(`${prefix}survey`)) {
            command = 9;
        }

        if (message.content.includes('?')) {
            const mark = message.content.indexOf('?');
            question = message.content.substring(command, mark);
            if (message.content.length > mark) {
                answers.push(...message.content.substring(mark + 1)
                    .split(','));
                if (answers.length > 10) {
                    return message.channel.send('Max answer count is 10!');
                }
            }
        }
        else {
            question = message.content.substring(command);
        }


        message.channel.send(pollAnswers(question, answers, message.guild.name, message.member))
            .then(async (msg) => {
                try {
                    if (answers.length > 0) {
                        for (let i = 0; i < answers.length; i++) {
                            await msg.react(emojiLetters[i]);
                        }
                    }
                    else {
                        await msg.react('🟢');
                        await msg.react('🔴');
                        await msg.react('⚪');
                    }
                }
                catch (error) {
                    logger.error(`Reaction error at poll : ${error.message}`);
                }
            });
    }
};
