// window.path = path
// window.wgl = wgl;
// window.loadPositions = loadPositions;
var path = window.path;
var wgl = window.wgl;
var loadPositions = window.loadPositions;
var tehran = loadPositions("maps/teh");
tehran.then((loaded) =>
    console.log(loaded.graph)
)