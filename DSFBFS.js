console.time('test');
function ConvexHullGrahamScan() {
    this.anchorPoint = undefined;
    this.reverse = false;
    this.points = [];
}

ConvexHullGrahamScan.prototype = {

    constructor: ConvexHullGrahamScan,

    Point: function (x, y) {
        this.x = x;
        this.y = y;
    },

    _findPolarAngle: function (a, b) {
        var ONE_RADIAN = 57.295779513082;
        var deltaX, deltaY;

        //if the points are undefined, return a zero difference angle.
        if (!a || !b) return 0;

        deltaX = (b.x - a.x);
        deltaY = (b.y - a.y);

        if (deltaX == 0 && deltaY == 0) {
            return 0;
        }

        var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

        if (this.reverse){
            if (angle <= 0) {
                angle += 360;
            }
        }else{
            if (angle >= 0) {
                angle += 360;
            }
        }

        return angle;
    },

    addPoint: function (x, y) {
        //Check for a new anchor
        var newAnchor =
            (this.anchorPoint === undefined) ||
            ( this.anchorPoint.y > y ) ||
            ( this.anchorPoint.y === y && this.anchorPoint.x > x );

        if ( newAnchor ) {
            if ( this.anchorPoint !== undefined ) {
                this.points.push(new this.Point(this.anchorPoint.x, this.anchorPoint.y));
            }
            this.anchorPoint = new this.Point(x, y);
        } else {
            this.points.push(new this.Point(x, y));
        }
    },

    _sortPoints: function () {
        var self = this;

        return this.points.sort(function (a, b) {
            var polarA = self._findPolarAngle(self.anchorPoint, a);
            var polarB = self._findPolarAngle(self.anchorPoint, b);

            if (polarA < polarB) {
                return -1;
            }
            if (polarA > polarB) {
                return 1;
            }

            return 0;
        });
    },

    _checkPoints: function (p0, p1, p2) {
        var difAngle;
        var cwAngle = this._findPolarAngle(p0, p1);
        var ccwAngle = this._findPolarAngle(p0, p2);

        if (cwAngle > ccwAngle) {

            difAngle = cwAngle - ccwAngle;

            return !(difAngle > 180);

        } else if (cwAngle < ccwAngle) {

            difAngle = ccwAngle - cwAngle;

            return (difAngle > 180);

        }

        return true;
    },

    getHull: function () {
        var hullPoints = [],
            points,
            pointsLength;

        this.reverse = this.points.every(function(point){
            return (point.x < 0 && point.y < 0);
        });

        points = this._sortPoints();
        pointsLength = points.length;

        //If there are less than 3 points, joining these points creates a correct hull.
        if (pointsLength < 3) {
            points.unshift(this.anchorPoint);
            return points;
        }

        //move first two points to output array
        hullPoints.push(points.shift(), points.shift());

        //scan is repeated until no concave points are present.
        while (true) {
            var p0,
                p1,
                p2;

            hullPoints.push(points.shift());

            p0 = hullPoints[hullPoints.length - 3];
            p1 = hullPoints[hullPoints.length - 2];
            p2 = hullPoints[hullPoints.length - 1];

            if (this._checkPoints(p0, p1, p2)) {
                hullPoints.splice(hullPoints.length - 2, 1);
            }

            if (points.length == 0) {
                if (pointsLength == hullPoints.length) {
                    //check for duplicate anchorPoint edge-case, if not found, add the anchorpoint as the first item.
                    var ap = this.anchorPoint;
                    //remove any udefined elements in the hullPoints array.
                    hullPoints = hullPoints.filter(function(p) { return !!p; });
                    if (!hullPoints.some(function(p){
                            return(p.x == ap.x && p.y == ap.y);
                        })) {
                        hullPoints.unshift(this.anchorPoint);
                    }
                    return hullPoints;
                }
                points = hullPoints;
                pointsLength = points.length;
                hullPoints = [];
                hullPoints.push(points.shift(), points.shift());
            }
        }
    }
};

// EXPORTS

if (typeof define === 'function' && define.amd) {
    define(function() {
        return ConvexHullGrahamScan;
    });
}
if (typeof module !== 'undefined') {
    module.exports = ConvexHullGrahamScan;
}


