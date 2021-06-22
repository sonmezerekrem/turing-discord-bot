const moment = require('moment-timezone');
const stringSimilarity = require('string-similarity');
const logger = require('../../utils/logger');
const { toTitleCase } = require('../../utils/functions');


module.exports = {
    name: 'clock',
    description: 'Show world clock',
    guildOnly: false,
    args: true,
    aliases: [],
    usage: '<city name>',
    category: 'Tool',
    execute(message, args) {
        logger.debug(`Clock command has been used at guild:${message.guild.id} by:${message.author.id}`);
        const zones = moment.tz.names();

        const matches = stringSimilarity.findBestMatch(args.join(' '), zones.map((z) => z.toLowerCase()));

        if (matches.bestMatch.rating > 0.40) {
            const zone = moment()
                .tz(matches.bestMatch.target);
            message.channel.send(`Time at **${toTitleCase(matches.bestMatch.target.replace('/', ' - ')
                .replace(/_/g, ' '))}**\n${zone.format('DD MMMM YYYY, HH:mm:ss')}`);
        }
        else {
            message.channel.send('I couldn\'t find any match for your search. All cities list: https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a');
        }
    }
};
