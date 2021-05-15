const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const logger = require('../../utils/logger');
const embed = require('../../utils/embeds').lyrics;
const { queue } = require('./utils');


module.exports = {
    name: 'lyrics',
    description: 'Shows the lyrics for the playing song',
    guildOnly: true,
    args: false,
    usage: '',
    channel: true,
    async execute(message, args) {
        logger.debug(`Lyrics command has been used at guild:${message.guild.id} by:${message.author.id}`);
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

        if (song.lyrics == null) {
            let lyrics = '';
            for (let i = 0; i < 5; i++) {
                if (lyrics === '') {
                    try {
                        const dom = await JSDOM.fromURL(song.lyricsUrl).catch(er => logger.error(er));
                        lyrics = dom.window.document.querySelector('.lyrics')
                            .textContent.trim()
                            .replace(/\[.*]/g, '')
                            .replace(/\n\n/g, '\n');
                        break;
                    }
                    catch (e) {
                        logger.error(e.message);
                    }
                }
            }
            if (lyrics === '') {
                return message.channel.send('Sorry, something went wrong with Genius');
            }
            song.lyrics = lyrics.substr(0, 2048);
        }
        return message.channel.send(embed(song));


    }
};