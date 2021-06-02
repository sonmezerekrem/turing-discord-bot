const logger = require('../../utils/logger');


module.exports = {
    name: 'wallpaper',
    description: 'Sends a daily wallpaper to member',
    guildOnly: false,
    args: false,
    aliases: [],
    usage: '',
    category: 'Fun',
    type: 'general',
    async execute(message) {
        logger.debug(`Wallpaper command has been used at guild:${message.guild.id} by:${message.author.id}`);
        return message.channel.send('Here is your daily image link by Unsplash: https://source.unsplash.com/daily');
    }
};
