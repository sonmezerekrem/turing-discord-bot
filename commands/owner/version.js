const yaml = require('js-yaml');
const fs = require('fs');
const logger = require('../../utils/logger');
const { version } = require('../../config.json');


module.exports = {
    name: 'version',
    description: 'Show changes in last version of bot',
    guildOnly: false,
    args: false,
    aliases: [],
    usage: '',
    category: 'Owner',
    type: 'general',
    cooldown: 60,
    execute(message, args) {
        logger.debug(`Version command has been used at guild:${message.guild.id} by:${message.author.id}`);

        try {
            const channel = message.channel;
            message.delete();
            const doc = yaml.load(fs.readFileSync('versions.yml', 'utf8'));
            const added = doc.versions[version]['Added'];
            const fixed = doc.versions[version]['Fixed or Changed'];
            let content = `**VERSION ${version}**\n\n__Added__\n- ${added.join('\n- ')}\n\n__Fixed or Changed__\n- ${fixed.join('\n- ')}`;
            channel.send(content);
        }
        catch (e) {
            console.log(e.message);
        }
    }
};