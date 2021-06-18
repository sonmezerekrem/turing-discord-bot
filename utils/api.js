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
            logger.warn(`${error.message}`);
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
        .catch((error) => logger.warn(error.message));

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
                logger.info('Changes have saved');
            }
        })
        .catch((error) => logger.warn(error.message));
}


function deleteGuild(guildId) {
    axios({
        method: 'patch',
        url: `${backendPath}/guilds/${guildId}`,
        data: {
            guild: { isActive: false }
        }
    })
        .then((result) => {
            if (result.status === 201) {
                logger.info('Guild has deleted');
            }
        })
        .catch((error) => logger.warn(error.message));
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
            logger.warn(`${error.message}`);
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
        .catch((error) => logger.warn(error.message));

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
        .catch((error) => logger.warn(error.message));
}


function givePoints(guildId, memberId, points) {
    axios({
        method: 'patch',
        url: `${backendPath}/guilds/${guildId}/members/${memberId}/points`,
        data: {
            points
        }
    })
        .then((result) => {
            if (result.status === 201) {
                logger.debug('Points given');
            }
        })
        .catch((error) => logger.warn(error.message));
}


function deleteMember(guildId, memberId) {
    axios({
        method: 'patch',
        url: `${backendPath}/guilds/${guildId}/members/${memberId}`,
        data: {
            member: { isActive: false }
        }
    })
        .then((result) => {
            if (result.status === 201) {
                logger.info('Changes have saved');
            }
        })
        .catch((error) => logger.warn(error.message));
}


async function getTopTen(guildId) {
    const result = await axios({
        method: 'get',
        url: `${backendPath}/guilds/${guildId}/toplist`
    })
        .catch((error) => logger.warn(error.message));

    if (result.status === 200) return result.data.members;
    return null;
}


async function getWeeklyTop(guildId) {
    const result = await axios({
        method: 'get',
        url: `${backendPath}/guilds/${guildId}/weekly`
    })
        .catch((error) => logger.warn(error.message));

    if (result.status === 200) return result.data.members;
    return null;
}


function addMemberConnection(guildId, memberId, url, name) {
    axios({
        method: 'post',
        url: `${backendPath}/guilds/${guildId}/members/${memberId}/connections`,
        data: {
            url,
            name
        }
    })
        .then((result) => {
            if (result.status === 201) {
                logger.info('Connection added');
            }
        })
        .catch((error) => logger.warn(error.message));
}


function removeMemberConnection(guildId, memberId, name) {
    axios({
        method: 'delete',
        url: `${backendPath}/guilds/${guildId}/members/${memberId}/connections`,
        data: {
            name
        }
    })
        .then((result) => {
            if (result.status === 200) {
                logger.info('Connection removed');
            }
        })
        .catch((error) => logger.warn(error.message));
}


function reportUserResponse(issue) {

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
    getWeeklyTop,
    addMemberConnection,
    removeMemberConnection,
    reportUserResponse
};
