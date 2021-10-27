const loadPositions = require("./loadGraph");
const wgl = require("w-gl");
const request = require("./request");
const readFile = require("./readFile");
const createTree = require('yaqt');
const makeScene = require("./createScene/createScene");
const SVGContainer = require("./createScene/SVGContainer");
const inverseProjector = require("./createInverseProjector");
const CarHandler = require("./carHandler");

// const npath = require('ngraph.path');
const path = require("ngraph.path");
const queryState = require('query-state');
const pointToMapProjector = require("./pointToMapCoordinates");
const RouteHandleViewModel = require("./createScene/RouteHandleViewModel");
const ChartsContainer = require("./charts/chartsContainer");
const addChart = require("./charts/addChart");
mainChart = addChart("newName", "icon", "up", "newId");
l = 0;
$("body").click((event)=>{
    l++;
    y = l**2;
    mainChart.updateWithoutFunction(l,y);
});

svgConntainerWays = null;
startNodeCheck = false;
stopNodeCheck = false;
startNodeCoord = null;
stopNodeCoord = null;
window.path = path;
window.wgl = wgl;
window.loadPositions = loadPositions;
window.createTree = createTree;


var time = new Date();
var carHandler = new CarHandler(0.1);
var prevHandle = null;
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
var mainProj = null;
var inverseProj = null;



var tehran = loadPositions("maps/teh");
var projector = null;
tehran.then((loaded) => {
    initHitTestTree(loaded.points);
    graph = loaded.graph;
    // console.log(graph);
    initPathfinders(graph);
    bbox = loaded.graphBBox;
    createScene();
    inverseProjector("./maps/teh.bond.json").then((projector) => {
        inverseProj = projector;
    });
    pointToMapProjector("./maps/teh.bond.json").then((projector) => {
        mainProj = projector;
    });

});



var scene = null;

function createScene() {
    ensurePreviousSceneDestroyed();

    let canvas = document.getElementById("my_canvas");
    loaded = true;

    scene = wgl.scene(canvas);
    scene.setPixelRatio(2);
    svgConntainerWays = new SVGContainer(document.getElementsByTagName("svg")[0].querySelector('.scene'), updateSVGElements);
    scene.appendChild(svgConntainerWays);
    scene.setClearColor(16 / 255, 16 / 255, 16 / 255, 1);
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
    lines.color = { r: 71 / 255, g: 71 / 255, b: 71 / 255, a: 0.7 }
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
    } else {
        s = scene.getSceneCoordinate(e.clientX, e.clientY);
    }
    let handleUnderCursor = getRouteHandleUnderCursor({
        sceneX: s.x,
        sceneY: s.y
    }, scene);

    a = inverseProj(s.x, s.y);
    setNode(findNearestPoint(s.x, s.y));
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
    if (handle !== prevHandle) {
        prevHandle = handle;
    }
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
    document.getElementById("my_path").setAttribute("d", pathInfo.svgPath);
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
    // console.log(hetTestTree.pointsAround(x, y, maxDistanceToExplore));
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
        return routeEnd
    }
}


function updateSVGElements(svgConntainer) {
    let strokeWidth = 6 / svgConntainer.scale;
    document.getElementById("my_path").setAttributeNS(null, 'stroke-width', strokeWidth + 'px');
    scale = svgConntainer.scale / scene.getPixelRatio();
    updatePathsStrokes();
}

function updatePathsStrokes() {
    var allPaths = document.getElementsByClassName("car_path");
    var strokeWidth = 6 / svgConntainerWays.scale;
    for (let i = 0; i < allPaths.length; i++) {
        const element = allPaths[i];
        element.setAttributeNS(null, "stroke-width", strokeWidth + "px");
    }
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
        'a-greedy-star': path.aGreedy(graph, {
            distance: distance,
            heuristic: distance
        }),
        'nba': path.nba(graph, {
            distance: distance,
            heuristic: distance
        }),
        'astar-uni': path.aStar(graph, {
            distance: distance,
            heuristic: distance
        }),
        'dijkstra': path.aStar(graph, {
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
    let from = graph.getNode(fromId);
    let to = graph.getNode(toId);
    if (from) routeStart.setFrom(from);
    if (to) routeEnd.setFrom(to);
}

function getSvgPath(points) {
    if (points.length < 1) return '';


    return points.map((pt, index) => {
        let prefix = (index === 0) ? 'M' : '';
        if (index == 0) {
            makeCircle(pt.x, pt.y, points);
        }

        return prefix + toPoint(pt);
    }).join(' ');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function checkCar() {
    miliSecondsTime = Date.now();
    carHandler.cars.forEach(element => {
        check = carHandler.checkPassTheStopPoint(element.startPosition, element.stopPosition, element.currentPosition);
        if (check) {
            carHandler.updateCarStartStopPosition(element.id);
        } else {
            getFunction = element.currentFormula;
            newPosition = getFunction(miliSecondsTime);
            circle = document.getElementById("circle_" + element.id);
            carHandler.updateSVG(circle, newPosition);
            element.currentPosition = newPosition;
        }
    });
    carHandler.updateTime(miliSecondsTime);
    window.requestAnimationFrame(checkCar);
}

window.requestAnimationFrame(checkCar);

function makeCircle(x, y, points) {
    g = document.getElementById("my_g");
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 40);
    circle.setAttribute("stroke", "green");
    circle.setAttribute("stroke-width", "4");
    circle.setAttribute("fill", "yellow");
    carHandler.addCar(points);
    lastCarId = carHandler.getLastCarId();
    circle.setAttribute("id", "circle_" + lastCarId);
    g.appendChild(circle);
}

function makeWay(fromId, toId) {
    let path = findPath(fromId, toId);
    let svgPath = getSvgPath(path);
    let pathSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathSvgElement.setAttribute("d", svgPath);
    pathSvgElement.setAttribute("stroke", "blue");
    pathSvgElement.setAttribute("fill", "transparent");
    strokeWidth = 6 / svgConntainerWays.scale;
    pathSvgElement.setAttributeNS(null, 'stroke-width', strokeWidth + 'px');
    pathSvgElement.setAttribute("class", "car_path");
    // ToDo - Change here if you dont want to paint circle (car) or something else happend!

    g = document.getElementById("my_g");
    g.insertBefore(pathSvgElement, g.lastChild);

    // document.getElementById("my_path").setAttributeNS(null, 'stroke-width', strokeWidth + 'px');
}



function startNode(e) {
    stopNodeCheck = false;
    startNodeCheck = true;
}

function stopNode(e) {
    stopNodeCheck = true;
    startNodeCheck = false;
}
// document.getElementById("start_node").addEventListener("click", startNode);
// document.getElementById("stop_node").addEventListener("click", stopNode);

function setNode(point) {
    if (stopNodeCheck == false && startNodeCheck == true && stopNodeCoord == null) {
        stopNodeCoord = point.id;
    } else if (startNodeCheck == false && stopNodeCheck == true && startNodeCoord == null) {
        startNodeCoord = point.id;
    }
    if (startNodeCoord !== null && stopNodeCoord !== null) {
        makeWay(startNodeCoord, stopNodeCoord);
        startNodeCoord = null;
        stopNodeCoord = null;
        stopNodeCheck = false;
        startNodeCheck = false;
    }
}



function toPoint(p) { return p.x + ',' + p.y }
// getRouteHandleUnderCursor,updateSVGElements