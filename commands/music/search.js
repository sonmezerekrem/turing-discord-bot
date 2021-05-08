const axios = require('axios').default;

const logger = require('../../utils/logger');

const { queue, songInfo, setServerQueue } = require('./utils');

const { youtubeKey } = require('../../env.json');

const { youtubeUrl, youtubeApiUrl } = require('../../config.json');

const embed = require('../../embeds/searchEmbed');

module.exports = {
    name: 'search',
    description: 'Search for a music with given queries in YouTube',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<query>',
    channel: true,
    execute: async function(message, args) {
        logger.debug(`Search command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const serverQueue = queue.get(message.guild.id);

        const permissions = message.member.voice.channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            logger.debug(`Bot needs permission to speak and connect at guild:${message.guild.id} by:${message.author.id}`);
            return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

        logger.debug(`Making axios get request for search command to ${youtubeApiUrl} with query:'${args.join(' ')}' at guild:${message.guild.id} by:${message.author.id}`);
        const youtubeResponse = await axios.get(youtubeApiUrl, {
            params: {
                key: youtubeKey,
                type: 'video',
                part: 'snippet',
                q: args.join(' ')
            }
        });


        if (youtubeResponse.status === 200) {
            message.channel.send(embed.execute(message, [args, youtubeResponse.data.items]))
                .then(async msg => {
                    try {
                        await msg.react('1️⃣');
                        await msg.react('2️⃣');
                        await msg.react('3️⃣');
                        await msg.react('4️⃣');
                        await msg.react('5️⃣');

                        msg.awaitReactions((reaction, user) =>
                            user.id === message.author.id, { max: 1, time: 30000 }
                        ).then(async collected => {
                            let searchUrl = '';
                            const emoji = collected.first().emoji;
                            if (emoji.name === '1️⃣') {
                                searchUrl = youtubeUrl + youtubeResponse.data.items[0].id.videoId;
                            }
                            else if (emoji.name === '2️⃣') {
                                searchUrl = youtubeUrl + youtubeResponse.data.items[1].id.videoId;
                            }
                            else if (emoji.name === '3️⃣') {
                                searchUrl = youtubeUrl + youtubeResponse.data.items[2].id.videoId;
                            }
                            else if (emoji.name === '4️⃣') {
                                searchUrl = youtubeUrl + youtubeResponse.data.items[3].id.videoId;
                            }
                            else if (emoji.name === '5️⃣') {
                                searchUrl = youtubeUrl + youtubeResponse.data.items[4].id.videoId;
                            }
                            setTimeout(() => {
                                msg.reactions.removeAll();
                            }, 30000);

                            const song = await songInfo([searchUrl], message.author);

                            if (song == null) {
                                return message.channel.send('Sorry, something went wrong');
                            }

                            logger.debug(`Selected song is ${song.title} at guild:${message.guild.id} by:${message.author.id}`);

                            setServerQueue(message, serverQueue, song);
                        }).catch((error) => {
                            logger.error(error, message.guild.id);
                            return msg.reply('No reaction after 30 seconds, operation canceled');
                        });
                    }
                    catch (error) {
                        logger.error(`One of the emojis failed to react in search guild:${message.guild.id}`);
                    }
                });
        }
        else {
            return message.channel.send('Song couldn\'t found');
        }

    }
}
;