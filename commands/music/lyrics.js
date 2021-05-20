const logger = require('../../utils/logger');
const geniusToken = process.env.geniusToken;
const axios = require('axios').default;
const { geniusApi } = require('../../config.json');
const embed = require('../../utils/embeds').lyrics;
const { queue } = require('./utils');


module.exports = {
    name: 'lyrics',
    description: 'Shows the lyrics for the playing song',
    guildOnly: true,
    args: false,
    category: 'Music',
    type: 'general',
    usage: '[search query]',
    async execute(message, args) {
        logger.debug(`Lyrics command has been used at guild:${message.guild.id} by:${message.author.id}`);

        if (args.length > 0) {
            const song = {
                title: null,
                artist: null,
                album: null,
                release: null,
                lyricsUrl: null,
                color: '#0099ff',
                length: null,
                thumbnail: null
            };
            const title = args.join(' ');
            try {
                const result = await axios({
                    method: 'get',
                    url: geniusApi + '/search',
                    data: {
                        q: title
                    },
                    headers: {
                        Authorization: 'Bearer ' + geniusToken
                    }
                }).catch(error => logger.error(error.message));
                if (result.status === 200 && result.data.meta.status === 200) {
                    for (let i = 0; i < result.data.response.hits.length; i++) {
                        if (result.data.response.hits[i].type === 'song') {
                            const songDetail = await axios({
                                method: 'get',
                                url: geniusApi + result.data.response.hits[i].result.api_path,
                                headers: {
                                    Authorization: 'Bearer ' + geniusToken
                                }
                            }).catch(error => logger.error(error.message));

                            if (songDetail.status === 200 && songDetail.data.meta.status === 200) {
                                song.title = songDetail.data.response.song.title_with_featured;
                                song.artist = songDetail.data.response.song.primary_artist.name;
                                song.lyricsUrl = songDetail.data.response.song.url;
                                song.color = songDetail.data.response.song.song_art_primary_color;
                                song.thumbnail = songDetail.data.response.song.song_art_image_thumbnail_url;
                            }
                            return message.channel.send(embed(song));
                        }
                    }
                    return message.channel.send('Sorry, no lyrics found for this song');
                }
                return message.channel.send('Sorry, no lyrics found for this song');
            }
            catch (e) {
                logger.error(e.message);
            }
        }
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to use this command!');

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue)
            return message.channel.send('There is no song that I could show lyrics!');

        if (!message.client.voice.connections.has(message.guild.id))
            return message.channel.send('There is no song that I could show lyrics!');

        if (serverQueue.playing == null)
            return message.channel.send('There is no song that I could show lyrics!');
        const song = serverQueue.songs[serverQueue.playing];

        if (song.lyricsUrl == null)
            return message.channel.send('Sorry, no lyrics found for this song');

        return message.channel.send(embed(song));


    }
};