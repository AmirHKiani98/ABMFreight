var d3geo = require('d3-geo')
var readFile = require("./readFile");
module.exports = createProjector;


function createProjector(fileAddress, r) {
    if (!r) r = 6371393; // radius of earth in meters
    var lonLatBbox = null
    return readFile(fileAddress).then(function(text) {
        lonLatBbox = JSON.parse(text);
        var q = [0, 0];
        var projector = d3geo.geoMercator()
            .center([lonLatBbox.cx, lonLatBbox.cy])
            .scale(r)
        return function(lon, lat) {
            q[0] = lon;
            q[1] = lat;

            let xyPoint = projector.invert(q)
            console.log(projector);
            return {
                x: xyPoint[0],
                y: xyPoint[1]
            };
        };
    });


}