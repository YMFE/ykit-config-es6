module.exports = function (content) {
    return content.replace(/["']use strict["']/g, '');
}
