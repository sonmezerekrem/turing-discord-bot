const {defaultActivity} = require("../../config.json")
const logger = require('../../utils/logger');

const { queue } = require('./commons');

module.exports = {
    name: 'leave',
    description: 'Joins the voice channel where is is connected',
    guildOnly: true,
    args: false,
    aliases: ['l', 'disconnect'],
    usage: '',
    execute(message, args) {
        if (message.member.voice.channel) {
            message.member.voice.channel.leave();
            queue.delete(message.guild.id);
            message.client.user.setActivity(defaultActivity.name, { type: defaultActivity.type }).then(() => {
                logger.info(`${message.client.user.tag} is disconnected to voice and set to default activity`, message.guild.id);
            });
            return message.channel.send(`I am leaving from ${message.member.voice.channel}`);
        } else {
            return message.channel.send('You need to be in a voice channel!');
        }
    },
};