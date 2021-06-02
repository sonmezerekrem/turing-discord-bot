function levelUp(message, newLevel) {
    return `${message.author} level up -> ${newLevel}`;
}

function roleUp(message, newRole) {
    return `${message.author} role up -> ${newRole}`;
}

module.exports = {
    levelUp,
    roleUp
};
