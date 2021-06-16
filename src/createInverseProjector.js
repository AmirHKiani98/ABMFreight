var d3geo = require('d3-geo')

module.exports = createProjector;

function createProjector(cx, cy, r) {
    if (!r) r = 6371393; // radius of earth in meters

    var q = [0, 0];
    var projector = d3geo.geoMercator()
        .center([cx, cy])
        .scale(r)

    return function(lon, lat) {
        q[0] = lon;
        q[1] = lat;

        let xyPoint = projector.invert(q)

        return {
            x: xyPoint[0],
            y: xyPoint[1]
        };
    };
}