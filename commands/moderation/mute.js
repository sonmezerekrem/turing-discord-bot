const logger = require('../../utils/logger');
const { mention } = require('./utils');


module.exports = {
    name: 'mute',
    description: 'Mutes the tagged user in server',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<user>',
    permissions: 'MUTE_MEMBERS',
    execute(message, args) {
        logger.debug(`Mute command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send('We are trying to implement this command. It will be ready soon. Thank you for your interest.');

        // const muteUser = message.guild.member(mention(message.client, args[0]));
        // const role = message.guild.roles.cache.find(role => role.name === 'Muted');
        //
        // muteUser.roles.add(role);
        //
        // setTimeout(() => {
        //     //TODO
        // }, 30000);
        //
        // return message.channel.send(`${muteUser} is muted`);
    }
};