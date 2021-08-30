/*eslint-disable*/
const logger = require('../../utils/logger');
const api = require('../../utils/api');
const { prefix } = require('../../config.json');
const { categories } = require('../../utils/variables');


module.exports = {
    name: 'rule',
    description: 'Sets a rule for how commands are used',
    guildOnly: true,
    args: true,
    aliases: [],
    usage: '<add | remove> <no-command | no-category | only-command | only-category> <command or category list>',
    permissions: 'ADMINISTRATOR',
    category: 'Moderation',
    async execute(message, args) {
        logger.debug(`Rule command has been used at guild:${message.guild.id} by:${message.author.id}`);

        if (args.length < 3) {
            return message.channel.send(`Please give proper arguments. The proper usage would be: \`${prefix}${this.name} ${this.usage}\``);
        }

        const operation = args[0];
        const type = args[1];
        if ((operation !== 'add' && operation !== 'remove')
            || (type !== 'no-category' && type !== 'no-command' && type !== 'only-category' && type !== 'only-category')) {
            return message.channel.send(`Please give proper arguments. The proper usage would be: \`${prefix}${this.name} ${this.usage}\``);
        }

        const commandList = args.slice(2);
        let filteredList;
        if (type.includes('category')) {
            filteredList = commandList.filter((category) => Object.prototype.hasOwnProperty.call(categories, category));
        }
        else {
            filteredList = commandList.filter((command) => message.client.commands.get(command)
                || message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command)));
        }

        if (commandList.length !== filteredList.length) {
            return message.channel.send(`Please give proper arguments. The proper usage would be: \`${prefix}${this.name} ${this.usage}\``);
        }

        const commands = commandList.map(c => message.client.commands.get(c) || message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(c)));

        const guildDb = await api.getGuild(message.guild.id);

        if (guildDb != null && guildDb !== 404) {
            const rules = guildDb.rules;
            let rulesMap;
            if (rules != null) {
                rulesMap = new Map(rules);
            }
            else {
                rulesMap = new Map();
            }

            if (rulesMap.has(message.channel.id)) {
                const channelRules = rulesMap.get(message.channel.id);
                if (operation === 'add') {
                    //todo
                }
                else {
                    //todo
                }
            }
            else {
                if (operation === 'add') {
                    rulesMap.set(message.channel.id, [{
                        type: type,
                        args: commands.map((c) => c.name)
                    }]);
                    api.updateGuild(message.guild.id, { rules: Object.fromEntries(rulesMap) });
                    message.channel.send('Rules for this channel updated.');
                }
                else {
                    return message.channel.send('There is not a rule for your arguments to remove');
                }
            }

        }
    }
};
