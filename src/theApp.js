// window.path = path
// window.wgl = wgl;

const { node } = require("webpack");

// window.loadPositions = loadPositions;
var path = window.path;
var wgl = window.wgl;
var loadPositions = window.loadPositions;
var tehran = loadPositions("maps/teh");
tehran.then((loaded) =>
    loaded.graph.forEachNode((node) =>
        (node)
    )
)