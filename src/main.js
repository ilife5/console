
var $console = require('./console.js');

var methods = ['log', 'info', 'error', 'warn', 'dir', 'count', 'group', 'groupEnd', 'time', 'timeEnd', 'trace', 'clear', 'debug'];

if(console === void 0) {
    console = {};
}

for(var i = 0, len = methods.length; i < len; i++) {
    //if(typeof console[methods[i]] !== 'function') {
        console[methods[i]] = $console[methods[i]];
    //}
}