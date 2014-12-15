var parse = require('parse-svg-path');
var isarray = require('isarray');
var abs = require('abs-svg-path');

module.exports = Points;

function Points (path) {
    if (!(this instanceof Points)) return new Points(path);
    this._path = abs(isarray(path) ? path : parse(path));
}

Points.prototype.at = function (pos) {
    return this._walk(function (len) {
        return len >= pos;
    }).pos;
};

Points.prototype.length = function () {
    return this._walk().length;
};

Points.prototype._walk = function (fn) {
    var cur = [ 0, 0 ];
    var len = 0;
    
    for (var i = 0; i < this._path.length; i++) {
        var p = this._path[i];
        if (p[0] === 'M') {
            cur[0] = p[1];
            cur[1] = p[2];
        }
        else if (p[0] === 'C') {
            for (var j = 0; j <= 100; j++) {
                var t = j / 100;
                var x = Math.pow((1-t), 3) * cur[0]
                    + 3 * Math.pow((1-t), 2) * t * p[1]
                    + 3 * (1-t) * Math.pow(t, 2) * p[3]
                    + Math.pow(t, 3) * p[5]
                ;
                var y = Math.pow((1-t), 3) * cur[1]
                    + 3 * Math.pow((1-t), 2) * t * p[2]
                    + 3 * (1-t) * Math.pow(t, 2) * p[4]
                    + Math.pow(t, 3) * p[6]
                ;
                len += dist(cur[0], cur[1], x, y);
                
                cur[0] = x;
                cur[1] = y;
                if (fn && fn(len)) return { length: len, pos: cur };
            }
        }
    }
    return { length: len, pos: cur };
};

function dist (ax, ay, bx, by) {
    var x = ax - bx;
    var y = ay - by;
    return Math.sqrt(x*x + y*y);
}
