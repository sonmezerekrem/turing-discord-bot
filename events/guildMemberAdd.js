const logger = require('../utils/logger');
const { prefix } = require('../config.json');
const embed = require('../utils/embeds').welcomeMessage;
const api = require('../utils/api');


module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        logger.info(`New member is joined to guild:${member.guild.id} member:${member.id}`);

        if (member.user.bot) return;

        const { guild } = member;
        const guildDb = api.getGuild(guild.id);

        if (guildDb) {
            if (guildDb.roleManagement) {
                let newMember = guild.roles.cache.find((role) => role.name === 'New Member');
                if (newMember == null) {
                    await guild.roles.create({
                        name: 'New Member',
                        color: 'DEFAULT'
                    },
                    'Role for New Members');
                    newMember = guild.roles.cache.find((role) => role.name === 'New Member');
                }
                member.roles.add(newMember)
                    .catch((error) => logger.error(error.message));
            }

            if (guildDb.welcomeMessage.enabled) {
                let message = `Hello there! Welcome to our server. We are happy to see you among us. If you need help you can use ${prefix}help command. We wish you a nice Discord experience here.`;
                message = guildDb.welcomeMessage.text;
                const channel = guild.channels.cache.find((chn) => chn.name === guildDb.welcomeMessage.channel);
                if (channel) {
                    channel.send(message);
                }
            }
        }

        member.send(embed(member))
            .then(() => {
                logger.debug('DM is sent in welcome');
            });

        await api.saveMember(member.guild.id, [member.guild.id, member.user.id, member.user.tag, member.joinedAt]);
    }
};
