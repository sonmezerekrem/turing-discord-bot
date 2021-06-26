/* eslint-disable */
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const logger = require('./utils/logger');


function run(dirname) {
    const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
    client.commands = new Discord.Collection();
    client.cooldowns = new Discord.Collection();
    client.timers = new Discord.Collection();
    client.playlists = new Discord.Collection();

    const eventsPath = path.resolve(dirname, './src', './events');
    const eventFiles = fs.readdirSync(eventsPath)
        .filter((file) => file.endsWith('.js') && !file.includes('utils'));
    for (const file of eventFiles) {
        const event = require(path.resolve(eventsPath, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
    logger.info('Events has been read and set');


    const commandsPath = path.resolve(dirname, './src', './commands');
    const commandFolders = fs.readdirSync(commandsPath);
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.resolve(commandsPath, folder))
            .filter((file) => file.endsWith('.js') && !file.includes('utils'));
        for (const file of commandFiles) {
            const command = require(path.resolve(commandsPath, folder, file));
            client.commands.set(command.name, command);
        }
    }
    logger.info('Commands has been read and set');

    return client;
}

module.exports = run;