class Point
{
    constructor(x, y)
    {
        this.x = y;
        this.y = x;
    }
}

function UserException (message) {
  this.message=message;
  this.name="UserException";
  }

let x_y = new Array();
let x_y_total = new Array();
let newhull = new Array();
let finalanswer = new Array();
function processData(input) {
    const const_input = input.split('\n')
    let m = const_input[0];
    m = m.split(" ");
    let data = const_input;
    data.shift();
    let array = data.map(data => data.split(''));
    array.reverse();
    
    const ROW = m[0], COL = m[1];
    CenterOfIsland(array);
    
    function CenterOfIsland(array) {

        let visited = new Array(ROW);
        for(let i = 0; i < ROW; i++)
        {
            visited[i] = new Array(COL);
        }
        for (let i = 0; i < ROW; i++) {
            for (let j = 0; j < COL; j++) {
                visited[i][j] = false;
            }
        }
        

        for (let i = 0; i < ROW; ++i)
            {
                for(let j = 0; j < COL; ++j)
                    {
                        if(array[i][j] == 1 && !visited[i][j])
                            {
                                DFS(array,i,j,visited);
                                x_y_total.push(x_y.map(x_y => x_y.split(' ')));
                                x_y = [];
                            }
                    }
            }
    
    function DFS(array,row, col,visited)
    {
        let rowNbr = [-1, -1, -1, 0, 0, 1, 1, 1, 2, -2, 0, 0];
        let colNbr = [-1, 0, 1, -1, 1, -1, 0, 1, 0, 0, 2, -2];

        visited[row][col] = true;
        x_y.push(`${row} ${col}`);
        for (let k = 0; k < 12; ++k)
        {
            if (isSafe(array, row + rowNbr[k], col + colNbr[k], visited))
            {
                DFS(array, row + rowNbr[k], col + colNbr[k], visited);
            }
        }

    }

    function isSafe(array, row, col, visited)
    {
        return (row >= 0) && (row < ROW) && (col >= 0) && (col < COL) && (array[row][col] == 1 && !visited[row][col]);
    }
        
    }

    
    for (let i = 0; i < x_y_total.length; i++) {
        let points = new Array();
        for (let j = 0; j < x_y_total[i].length; j++) {
        points.push(new Point(x_y_total[i][j][0], x_y_total[i][j][1]));
        }

        

        function orientation(p, q, r)
    {
        let val = (q.y - p.y) * (r.x - q.x) -
                        (q.x - p.x) * (r.y - q.y);

            if (val == 0) return 0;  // collinear
            return (val > 0)? 1: 2; // clock or counterclock wise
    }

        var convexHull = new ConvexHullGrahamScan();

        points.forEach(element => {
                    convexHull.addPoint(element.x,element.y);
                })

        var hull = convexHull.getHull();


        for(let i = 0; i < hull.length; i++) {
            if(i + 1 < hull.length) {
              points.forEach(element => {
                if(orientation(hull[i], element, hull[i+1]) == 0){
                  newhull.push(element);
                }
              })}
            else if(i + 1 == hull.length) {
              points.forEach(element => {
                if(orientation(hull[i], element, hull[0]) == 0) {
                  newhull.push(element);
                }
              })
            }
          }
        
        var answer = new Set(newhull);
        answer = Array.from(answer).sort();
        
        
        }
        
        finalanswer = answer.map(o => [o.x, o.y]);
        finalanswer.sort(function(a, b) {
        return a[0] - b[0] || a[1] - b[1];});
        
        finalanswer.forEach(element => {
        console.log(element.join(" "));});           
        }
      let inputog = `33 33 2
000000000000000000000010000000000
000000000000000000000111000000000
000000000000000000001110100000000
000000000000000000011111111000000
000000000000000000001011100000000
000000000000000000000111000000000
000000000000000000000010000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
011111111111110000000000000000000
011011111111110000000000000000000
011111111110110000000000000000000
011111111111110000000000000000000
011111111111110000000000000000000
011111011111110000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000
000000000000000000000000000000000`;

processData(inputog);
console.timeEnd('test');
