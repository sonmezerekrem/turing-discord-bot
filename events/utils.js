const { defaultActivity, defaultState } = require('../config.json');
const logger = require('../utils/logger');


const connect = async (client) => {
    await client.user.setPresence({
        status: defaultState,
        activity: {
            name: defaultActivity.name,
            type: defaultActivity.type
        }
    }).catch((error) => {
        logger.error(error);
    });

    logger.info(`Status is set to default: '${defaultState}'`);
    logger.info(`Activity is set to default: '${defaultActivity.name} ${defaultActivity.type}'`);
};

module.exports = {
    connect: connect
};