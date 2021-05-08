const Discord = require('discord.js');
const logger = require('../utils/logger');

const { prefix } = require('../config.json');

module.exports = {
    name: 'message',
    execute(message) {
        const client = message.client;

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        logger.debug(`Message event has emitted at guild:${message.guild.id} member:${message.author.id}`);

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
            logger.debug(`${command.name} is available only at guilds`);
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                logger.info(`Member does not have permission(s): ${command.permissions} for ${command.name} at guild:${message.guild.id}`);
                return message.reply('You do not have permission for this!');
            }
        }
        if (command.channel) {
            if (!message.member.voice.channel)
                return message.channel.send('You have to be in a voice channel to use this command!');
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                logger.warn(`Too many request before cooldown at guild:${message.guild.id} member:${message.author.id}`);
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
        } catch (error) {
            logger.error(`${error} guild:${message.guild.id}`);
            message.reply('Sorry, there was an error trying to execute that command!');
        }
    }
};