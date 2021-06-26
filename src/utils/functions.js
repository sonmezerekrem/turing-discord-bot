const {
    monthNames,
    levels
} = require('./variables');
const {
    prefix
} = require('../config.json');
const api = require('./api');
const canvases = require('./canvases');
const logger = require('./logger');


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0)
            .toUpperCase() + txt.substr(1)
            .toLowerCase()
    );
}


function getDateAsString(date) {
    if (date instanceof String || typeof date === 'string') {
        return `${date.substring(8)} ${monthNames[parseInt(date.substr(5, 2), 10)]} ${date.substr(0, 4)}`;
    }
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}


function formatTime(time) {
    // eslint-disable-next-line no-bitwise
    const hrs = ~~(time / 3600);
    // eslint-disable-next-line no-bitwise
    const mins = ~~((time % 3600) / 60);
    // eslint-disable-next-line no-bitwise
    const secs = ~~time % 60;
    return [hrs, ':', (mins < 10 ? `0${mins}` : mins), ':', (secs < 10 ? `0${secs}` : secs)].join('');
}


function timerController(message) {
    if (message.content === `${prefix}stop-timer`) {
        return false;
    }
}


function rules(message, command, guild) {
    if (guild != null && guild !== 404) {
        const rulesObj = new Map(JSON.parse(JSON.stringify([...guild.rules])));
        if (rulesObj.has(message.channel.id)) {
            const rule = rulesObj.get(message.channel.id);
            if (rule.name === 'nothing') {
                return [true, rule.message];
            }
            if (rule.name === 'no command') {
                if (rule.args.includes(command.name)) {
                    return [true, rule.message];
                }
                return [false, ''];
            }
            if (rule.name === 'only command') {
                if (!rule.args.includes(command.name)) {
                    return [true, rule.message];
                }
                return [false, ''];
            }
            if (rule.name === 'no category') {
                if (rule.args.includes(command.category)) {
                    return [true, rule.message];
                }
                return [false, ''];
            }
            if (rule.name === 'only category') {
                if (!rulesObj.args.includes(command.category)) {
                    return [true, rule.message];
                }
                return [false, ''];
            }
        }
    }
    return [false, ''];
}


async function getFromDatabase(message) {
    let member = await api.getMember(message.guild.id, message.author.id);
    if (member === 404) {
        await api.saveMember(message.guild.id,
            [message.guild.id, message.author.id, message.author.tag, message.member.joinedAt]);
        member = await api.getMember(message.guild.id, message.author.id);
    }
    let guild = await api.getGuild(message.guild.id);
    if (guild === 404) {
        await api.saveGuild([
            message.guild.id, message.guild.ownerID, message.guild.createdAt,
            message.guild.joinedAt, message.guild.region
        ]);
        guild = await api.getGuild(message.guild.id);
    }
    return [member, guild];
}


async function pointsAndLevels(message, member, guild) {
    if (member !== null && member !== 404) {
        const newPoint = message.content.length % 7;
        if (member.lastPoint != null && Date.now() - member.lastPoint > 10000) {
            api.givePoints(message.guild.id, message.author.id, newPoint, Date.now());

            let levelUp = false;
            const { level } = member;
            const point = member.points + newPoint;

            if (level > 17) {
                if (point > (2000 * point - 14000)) {
                    levelUp = true;
                }
            }
            else if (point > levels[level.toString()]) {
                levelUp = true;
            }

            if (levelUp) {
                api.updateMember(message.guild.id, message.author.id, { level: level + 1 });
                await canvases.levelUp(message, level + 1);
            }

            if (guild != null && guild.roleManagement && levelUp) {
                if (level === 3) {
                    let bronze = message.guild.roles.cache.find((role) => role.name === 'Bronze');
                    const newMember = message.guild.roles.cache.find((role) => role.name === 'New Member');
                    if (bronze == null) {
                        await message.guild.roles.create(
                            {
                                name: 'Bronze',
                                color: 'DARK_GOLD'
                            },
                            'Role for Bronze members'
                        );
                        bronze = message.guild.roles.cache.find((role) => role.name === 'Bronze');
                    }
                    message.member.roles.add(bronze)
                        .catch((error) => logger.error(`Bronze role give error: ${error.message}`));
                    message.member.roles.remove(newMember)
                        .catch((error) => logger.error(`New member role delete error: ${error.message}`));
                    await canvases.roleUp(message, bronze);
                }
                else if (level === 11) {
                    const bronze = message.guild.roles.cache.find((role) => role.name === 'Bronze');
                    let silver = message.guild.roles.cache.find((role) => role.name === 'Silver');
                    if (silver == null) {
                        await message.guild.roles.create(
                            {
                                name: 'Silver',
                                color: 'LIGHT_GREY'
                            },
                            'Role for Silver members'
                        );
                        silver = message.guild.roles.cache.find((role) => role.name === 'Silver');
                    }
                    message.member.roles.add(silver)
                        .catch((error) => logger.error(`Silver role give error: ${error.message}`));
                    message.member.roles.remove(bronze)
                        .catch((error) => logger.error(`Bronze role delete error: ${error.message}`));
                    await canvases.roleUp(message, silver);
                }
                else if (level === 17) {
                    const silver = message.guild.roles.cache.find((role) => role.name === 'Silver');
                    let gold = message.guild.roles.cache.find((role) => role.name === 'Gold');
                    if (gold == null) {
                        await message.guild.roles.create(
                            {
                                name: 'Gold',
                                color: 'GOLD'
                            },
                            'Role for Gold members'
                        );
                        gold = message.guild.roles.cache.find((role) => role.name === 'Silver');
                    }
                    message.member.roles.add(gold)
                        .catch((error) => logger.error(`Gold role give error: ${error.message}`));
                    message.member.roles.remove(silver)
                        .catch((error) => logger.error(`Silver role delete error: ${error.message}`));
                    await canvases.roleUp(message, gold);
                }
            }
        }
    }
}


module.exports = {
    toTitleCase,
    getDateAsString,
    formatTime,
    timerController,
    pointsAndLevels,
    rules,
    getFromDatabase
};
