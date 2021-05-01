const winston = require('winston');

const options = {
    production: {
        level: 'info',
        handleExceptions: true,
        json: true,
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss'
            }),
            winston.format.json()
        ),

    },
    develop: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD ZZ HH:mm:ss'
            }),
            winston.format.printf((info) => `[${info.level.toUpperCase()}]:  ${[info.timestamp]}: ${info.message}`),
            winston.format.colorize({all:true, level:false} ),
        )
    }
};


const logger = winston.createLogger({

    transports: [
        new winston.transports.Console(options.develop)
    ],
    exitOnError: false
});


module.exports = logger;