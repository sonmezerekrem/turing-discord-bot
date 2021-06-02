const axios = require('axios').default;
const logger = require('../../utils/logger');
const { prefix } = require('../../config.json');
const {
    libraryPlatform,
    libraryProject
} = require('../../utils/embeds');
const { platforms } = require('../../utils/variables');


module.exports = {
    name: 'library',
    description: 'Search in libraries.io for projects',
    guildOnly: false,
    args: true,
    aliases: platforms.map((platform) => platform.name.toLowerCase()),
    usage: '',
    category: 'Developer',
    type: 'general',
    cooldown: 30,
    async execute(message, args) {
        logger.debug(`Library command has been used at guild:${message.guild.id} by:${message.author.id}`);

        if (message.content.startsWith(`${prefix}library`)) {
            if (platforms.map((platform) => platform.name.toLowerCase())
                .includes(args[0])) {
                return message.channel.send(
                    libraryPlatform(platforms.find((platform) => platform.name.toLowerCase() === args[0]))
                );
            }

            return message.channel.send('I couldn\'t find this platform at libraries.io.');
        }

        const platform = message.content.substring(1, message.content.indexOf(' '));
        axios({
            method: 'get',
            url: `https://libraries.io/api/${platform}/${args[0]}?api_key=${process.env.LIBRARIES_IO}`
        })
            .then((result) => {
                if (result.status === 200) {
                    const project = {
                        name: result.data.name,
                        description: result.data.description,
                        homepage: result.data.homepage,
                        language: result.data.language,
                        latestStableRelease: result.data.latest_stable_release_number,
                        latestStableReleaseDate: result.data.latest_stable_release_published_at,
                        license: result.data.licenses,
                        platform: result.data.platform,
                        repository: result.data.repository_url,
                        color: platforms.find((plat) => plat.name.toLowerCase() === platform).color,
                        url: result.data.package_manager_url
                    };
                    return message.channel.send(libraryProject(project));
                }
                if (result.status === 404) {
                    return message.channel.send('I couldn\'t find this project at libraries.io.');
                }

                return message.channel.send('Sorry, I couldn\'t get response from libraries.io right now.');
            })
            .catch((error) => logger.error(error.message));
    }
};
