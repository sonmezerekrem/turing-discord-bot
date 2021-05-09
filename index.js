require('dotenv').config({ path: 'dev.env' });
const Discord = require('discord.js');
const run = require('./app');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

run(client);