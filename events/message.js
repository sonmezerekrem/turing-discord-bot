const Discord = require('discord.js');
const logger = require('../utils/logger');
const { prefix, grovvy, turing } = require('../config.json');
const assistant = require('../assistant/assistant');
const { controllers, commandChannelController } = require('../utils/turingController');
const { timerController, pointsAndLevels } = require('../utils/functions');

module.exports = {
    name: 'message',
    async execute(message) {
        const client = message.client;

        if (message.author.bot && message.author.id !== grovvy) return;

        controllers(message);

        if (message.author.bot) return;

        await pointsAndLevels(message);

        const assist = client.assists.get(message.author.id);

        if (assist && (message.channel.type === 'dm') && message.content !== `${prefix}end-assist`) {
            return assistant(message, assist);
        }

        const timer = client.timers.get(message.guild.id + message.channel.id);

        if (timer && timerController(message, timer)) return;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.type === 'guild' && message.guild.id !== turing) return;

        if (command.category === 'Owner' && message.author.id !== message.guild.ownerID) {
            message.channel.stopTyping(true);
            return message.reply('This command can only be used by the guild owner!');
        }

        if (command.guildOnly && message.channel.type === 'dm') {
            message.channel.stopTyping(true);
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.dmOnly && message.channel.type !== 'dm') {
            message.channel.stopTyping(true);
            return message.reply('I can\'t execute that command inside guilds!');
        }

        if (commandChannelController(message, command)) return;

        message.channel.startTyping().then().catch();

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                logger.info(`Member does not have permission(s): ${command.permissions} for ${command.name} at guild:${message.guild.id}`);
                message.channel.stopTyping(true);
                try {
                    message.delete();
                    message.channel.send('You do not have permission for this!')
                        .then(msg => {
                            msg.delete({ timeout: 3000 });
                        });
                    return;
                }
                catch (e) {
                    logger.error(e.message);
                }

            }
        }
        if (command.channel) {
            if (!message.member.voice.channel) {
                message.channel.stopTyping(true);
                return message.channel.send('You have to be in a voice channel to use this command!');
            }
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            message.channel.stopTyping(true);
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
                message.channel.stopTyping(true);
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
            message.channel.stopTyping(true);
        }
        catch (error) {
            logger.error(`${error.message} guild:${message.guild ? message.guild.name : 'DM'}`);
            message.channel.send(`Sorry, there was an error trying to execute that command! You can report this problem by using **${prefix}issue** command`)
                .then(msg => {
                    msg.delete({ timeout: 5000 });
                });
            message.channel.stopTyping(true);
        }
        message.channel.stopTyping(true);
    }
};