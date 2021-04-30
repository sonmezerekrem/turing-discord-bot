const { defaultActivity, defaultState } = require('../configs/config.json');
const logger = require('./logger');


const connect = (client) => {
    client.user.setStatus(defaultState)
        .then(() => {
            logger.info('Status is set to default.', 0);
        })
        .catch(err => {
            logger.error(err, 0);
        });
    client.user.setActivity(defaultActivity.name, { type: defaultActivity.type })
        .then(() => {
            logger.info('Activity is set to default.', 0);
        })
        .catch(err => {
            logger.error(err, 0);
        });

    if (!client.user.avatarURL) {
        client.user.setAvatar(`./assets/avatar/avatar (${Math.floor(Math.random() * 11) + 1}).png`).then(() => {
            logger.info('New avatar is set', 0);
        }).catch(error => logger.error(error, 0));
    }

};

module.exports = {
    connect: connect
};