const logger = require('../../utils/logger');
const api = require('../../utils/api');
const { githubIssue } = require('./utils');

module.exports = {
    name: 'suggestion',
    description: 'Send suggestions about bot.',
    guildOnly: false,
    args: true,
    aliases: [],
    usage: '<your suggestion>',
    category: 'Other',
    cooldown: 120,
    async execute(message) {
        logger.debug(`Suggestion command has been used at guild:${message.guild.id} by:${message.author.id}`);

        if (message.content.length < 150) {
            const timestamps = message.client.cooldowns.get('suggestion');
            timestamps.delete(message.author.id);
            return message.channel.send('Please give a little bit more information us about your idea');
        }

        const guild = message.channel.type === 'dm'
            ? {
                id: '0',
                name: 'DM'
            } : message.guild;

        const issue = {
            type: 'Suggestion',
            guild: guild.id,
            guildname: guild.name,
            user: message.author.id,
            username: message.author.username,
            time: new Date().toString(),
            content: message.content.substring(12),
            url: null
        };

        const github = await githubIssue(issue);

        if (github != null) {
            issue.url = github;
            message.channel.send(`Thanks for reporting an issue. You can follow the progress about the issue from ${github}`);
        }
        else {
            message.channel.send('Thanks for reporting an issue. Issue will be examined');
        }

        api.reportUserResponse(issue);
    }
};
