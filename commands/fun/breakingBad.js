const logger = require('../../utils/logger');
const axios = require('axios').default;

module.exports = {
    name: 'breakingbad',
    description: 'Sends a daily wallpaper to member',
    guildOnly: false,
    args: false,
    aliases: ['brba', '3556'],
    usage: '',
    category: 'Fun',
    type: 'general',
    execute: async function(message) {
        logger.debug(`Breaking-bad command has been used at guild:${message.guild.id} by:${message.author.id}`);
        axios({
            method: 'get',
            url: 'https://www.breakingbadapi.com/api/quote/random'
        }).then(result => {
            message.channel.send(`**Quote:** *${result.data[0].quote}*\n**Author:** ${result.data[0].author}\n**Series:** ${result.data[0].series}`);
        });
    }
};