const loadPositions = require("./loadGraph");
const wgl = require("w-gl");
const createTree = require('yaqt');
const makeScene = require("./createScene/createScene");
const SVGContainer = require("./createScene/SVGContainer");
const inverseProjector = require("./createInverseProjector");
const npath = require('ngraph.path');
const path = require("ngraph.path");
const queryState = require('query-state');
const RouteHandleViewModel = require("./createScene/RouteHandleViewModel");


window.path = path
window.wgl = wgl;
window.loadPositions = loadPositions;
window.createTree = createTree;

var pathInfo = {
    svgPath: '',
    noPath: false
};
const qs = queryState({
    graph: 'teh'
});
var stats = {
    visible: false,
    lastSearchTook: 0,
    pathLength: 0,
    graphNodeCount: '',
    graphLinksCount: ''
};
let pathFinder; // currently selected pathfinder
let pendingQueryStringUpdate = 0;
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
    initPathfinders(graph);
    bbox = loaded.graphBBox;
    createScene();
})



var scene = null;

function createScene() {
    ensurePreviousSceneDestroyed();

    let canvas = document.getElementById("my_canvas");
    loaded = true;

    scene = wgl.scene(canvas);
    scene.setPixelRatio(2);
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
    scene.on('click', handleSceneClick, this);

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
        console.log(touchId);
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

function setRoutePointFormEvent(e, routePointViewModel) {
    if (!hetTestTree) return; // we are not initialized yet.

    let point = findNearestPoint(e.sceneX, e.sceneY)
    if (!point) throw new Error('Point should be defined at this moment');

    routePointViewModel.setFrom(point);
}

function updateRoute() {
    if (!(routeStart.visible && routeEnd.visible)) {
        pathInfo.svgPath = '';
        return;
    }

    let fromId = routeStart.pointId;
    let toId = routeEnd.pointId;
    updateQueryString();

    let start = window.performance.now();
    let path = findPath(fromId, toId);
    let end = window.performance.now() - start;

    pathInfo.noPath = path.length === 0;
    pathInfo.svgPath = getSvgPath(path);

    stats.lastSearchTook = (Math.round(end * 100) / 100) + 'ms';
    stats.pathLength = getPathLength(path);
    stats.visible = true;
}

function updateQueryString() {
    if (pendingQueryStringUpdate) {
        // iOS doesn't like when we update query string too often.
        // need to throttle
        clearTimeout(pendingQueryStringUpdate);
        pendingQueryStringUpdate = 0;
    }

    pendingQueryStringUpdate = setTimeout(() => {
        pendingQueryStringUpdate = 0;
        if (!(routeStart.visible && routeEnd.visible)) return;

        let fromId = routeStart.pointId;
        let toId = routeEnd.pointId;
        if (qs.get('fromId') != fromId) {
            qs.set('fromId', fromId)
        }
        if (qs.get('toId') !== toId) {
            qs.set('toId', toId);
        }
    }, 400);
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

function pointDistance(src, x, y) {
    let dx = src.x - x;
    let dy = src.y - y;
    return Math.sqrt(dx * dx + dy * dy);
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

function handleSceneClick(e) {
    if (!routeStart.visible) {
        setRoutePointFormEvent(e, routeStart);
    } else if (!routeEnd.visible) {
        setRoutePointFormEvent(e, routeEnd);
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

function findPath(fromId, toId) {
    return pathFinder.find(fromId, toId).map(l => l.data);
}

function getPathLength(path) {
    let totalLength = 0;
    for (let i = 1; i < path.length; ++i) {
        totalLength += dataDistance(path[i - 1], path[i]);
    }
    return numberWithCommas(Math.round(totalLength));
}

function distance(a, b) {
    return dataDistance(a.data, b.data);
}

function dataDistance(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy)
}

function initPathfinders(graph) {
    pathFindersLookup = {
        'a-greedy-star': npath.aGreedy(graph, {
            distance: distance,
            heuristic: distance
        }),
        'nba': npath.nba(graph, {
            distance: distance,
            heuristic: distance
        }),
        'astar-uni': npath.aStar(graph, {
            distance: distance,
            heuristic: distance
        }),
        'dijkstra': npath.aStar(graph, {
            distance: distance
        }),
    }

    setCurrentPathFinder()
    setCurrentSearchFromQueryState();
}

function setCurrentPathFinder() {
    let pathFinderName = "nba";
    pathFinder = pathFindersLookup[pathFinderName];
    if (!pathFinder) {
        throw new Error('Cannot find pathfinder ' + pathFinderName);
    }
}

function setCurrentSearchFromQueryState() {
    if (!graph) return;

    let fromId = qs.get('fromId');
    let toId = qs.get('toId');
    let from = graph.getNode(fromId)
    let to = graph.getNode(toId)
    if (from) routeStart.setFrom(from)
    if (to) routeEnd.setFrom(to)
}

function getSvgPath(points) {
    if (points.length < 1) return '';

    return points.map((pt, index) => {
        let prefix = (index === 0) ? 'M' : ''
        return prefix + toPoint(pt);
    }).join(' ');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toPoint(p) { return p.x + ',' + p.y }
// getRouteHandleUnderCursor,updateSVGElements