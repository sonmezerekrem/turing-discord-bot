const { defaultActivity, defaultState, prefix } = require('../config.json');
const logger = require('../utils/logger');


const connect = async (client) => {
    await client.user.setPresence({
        status: defaultState,
        activity: {
            name: prefix + defaultActivity.name,
            type: defaultActivity.type
        }
    }).catch((error) => {
        logger.error(error.message);
    });

    logger.info(`Status is set to default: '${defaultState}'`);
    logger.info(`Activity is set to default: '${defaultActivity.name} ${defaultActivity.type}'`);
};

module.exports = {
    connect: connect
};