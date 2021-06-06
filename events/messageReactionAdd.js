const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const { channels } = require('../config.json');


module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            }
            catch (error) {
                logger.error(error.message);
                return;
            }
        }


        logger.debug(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);

        const { message } = reaction;

        if (message.channel.id === channels.rules) {
            const moderatorChannel = message.guild.channels.cache.find((channel) => channel.name === 'moderation');


            if (message.content === 'Advisor') {
                user.send(`${user}, Your **Adviser** request has been saved. Authorities will get back to you soon.`);
                moderatorChannel.send(embed('Role Request', [user, 'Adviser', message.guild.name, message.guild.iconURL()]));
            }
            else if (message.content === 'Contributor') {
                user.send(`${user}, Your **Contributor** request has been saved. Authorities will get back to you soon.`);
                moderatorChannel.send(embed('Role Request', [user, 'Contributor', message.guild.name, message.guild.iconURL()]));
            }
            else if (message.content === 'Lesson') {
                user.send(`${user}, Your **Lesson** request has been saved. Authorities will get back to you soon.`);
                moderatorChannel.send(embed('Role Request', [user, 'Lesson', message.guild.name, message.guild.iconURL()]));
            }
            else if (message.content === 'Project') {
                user.send(`${user}, Your **Project** request has been saved. Authorities will get back to you soon.`);
                moderatorChannel.send(embed('Role Request', [user, 'Project', message.guild.name, message.guild.iconURL()]));
            }
        }
    }
};
