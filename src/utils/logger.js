const winston = require('winston');
require('winston-mongodb');

const options = {
    production: {
        level: 'info',
        handleExceptions: true,
        json: true,
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH-mm-ss'
            }),
            winston.format.json()
        ),
        db: process.env.MONGO,
        options: {
            useUnifiedTopology: true
        },
        collection: 'logs'

    },
    development: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH-mm-ss'
            }),
            winston.format.printf((info) => `[${info.level.toUpperCase()}]: ${[info.timestamp]}: ${info.message}`),
            winston.format.colorize({
                all: true,
                level: false
            })
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


let transports;

if (process.env.NODE_ENV === 'production') {
    transports = [
        new winston.transports.MongoDB(options.production),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
            )
        })
    ];
}
else if (process.env.NODE_ENV === 'development') {
    transports = [
        new winston.transports.Console(options.development)
    ];
}
else {
    transports = [
        new winston.transports.Console(options.test)
    ];
}

const logger = winston.createLogger({
    transports,
    exitOnError: false
});


module.exports = logger;
