const Discord = require('discord.js');
const logger = require('../utils/logger');
const { prefix, grovvy } = require('../config.json');
const assistant = require('../assistant/assistant');
const { controllers, commandChannelController } = require('../turing/controller');


module.exports = {
    name: 'message',
    execute(message) {
        const client = message.client;

        if (message.author.bot && message.author.id !== grovvy) return;

        controllers(message);

        const assist = client.assists.get(message.author.id);

        if (assist && (message.channel.id === assist.channel) && message.content !== `${prefix}end-assist`) {
            return assistant(message, assist);
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.type === 'guild' && message.guild.id !== '840619177739419649') return;

        message.channel.startTyping();

        if (command.guildOnly && message.channel.type === 'dm') {
            logger.debug(`${command.name} is available only at guilds`);
            message.channel.stopTyping();
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                logger.info(`Member does not have permission(s): ${command.permissions} for ${command.name} at guild:${message.guild.id}`);
                message.channel.stopTyping();
                return message.reply('You do not have permission for this!');
            }
        }
        if (command.channel) {
            if (!message.member.voice.channel)
                message.channel.stopTyping();
            return message.channel.send('You have to be in a voice channel to use this command!');
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            message.channel.stopTyping();
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
                message.channel.stopTyping();
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            if (!commandChannelController(message, command))
                command.execute(message, args);
            message.channel.stopTyping();
        }
        catch (error) {
            logger.error(`${error} guild:${message.guild ? message.guild.name: "DM"}`);
            message.channel.send(`Sorry, there was an error trying to execute that command! You can report this problem by using **${prefix}issue** command`)
                .then(msg => {
                    msg.delete({ timeout: 5000 });
                });
            message.channel.stopTyping();
        }
        message.channel.stopTyping();
    }
};