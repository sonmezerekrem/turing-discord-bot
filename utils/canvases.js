const Discord = require('discord.js');
const {
    registerFont,
    createCanvas,
    loadImage
} = require('canvas');

registerFont('assets/fonts/Poppins-Bold.ttf', {
    family: 'Poppins Bold',
    weight: '600'
});


async function levelUp(message, newLevel) {
    const canvas = createCanvas(450, 120);
    const context = canvas.getContext('2d');

    const background = await loadImage(`assets/images/backgrounds/levelrole (${Math.floor(Math.random() * 9) + 1}).jpg`);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.fillStyle = '#ffffff';

    context.font = '30px "Poppins Bold"';
    context.fillText('Level Up', 30, 40);

    context.font = '16px "Poppins Bold"';
    context.fillText(`${message.member.displayName.substr(0, 20)}`, 32, 70);

    context.fillText(`${newLevel - 1}`, 32, 100);
    context.fillText(`${newLevel}`, 100, 100);
    const arrow = await loadImage('assets/images/icons/arrow-right-s-line.png');
    context.drawImage(arrow, 60, 82);

    const avatar = await loadImage(message.author.displayAvatarURL() != null
        ? message.author.displayAvatarURL({ format: 'png' })
        : 'assets/images/icons/avatar.png');
    context.drawImage(avatar, 340, 10, 100, 100);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'levelup.png');
    message.channel.send(attachment);
}

async function roleUp(message, newRole) {
    const canvas = createCanvas(450, 120);
    const context = canvas.getContext('2d');

    const background = await loadImage(`assets/images/backgrounds/levelrole (${Math.floor(Math.random() * 10) + 1}).jpg`);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.fillStyle = '#ffffff';

    context.font = '30px "Poppins Bold"';
    context.fillText('Role Update', 30, 40);

    context.font = '16px "Poppins Bold"';
    context.fillText(`${message.member.displayName.substr(0, 20)}`, 32, 70);

    context.fillText(`New Role:${newRole}`, 32, 100);

    const avatar = await loadImage(message.author.displayAvatarURL() != null
        ? message.author.displayAvatarURL({ format: 'png' })
        : 'assets/images/icons/avatar.png');
    context.drawImage(avatar, 340, 10, 100, 100);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'roleup.png');
    message.channel.send(attachment);
}

module.exports = {
    levelUp,
    roleUp
};
