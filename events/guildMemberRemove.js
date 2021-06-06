const logger = require('../utils/logger');
const embed = require('../utils/embeds').moderation;
const api = require('../utils/api');


module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        logger.info(`User is leave or kicked at guild: ${member.guild.name} user:${member.user.id}`);

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK'
        });
        const kickLog = fetchedLogs.entries.first();

        let kicker = '';

        if (kickLog) {
            const {
                executor,
                target
            } = kickLog;

            if (target.id === member.id) {
                kicker = executor.tag;
            }
        }

        const guildDb = await api.getGuild(member.guild.id);

        if (guildDb) {
            if (guildDb.moderationMessages.enabled) {
                const moderatorChannel = member.guild.channels.cache
                    .find((channel) => channel.name === guildDb.moderationMessages.channel);
                if (moderatorChannel) {
                    moderatorChannel.send(embed('Member Remove', [member, kicker]));
                }
            }
        }

        api.deleteMember(member.guild.id, member.user.id);
    }
};
