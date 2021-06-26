const Discord = require('discord.js');
const logger = require('../utils/logger');
const { prefix } = require('../config.json');
const {
    timerController,
    pointsAndLevels,
    rules,
    getFromDatabase
} = require('../utils/functions');


module.exports = {
    name: 'message',
    async execute(message) {
        const { client } = message;

        if (message.author.bot || message.webhookID) return;

        let member;
        let guild;

        try {
            if (message.channel.type !== 'dm') {
                [member, guild] = await getFromDatabase(message);

                if (member === 404) {
                    member = null;
                }
                if (guild === 404) {
                    guild = null;
                }

                if (member && guild) {
                    await pointsAndLevels(message, member, guild);
                }
            }
        }
        catch (e) {
            logger.warn(e.message);
        }

        if (message.channel.type !== 'dm') {
            const timer = client.timers.get(message.guild.id + message.channel.id);
            if (timer && timerController(message, timer)) return;
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length)
            .trim()
            .split(/ +/);
        const commandName = args.shift()
            .toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.category === 'Owner' && message.author.id !== message.guild.ownerID) {
            message.channel.stopTyping(true);
            return message.reply('This command can only be used by the guild owner!');
        }

        if (command.guildOnly && message.channel.type === 'dm') {
            message.channel.stopTyping(true);
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (message.channel.type !== 'dm' && guild) {
            const [rule, ruleMessage] = await rules(message, command, guild);
            if (rule) {
                message.channel.stopTyping(true);
                try {
                    message.delete();
                    message.channel.send(ruleMessage)
                        .then((msg) => {
                            msg.delete({ timeout: 5000 });
                        });
                }
                catch (e) {
                    logger.error(e.message);
                }
                return;
            }
        }

        message.channel.startTyping()
            .catch();

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                logger.info(`Member does not have permission(s): ${command.permissions} for ${command.name} at guild:${message.guild.id}`);
                message.channel.stopTyping(true);
                try {
                    message.delete();
                    message.channel.send('You do not have permission for this!')
                        .then((msg) => {
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

        if (command.speak) {
            const perms = message.member.voice.channel.permissionsFor(message.client.user);
            if (!perms.has('CONNECT') || !perms.has('SPEAK')) {
                logger.debug(`Bot needs permission to speak and connect at guild:${message.guild.id} by:${message.author.id}`);
                return message.channel.send('I need the permissions to join and speak in your voice channel!');
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
                .then((msg) => {
                    msg.delete({ timeout: 5000 });
                });
            message.channel.stopTyping(true);
        }
        message.channel.stopTyping(true);
    }
};
