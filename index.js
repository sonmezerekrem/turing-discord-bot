const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const { dbHost, dbPort, dbName, token } = require('./env.json');


mongoose.Promise = global.Promise;
mongoose.connect(
    `mongodb://${dbHost}:${dbPort}/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
        // user: dbUser,
        // pass: dbPassword
    }
).then(() => {
    logger.info('MongoDB Server is connected.', 0);
}).catch(error => {
    logger.error(`Error connecting to MongoDB Server. ${error}`, 0);
    process.exit();
});


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

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

process.on('uncaughtException', error => logger.error(error, 1));


client.login(token);

