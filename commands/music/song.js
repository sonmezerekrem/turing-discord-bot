const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').songInfo;
const { queue } = require('./utils');
const geniusToken = process.env.geniusToken;
const axios = require('axios').default;
const { geniusApi } = require('../../config.json');


module.exports = {
    name: 'song',
    description: 'Shows information about the current or searched song',
    guildOnly: true,
    args: false,
    aliases: [],
    usage: '[search query]',
    category: 'Music',
    type: 'general',
    async execute(message, args) {
        logger.debug(`Song command has been used at guild:${message.guild.id} by:${message.author.id}`);

        if (args.length > 0) {
            const song = {
                title: null,
                artist: null,
                album: null,
                release: null,
                lyricsUrl: null,
                color: '#0099ff',
                length: null,
                thumbnail: null,
                youtubeChannel: null,
                spotifyUrl: null,
                isGenius: true
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
                                song.album = songDetail.data.response.song.album.name;
                                song.release = songDetail.data.response.song.release_date;
                                song.lyricsUrl = songDetail.data.response.song.url;
                                song.color = songDetail.data.response.song.song_art_primary_color;
                                song.thumbnail = songDetail.data.response.song.song_art_image_thumbnail_url;
                                for(let j=0; j<songDetail.data.response.song.media.length;j++){
                                    if(songDetail.data.response.song.media[j].provider === "youtube")
                                        song.youtubeUrl = songDetail.data.response.song.media[j].url;
                                    if(songDetail.data.response.song.media[j].provider === "spotify")
                                        song.spotifyUrl = songDetail.data.response.song.media[j].url;
                                    if(songDetail.data.response.song.media[j].provider === "soundcloud")
                                        song.soundcloudUrl = songDetail.data.response.song.media[j].url;
                                }
                                song.isGenius = true;
                            }
                            return message.channel.send(embed(song));
                        }
                    }
                    return message.channel.send('Sorry, no song found for this query');
                }
                return message.channel.send('Sorry, no song found for this query');
            }
            catch (e) {
                logger.error(e.message);
            }
            return message.channel.send('Sorry, no song found for this query');
        }
        if (!message.member.voice.channel)
            return message.channel.send('You have to be in a voice channel to use this command!');

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is no song that I could show!');

        if (!message.client.voice.connections.has(message.guild.id))
            return message.channel.send('There is no song that I could show!');

        if (serverQueue.songs.length > 0) {
            if (serverQueue.playing !== null) {
                return message.channel.send(embed(serverQueue.songs[serverQueue.playing], serverQueue.connection.dispatcher.streamTime));
            }
            else {
                return message.channel.send('There is no song that I could show!');
            }
        }
        else
            return message.channel.send('There is no song that I could show!');
    }
};