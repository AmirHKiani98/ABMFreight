const loadPositions = require("./loadGraph");
const wgl = require("wgl");
const createTree = require('yaqt');
const path = require("ngraph.path");
window.path = path
window.wgl = wgl;
window.loadPositions = loadPositions;
window.createTree = createTree;