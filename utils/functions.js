const { monthNames } = require('./variables');


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function getDateAsString(date) {
    if (typeof date === 'string')
        return date.substring(8) + ' ' + monthNames[parseInt(date.substr(5, 2))] + ' ' + date.substr(0, 4);
    return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
}


module.exports = {
    toTitleCase, getDateAsString
};