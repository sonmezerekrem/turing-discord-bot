const fs = require('fs');
const logger = require('./utils/logger');
const token = process.env.token;

function run(client) {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js') && !file.includes('utils'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
    logger.debug('Events has been read and set');

    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js') && !file.includes('utils'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }
    logger.debug('Commands has been read and set');

    process.on('uncaughtException', error => logger.error(error));

    client.login(token).catch(error => logger.error(error));
}

module.exports = run;