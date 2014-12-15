var points = require('../');
var pt = points(process.argv.slice(3).join(' '));
var t = Number(process.argv[2]);
console.log(pt.at(t));
