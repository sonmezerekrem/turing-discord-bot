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
        )
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
            winston.format.colorize({ all: true, level: false })
        )
    },
    test: {
        level: 'info',
        handleExceptions: true,
        json: false,
        colorize: false,
        format: winston.format.printf((info) => `${info.level}: ${info.message}`)
    }
};


const logger = winston.createLogger({

    transports: [
        new winston.transports.Console(options[process.env.environment])
    ],
    exitOnError: false
});


module.exports = logger;