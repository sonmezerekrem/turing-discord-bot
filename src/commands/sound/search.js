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
    description: 'Search for videos in Youtube.',
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

        const filter = (m) => m.content === '1'
            || m.content === '2'
            || m.content === '3'
            || m.content === '4'
            || m.content === '5';

        message.channel.send(search(message.guild.name, title, videos))
            .then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                })
                    .then(async (collected) => {
                        // eslint-disable-next-line no-restricted-syntax, prefer-const
                        for (let value of collected.values()) {
                            if (value.author.id === message.author.id) {
                                url = videos[parseInt(value.content - 1, 10)].url;

                                const song = await songInfo([url], message);

                                if (song.found === 0) {
                                    return message.channel.send('Sorry, I couldn\'t any song for this.');
                                }

                                const playlist = getPlaylist(message.client, message.guild.id);

                                await joinTheVoice(message);

                                playlist.songs.push(song);

                                if (playlist.playing === -2) {
                                    await player(message, playlist.songs.length - 1);
                                }
                                else if (playlist.playing !== null) {
                                    message.channel.send(`**${song.title}** has added to queue`);
                                }
                                else {
                                    await player(message);
                                }
                                break;
                            }
                        }
                    })
                    .catch(() => {
                    });
            })
            .catch(() => {
            });
    }
};
