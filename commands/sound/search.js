const yts = require('yt-search');

const {
    songInfo,
    getPlaylist,
    player,
    joinTheVoice
} = require('./utils');

const logger = require('../../utils/logger');
const { search } = require('../../utils/embeds');


module.exports = {
    name: 'search',
    description: 'Search for videos in Youtube',
    guildOnly: true,
    args: true,
    category: 'Sound',
    usage: '<search query>',
    async execute(message, args) {
        logger.debug(`Search command has been used at guild:${message.guild.id} by:${message.author.id}`);

        let url = '';
        const title = args.join(' ');
        const results = await yts(title);
        const videos = results.videos.slice(0, 5);

        message.channel.send(search(message.guild.name, title, videos))
            .then(async (msg) => {
                try {
                    await msg.react('1️⃣');
                    await msg.react('2️⃣');
                    await msg.react('3️⃣');
                    await msg.react('4️⃣');
                    await msg.react('5️⃣');

                    msg.awaitReactions((reaction, user) => user.id === message.author.id, {
                        max: 1,
                        time: 30000
                    })
                        .then(async (collected) => {
                            if (collected.first() != null) {
                                const { emoji } = collected.first();
                                if (emoji.name === '1️⃣') {
                                    url = videos[0].url;
                                }
                                else if (emoji.name === '2️⃣') {
                                    url = videos[1].url;
                                }
                                else if (emoji.name === '3️⃣') {
                                    url = videos[2].url;
                                }
                                else if (emoji.name === '4️⃣') {
                                    url = videos[3].url;
                                }
                                else if (emoji.name === '5️⃣') {
                                    url = videos[4].url;
                                }
                                setTimeout(() => {
                                    msg.reactions.removeAll();
                                }, 30000);
                            }

                            const song = await songInfo([url], message);

                            if (song.found !== 1) {
                                return message.channel.send('Sorry, I couldn\'t any song for this.');
                            }

                            const playlist = getPlaylist(message.client, message.guild.id);

                            await joinTheVoice(message);

                            if (playlist.playing !== null) {
                                playlist.songs.push(song);
                                message.channel.send(`**${song.title}** has added to queue`);
                            }
                            else {
                                playlist.songs.push(song);
                                player(message);
                            }
                        })
                        .catch((error) => {
                            logger.error(error.message);
                            msg.reactions.removeAll();
                        });
                }
                catch (error) {
                    logger.error(`One of the emojis failed to react in dice guild:${message.guild.id}`);
                }
            });
    }
};
