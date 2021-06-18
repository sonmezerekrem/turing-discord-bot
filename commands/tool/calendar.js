const Canvas = require('canvas');
const Discord = require('discord.js');
const logger = require('../../utils/logger');
const { monthNames } = require('../../utils/variables');

Canvas.registerFont('assets/fonts/Poppins-Bold.ttf', {
    family: 'Poppins Bold',
    weight: '600'
});


module.exports = {
    name: 'calendar',
    description: 'Shows monthly calendar.',
    guildOnly: false,
    args: false,
    aliases: [],
    usage: '',
    category: 'Tool',
    async execute(message) {
        logger.debug(`Calendar command has been used at guild:${message.guild.id} by:${message.author.id}`);

        const today = new Date();

        const canvas = Canvas.createCanvas(750, 450);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(`assets/images/backgrounds/calendar${Math.ceil(Math.random() * 20) % 4 + 1}.jpg`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';

        context.font = '48px "Poppins Bold"';
        context.fillText(`${today.getFullYear()}  ${monthNames[today.getMonth()]}`, 64, 72);

        context.font = '32px "Poppins Bold"';

        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        let height = 180;
        let week = firstDay.getDay();
        for (let i = 1; i < lastDay.getDate(); i++) {
            const text = `${i < 10 ? `0${i}` : i}`;
            if (i === today.getDate()) {
                context.font = 'bold 32px "Poppins Bold"';
            }
            else {
                context.font = '32px "Poppins Bold"';
            }
            if (week % 7 === 0) {
                context.fillText(text, 636, height);
            }
            else if (week % 7 === 1) {
                context.fillText(text, 84, height);
            }
            else if (week % 7 === 2) {
                context.fillText(text, 176, height);
            }
            else if (week % 7 === 3) {
                context.fillText(text, 268, height);
            }
            else if (week % 7 === 4) {
                context.fillText(text, 360, height);
            }
            else if (week % 7 === 5) {
                context.fillText(text, 452, height);
            }
            else if (week % 7 === 6) {
                context.fillText(`${i < 10 ? `0${i}` : i}`, 540, height);
            }
            if (week % 7 === 0) {
                height += 46;
            }
            week++;
        }

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'calendar.png');

        return message.channel.send(attachment);
    }
};
