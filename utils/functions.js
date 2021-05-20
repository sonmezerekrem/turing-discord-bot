const { monthNames } = require('./variables');
const { prefix } = require('../config.json');


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function getDateAsString(date) {
    console.log(typeof date);
    if (date instanceof String || typeof date == "string") {
        return date.substring(8) + ' ' + monthNames[parseInt(date.substr(5, 2))] + ' ' + date.substr(0, 4);
    } return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
}

function formatTime(time) {
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;
    return [hrs, ':', (mins < 10 ? '0' + mins : mins), ':', (secs < 10 ? '0' + secs : secs)].join('');
}

function getPoint(message) {
    const length = Math.min(
        message.content.length + Math.floor(Math.random() * 7),
        Math.floor(Math.random() * 17) + (Math.random() * 119));
    const cofactor = Math.random() * 2;
    const cofactor2 = Math.random() * 13.73;
    const point = length * cofactor2 + cofactor;
    return Math.floor(point % (Math.floor(Math.random() * 6) + 3));
}

function timerController(message, timerObject) {
    if (message.content === `${prefix}stop-timer`)
        return false;
    if (timerObject.block) {
        message.delete();
        return true;
    }
}


module.exports = {
    toTitleCase, getDateAsString, formatTime, getPoint, timerController
};