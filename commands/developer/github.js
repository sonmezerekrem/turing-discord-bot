const logger = require('../../utils/logger');
const axios = require('axios').default;

module.exports = {
    name: 'github',
    description: 'Search in Github repositories and users',
    guildOnly: false,
    args: true,
    aliases: [],
    usage: '',
    category: 'Developer',
    type: 'general',
    cooldown: 30,
    execute: async function(message) {
        logger.debug(`Github command has been used at guild:${message.guild.id} by:${message.author.id}`);
        axios({
            method: 'get',
            url: 'https://api.github.com/search/repositories'
        }).then(result => {
            message.channel.send(`**Quote:** *${result.data[0].quote}*\n**Author:** ${result.data[0].author}\n**Series:** ${result.data[0].series}`);
        });
    }
};