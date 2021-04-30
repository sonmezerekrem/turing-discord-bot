const reset = '\x1b[0m';
const bright = '\x1b[1m';
const dim = '\x1b[2m';
const underscore = '\x1b[4m';
const blink = '\x1b[5m';
const reverse = '\x1b[7m';
const hidden = '\x1b[8m';

const fgBlack = '\x1b[30m';
const fgRed = '\x1b[31m';
const fgGreen = '\x1b[32m';
const fgYellow = '\x1b[33m';
const fgBlue = '\x1b[34m';
const fgMagenta = '\x1b[35m';
const fgCyan = '\x1b[36m';
const fgWhite = '\x1b[37m';

const bgBlack = '\x1b[40m';
const bgRed = '\x1b[41m';
const bgGreen = '\x1b[42m';
const bgYellow = '\x1b[43m';
const bgBlue = '\x1b[44m';
const bgMagenta = '\x1b[45m';
const bgCyan = '\x1b[46m';
const bgWhite = '\x1b[47m';

const info_text = '[INFO] ';//2
const warning_text = '[WARNING] ';//1
const error_text = '[ERROR] ';//0

const { logLevel } = require('../config.json');

function getDateTime() {
    let date = new Date();
    return [
            date.getUTCFullYear(),
            ('0' + (date.getUTCMonth() + 1)).slice(-2), ('0' + (date.getUTCDay() + 1)).slice(-2)].join('-') + ' ' +
        [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].join(':') + ' - ';
}


function info(text, guild) {
    if (logLevel > 1)
        console.log(/*fgGreen +*/ info_text + getDateTime() + guild + ' - ' + text + reset);
}

function error(text, guild) {
    console.log(fgRed + error_text + getDateTime() + guild + ' - ' + text + reset);
}

function warning(text, guild) {
    if (logLevel > 0)
        console.log(/*fgYellow +*/ warning_text + getDateTime() + guild + ' - ' + text + reset);
}

module.exports = {
    info: info,
    error: error,
    warning: warning,
};