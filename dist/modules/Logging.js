"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.log = void 0;
exports.default = $log;
require("colors");
function $log(message, data = {
    level: 'info',
}) {
    const level = data.level || 'info';
    const tags = data.tags || [];
    switch (level) {
        case 'info':
            console.log(`${new Date().toUTCString().gray} ${` ${level.toUpperCase()} `.bgBlue}${tags.length >= 1 ? ` ${tags.join(', '.gray)}` : ''} ${'~'.gray} ${message}`);
            break;
        case 'shadow':
            console.log(`${new Date().toUTCString().gray} ${'~'.gray} ${message.gray}`);
            break;
        case 'warn':
            console.warn(`${new Date().toUTCString().gray} ${` ${level.toUpperCase()} `.bgYellow}${tags.length >= 1 ? ` ${tags.join(', '.gray)}` : ''} ${'~'.gray} ${message}`);
            break;
        case 'error':
            console.error(`${new Date().toUTCString().gray} ${` ${level.toUpperCase()} `.bgRed}${tags.length >= 1 ? ` ${tags.join(', '.gray)}` : ''} ${'~'.gray} ${message}`);
            break;
    }
    return true;
}
const log = (message, tags) => {
    return $log(message, {
        level: 'info',
        tags,
    });
};
exports.log = log;
const warn = (message, tags) => {
    return $log(message, {
        level: 'warn',
        tags,
    });
};
exports.warn = warn;
const error = (message, tags) => {
    return $log(message, {
        level: 'error',
        tags,
    });
};
exports.error = error;
