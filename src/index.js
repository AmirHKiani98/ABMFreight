const loadPositions = require("./loadGraph");
const wgl = require("w-gl");
const createTree = require('yaqt');
const makeScene = require("./createScene/createScene");
const SVGContainer = require("./createScene/SVGContainer");
const inverseProjector = require("./createInverseProjector")
const path = require("ngraph.path");
const RouteHandleViewModel = require("./createScene/RouteHandleViewModel");


window.path = path
window.wgl = wgl;
window.loadPositions = loadPositions;
window.createTree = createTree;


var scale = null;
let routeStart = new RouteHandleViewModel(updateRoute, findNearestPoint);
let routeEnd = new RouteHandleViewModel(updateRoute, findNearestPoint);
var hetTestTree = null;
var graph = null;
var bbox = null;
var tehran = loadPositions("maps/teh");
const projector = inverseProjector(51.3107924, 35.71149135);
tehran.then((loaded) => {
    initHitTestTree(loaded.points);
    graph = loaded.graph;
    bbox = loaded.graphBBox;
    createScene();
})



var scene = null;

function createScene() {
    ensurePreviousSceneDestroyed();

    let canvas = document.getElementById("my_canvas");
    console.log(canvas)
    loaded = true;

    scene = wgl.scene(canvas);
    scene.setPixelRatio(2);
    console.log(document.getElementsByTagName("svg")[0]);
    let svgConntainer = new SVGContainer(document.getElementsByTagName("svg")[0].querySelector('.scene'), updateSVGElements);
    scene.appendChild(svgConntainer)
    scene.setClearColor(12 / 255, 41 / 255, 82 / 255, 1)
        //scene.setClearColor(1, 1, 1, 1)

    let initialSceneSize = bbox.width / 8;
    scene.setViewBox({
        left: -initialSceneSize,
        top: -initialSceneSize,
        right: initialSceneSize,
        bottom: initialSceneSize,
    })


    let linksCount = graph.getLinksCount();
    let lines = new wgl.WireCollection(linksCount);
    lines.color = { r: 0.8, g: 0.8, b: 0.8, a: 0.7 }
        // lines.color = {r: 0.1, g: 0.1, b: 0.1, a: 0.9}
    graph.forEachLink(function(link) {
        let from = graph.getNode(link.fromId).data;
        let to = graph.getNode(link.toId).data

        lines.add({ from, to });
    });

    scene.appendChild(lines);

    scene.on('mousemove', onMouseMoveOverScene, this);
    scene.on('click', this.onSceneClick, this);

    document.body.addEventListener('mousedown', handleMouseDown, true);
    document.body.addEventListener('touchstart', handleMouseDown, true);
}


function unsubscribeMoveEvents() {
    document.body.removeEventListener('mousedown', handleMouseDown, true);
    document.body.removeEventListener('touchstart', handleMouseDown, true);
}



function handleMouseDown(e) {
    var s;
    var touchId = undefined;
    if (e.touches) {
        let mainTouch = (e.changedTouches || e.touches)[0];
        s = scene.getSceneCoordinate(mainTouch.clientX, mainTouch.clientY);
        touchId = mainTouch.identifier;
    } else {
        s = scene.getSceneCoordinate(e.clientX, e.clientY);
    }

    let handleUnderCursor = getRouteHandleUnderCursor({
        sceneX: s.x,
        sceneY: s.y
    }, scene);
    if (handleUnderCursor) {
        e.stopPropagation()
        e.preventDefault()
        handleUnderCursor.startDragging(scene, touchId);
        return;
    }
}

function onMouseMoveOverScene(e) {
    let now = new Date();
    let handle = getRouteHandleUnderCursor(e, scene);
}

function handleSceneClick(e) {
    if (!routeStart.visible) {
        setRoutePointFormEvent(e, routeStart);
    } else if (!routeEnd.visible) {
        setRoutePointFormEvent(e, routeEnd);
    }
}



function updateRoute() {
    if (!(routeStart.visible && routeEnd.visible)) {
        api.pathInfo.svgPath = '';
        return;
    }

    let fromId = routeStart.pointId;
    let toId = routeEnd.pointId;
    updateQueryString();

    let start = window.performance.now();
    let path = findPath(fromId, toId);
    let end = window.performance.now() - start;

    api.pathInfo.noPath = path.length === 0;
    api.pathInfo.svgPath = getSvgPath(path);

    stats.lastSearchTook = (Math.round(end * 100) / 100) + 'ms';
    stats.pathLength = getPathLength(path);
    stats.visible = true;
}


function findNearestPoint(x, y, maxDistanceToExplore = 2000) {
    if (!hetTestTree) return;

    let points = hetTestTree.pointsAround(x, y, maxDistanceToExplore).map(idx => graph.getNode(idx / 2))
        .sort((a, b) => {
            let da = pointDistance(a.data, x, y);
            let db = pointDistance(b.data, x, y)
            return da - db;
        });

    if (points.length > 0) {
        return points[0];
    } else {
        // keep trying.
        return findNearestPoint(x, y, maxDistanceToExplore * 2);
    }
}

function initHitTestTree(loadedPoints) {
    hetTestTree = createTree();
    hetTestTree.initAsync(loadedPoints, {});
}

function ensurePreviousSceneDestroyed() {
    if (scene) {
        scene.dispose();
        scene = null;
    }
    if (unsubscribeMoveEvents) {
        unsubscribeMoveEvents();
        unsubscribeMoveEvents = null;
    }
}

function getRouteHandleUnderCursor(e, scene) {
    let transform = scene.getTransform();
    let scale = transform.scale / scene.getPixelRatio();
    if (routeStart.intersects(e.sceneX, e.sceneY, scale)) {
        return routeStart;
    }
    if (routeEnd.intersects(e.sceneX, e.sceneY, scale)) {
        return routeEnd;
    }
}


function updateSVGElements(svgConntainer) {
    let strokeWidth = 6 / svgConntainer.scale;
    document.getElementById("my_path").setAttributeNS(null, 'stroke-width', strokeWidth + 'px');
    scale = svgConntainer.scale / scene.getPixelRatio();
}
// getRouteHandleUnderCursor,updateSVGElements