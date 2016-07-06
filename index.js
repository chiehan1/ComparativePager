var date1 = new Date();
require('babel-register');
require('babel-polyfill');
require('./src/insertPbs.js');
var date2 = new Date();
console.log((date2 - date1)/1000, 'seconds');