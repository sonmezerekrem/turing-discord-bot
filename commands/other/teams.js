const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').teams;
const { mention } = require('../moderation/utils');


module.exports = {
    name: 'teams',
    description: 'Creates random teams with mentioned members',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<number of teams> <members>',
    permissions: '',
    category: 'Moderation',
    type: 'general',
    execute(message, args) {
        logger.debug(`Teams command has been used at guild:${message.guild.id} by:${message.author.id}`);
        try {
            const client = message.client;
            let teamCount = parseInt(args[0]);
            args.shift();
            const mentions = args.map(member => mention(client, member));
            if (teamCount > mentions.length)
                teamCount = mentions.length;
            const memberCount = parseInt(Math.ceil(mentions.length / teamCount));
            const teams = [];
            for (let i = 0; i < teamCount; i++) {
                let team = [];
                if (mentions.length <= memberCount) {
                    team = mentions;
                }
                else {
                    for (let j = 0; j < memberCount; j++) {
                        team.push(mentions.splice(Math.floor(Math.random() * mentions.length), 1)[0]);
                    }
                }
                teams.push(team);
            }
            return message.channel.send(embed(message, teams));
        }
        catch (exception) {
            logger.error(exception);
        }
    }
};