const axios = require('axios').default;
const logger = require('./logger');
const { backendPath } = require('../config.json');


async function getGuild(guildId) {
    const result = await axios({
        method: 'get',
        url: `${backendPath}/guilds/${guildId}`
    })
        .catch((error) => {
            if (error.response != null && error.response.status === 404) {
                return 404;
            }
            logger.warn(`Get guild error: ${error.message}`);
        });

    if (result === 404) {
        return 404;
    }
    if (result != null && Object.prototype.hasOwnProperty.call(result, 'status') && result.status === 200) {
        return result.data.guild;
    }
    return null;
}


async function saveGuild(args) {
    const result = await axios({
        method: 'post',
        url: `${backendPath}/guilds`,
        data: {
            guild: {
                guild: args[0],
                owner: args[1],
                created: args[2],
                joined: args[3],
                region: args[4]
            }
        }
    })
        .catch((error) => logger.warn(`Save guild error: ${error.message}`));

    return result.status === 201;
}


function updateGuild(guildId, args) {
    axios({
        method: 'patch',
        url: `${backendPath}/guilds/${guildId}`,
        data: {
            guild: args
        }
    })
        .then((result) => {
            if (result.status === 201) {
                logger.info('Updated guild');
            }
        })
        .catch((error) => logger.warn(`Update guild error: ${error.message}`));
}


function deleteGuild(guildId) {
    axios({
        method: 'delete',
        url: `${backendPath}/guilds/${guildId}`
    })
        .then((result) => {
            if (result.status === 201) {
                logger.info('Guild deleted');
            }
        })
        .catch((error) => logger.warn(`Delete guild error: ${error.message}`));
}


async function getMember(guildId, memberId) {
    const result = await axios({
        method: 'get',
        url: `${backendPath}/guilds/${guildId}/members/${memberId}`
    })
        .catch((error) => {
            if (error.response != null && error.response.status === 404) {
                return 404;
            }
            logger.warn(`Get member error: ${error.message}`);
        });

    if (result === 404) {
        return 404;
    }
    if (result != null && Object.prototype.hasOwnProperty.call(result, 'status') && result.status === 200) {
        return result.data.member;
    }
    return null;
}


async function saveMember(guildId, args) {
    const result = await axios({
        method: 'post',
        url: `${backendPath}/guilds/${guildId}/members`,
        data: {
            member: {
                guild: args[0],
                user: args[1],
                tag: args[2],
                joined: args[3]
            }
        }
    })
        .catch((error) => logger.warn(`Save member error: ${error.message}`));

    return result.status === 201;
}


function updateMember(guildId, memberId, args) {
    axios({
        method: 'patch',
        url: `${backendPath}/guilds/${guildId}/members/${memberId}`,
        data: {
            member: args
        }
    })
        .then((result) => {
            if (result.status === 201) {
                logger.info('Changes have saved');
            }
        })
        .catch((error) => logger.warn(`Update member error: ${error.message}`));
}


function givePoints(guildId, memberId, points, now) {
    axios({
        method: 'patch',
        url: `${backendPath}/guilds/${guildId}/members/${memberId}/points`,
        data: {
            points,
            lastPoint: now
        }
    })
        .then((result) => {
            if (result.status === 201) {
                logger.debug('Points given');
            }
        })
        .catch((error) => logger.warn(`Give points error: ${error.message}`));
}


function deleteMember(guildId, memberId) {
    axios({
        method: 'delete',
        url: `${backendPath}/guilds/${guildId}/members/${memberId}`
    })
        .then((result) => {
            if (result.status === 200) {
                logger.info('Member deleted');
            }
        })
        .catch((error) => logger.warn(error.message));
}


async function getTopTen(guildId) {
    const result = await axios({
        method: 'get',
        url: `${backendPath}/guilds/${guildId}/toplist`
    })
        .catch((error) => logger.warn(`Top ten error: ${error.message}`));

    if (result.status === 200) return result.data.members;
    return null;
}


async function reportUserResponse(issue) {
    const result = await axios({
        method: 'post',
        url: `${backendPath}/issues`,
        data: { issue }
    })
        .catch((error) => logger.warn(`Report issue error: ${error.message}`));

    if (result.status === 201) {
        return 201;
    }
    if (result.status === 403) {
        return 403;
    }
    return null;
}


module.exports = {
    getGuild,
    saveGuild,
    updateGuild,
    deleteGuild,
    getMember,
    saveMember,
    updateMember,
    deleteMember,
    givePoints,
    getTopTen,
    reportUserResponse
};
