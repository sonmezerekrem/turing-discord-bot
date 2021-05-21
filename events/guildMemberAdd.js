const logger = require('../utils/logger');
const { prefix, turing } = require('../config.json');
const embed = require('../utils/embeds').welcomeMessage;
const api = require('../utils/api');


module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        logger.info(`New member is joined to guild:${member.guild.id} member:${member.id}`);

        if (member.user.bot) return;

        const guild = member.guild;

        let channel = guild.channels.cache.find(channel => channel.name === 'general');
        let message = `Hello ${member}, welcome to ${member.guild.name}. We are happy to see you among us. If you need help you can use ${prefix}help or ${prefix}assist command. We wish you a nice Discord experience here.`;
        if (channel == null) {
            channel = guild.channels.cache
                .filter(c => c.type === 'text'
                    && c.permissionsFor(guild.client.user).has('SEND_MESSAGES')
                    && c.permissionsFor(guild.roles.everyone))
                .first();
        }

        if (member.guild.id === turing) {
            const role = guild.roles.cache.find(role => role.name === 'New Member');
            member.roles.add(role).catch(error => logger.error(error.message));
            channel = guild.channels.cache.find(channel => channel.name === 'new-member');
            message = `Hello ${member}, welcome to ${member.guild.name}. We are happy to see you among us. Please read rules channel before you start your amazing experience here. If you need help you can use ${prefix}help, ${prefix}assist command. We wish you a nice Discord experience here.`;
            member.send(embed(member)).then(() => {
                logger.debug('DM is sent in welcome');
            });
        }

        if (channel) {
            channel.send(message);
        }

        await api.saveMember(member.guild.id, [member.guild.id, member.user.id, member.user.tag, member.joinedAt]);
    }
};