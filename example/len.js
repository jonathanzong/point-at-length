var points = require('../');
var pt = points(process.argv.slice(2).join(' '));
console.log(pt.length());
