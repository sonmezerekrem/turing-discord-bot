const fs = require('fs');
const Discord = require('discord.js');
const logger = require('./utils/logger');
const { token } = require('./env.json');
const { prefix } = require('./configs/config.json');
const { connect } = require('./utils/connecting');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js') && !file.includes('commons'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.once('ready', async () => {
    await connect(client);
    logger.info(`${client.user.tag} is ready now.`, 0);
});


client.once('reconnecting',async () => {
    logger.info(`${client.user.tag} is reconnecting.`, 0);
    await connect(client);
    logger.info(`${client.user.tag} is reconnected.`, 0);
});


client.once('disconnect', () => {
    logger.info(`${client.user.tag} is disconnecting.`, 0);
});


client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('You do not have permission for this!');
        }
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
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});


process.on('uncaughtException', error => logger.error(error, 0));


client.login(token);