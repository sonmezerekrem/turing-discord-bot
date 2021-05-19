const Discord = require('discord.js');
const logger = require('./logger');
const {
    turing,
    prefix,
    grovvy,
    music,
    channels
} = require('../config.json');

function channelController(message) {
    if (message.guild && message.guild.id === turing) {
        if (message.channel.id === channels.suggestions) {
            if (!message.content.startsWith(prefix + 'suggestion ') || !message.content.startsWith(prefix + 'advice ')) {
                try {
                    message.delete();
                    message.channel.send(`Please use this channel for only suggestions! Proper usage is : **${prefix}suggestion <your suggestion>**.`)
                        .then(msg => {
                            msg.delete({ timeout: 3000 });
                        });
                }
                catch (e) {
                    logger.error(e.message);
                }
            }
        }

        if (message.channel.id === channels.bugReporting) {
            if (!message.content.startsWith(prefix + 'issue ')
                || !message.content.startsWith(prefix + 'bug ')
                || !message.content.startsWith(prefix + 'report ')) {
                try {
                    message.delete();
                    message.channel.send(`Please use this channel for only reporting issues! Proper usage is : **${prefix}issue <error/bug/issue>**.`)
                        .then(msg => {
                            msg.delete({ timeout: 3000 });
                        });
                }
                catch (e) {
                    logger.error(e.message);
                }
            }
        }


        if ((message.channel.parentID === channels.lessons
            || message.channel.parentID === channels.project)
            && !message.channel.name.includes('general')) {


            if (message.content.length > 1000) {
                try {
                    message.delete();
                    message.channel.send(`By ${message.author}
>>> ${message.content}`);
                }
                catch (e) {
                    logger.error(e.message);
                }
            }


            if (message.author.id === grovvy) {
                try {
                    message.delete();
                }
                catch (e) {
                    logger.error(e.message);
                }
            }
            else if (message.content.startsWith('-')) {
                try {
                    for (let cmd of music) {
                        if (message.content.startsWith('-' + cmd)) {
                            message.delete();
                            message.channel.send(`Please do not use this channel for music commands`)
                                .then(msg => {
                                    msg.delete({ timeout: 3000 });
                                });
                            break;
                        }
                    }
                }
                catch (e) {
                    logger.error(e.message);
                }
            }
        }

        if(message.channel.id === channels.commands){
            if (!message.content.startsWith(prefix + 'help')) {
                try {
                    message.delete();
                    message.channel.send(`Please use this channel for only getting help about bot commands! Proper usage is : **${prefix}help [category | command]**.`)
                        .then(msg => {
                            msg.delete({ timeout: 3000 });
                        });
                }
                catch (e) {
                    logger.error(e.message);
                }
            }
        }
    }
}

function commandChannelController(message, command) {
    if ((command.category === 'Music' || command.category === 'Fun') && (message.channel.parentID === channels.lessons
        || message.channel.parentID === channels.project)
        && !message.channel.name.includes('general')) {

        try {
            message.delete();
            message.channel.send(`Please use this channel for only resource purposes.`)
                .then(msg => {
                    msg.delete({ timeout: 3000 });
                });
            return true;
        }
        catch (e) {
            logger.error(e.message);
        }
    }

    if(command.name === "admin" && message.channel.id !== channels.admin){
        try {
            message.delete();
            return true;
        }
        catch (e) {
            logger.error(e.message);
        }
    }

    return false;
}

function controllers(message) {
    channelController(message);
}

module.exports = { controllers, commandChannelController };