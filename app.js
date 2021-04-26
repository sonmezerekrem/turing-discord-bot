const Discord = require('discord.js');
const logger = require('./utils/logger');

const { token } = require('./config.json');

const client = new Discord.Client();

const queue = new Map();

module.exports = {
    client: client,
    queue: queue,
};

