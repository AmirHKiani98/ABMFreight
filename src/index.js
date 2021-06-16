const loadPositions = require("./loadGraph");
const wgl = require("w-gl");
const createTree = require('yaqt');
const createScene = require("./createScene/createScene");
const inverseProjector = require("./createInverseProjector")
const path = require("ngraph.path");
window.path = path
window.wgl = wgl;
window.loadPositions = loadPositions;
window.createTree = createTree;

var tehran = loadPositions("maps/teh");
const projector = inverseProjector(51.3107924, 35.71149135);
tehran.then((loaded) => {
    console.log(loaded.graph.getNode(0))
    var data = loaded.graph.getNode(0);
    console.log(projector(data.data.x, data.data.y))
})