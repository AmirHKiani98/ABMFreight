const RouteHandleViewModel = require('./RouteHandleViewModel');
const wgl = require("w-gl")

function onMouseMoveOverScene(e) {
    let now = new Date();
    let handle = api.getRouteHandleUnderCursor(e, this.scene);
    if (handle !== this.prevHandle) {
        this.$refs.canvas.style.cursor = handle ? 'pointer' : ''
        this.prevHandle = handle;
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
// let routeStart = new RouteHandleViewModel(updateRoute, findNearestPoint);
// let routeEnd = new RouteHandleViewModel(updateRoute, findNearestPoint);
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


function createScene() {
    this.ensurePreviousSceneDestroyed();

    let canvas = this.$refs.canvas;
    this.loaded = true;

    this.scene = wgl.scene(canvas);
    // this.scene.setPixelRatio(2);
    let scene = this.scene;
    let svgConntainer = new SVGContainer(this.$refs.svg.querySelector('.scene'), this.updateSVGElements.bind(this));
    this.scene.appendChild(svgConntainer)
    scene.setClearColor(12 / 255, 41 / 255, 82 / 255, 1)
        //scene.setClearColor(1, 1, 1, 1)

    let bbox = api.getGraphBBox();
    let initialSceneSize = bbox.width / 8;
    scene.setViewBox({
        left: -initialSceneSize,
        top: -initialSceneSize,
        right: initialSceneSize,
        bottom: initialSceneSize,
    })

    let graph = api.getGraph();

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

    scene.on('mousemove', this.onMouseMoveOverScene, this);
    scene.on('click', this.onSceneClick, this);

    let boundMouseDown = this.handleMouseDown.bind(this);
    document.body.addEventListener('mousedown', boundMouseDown, true);
    document.body.addEventListener('touchstart', boundMouseDown, true);

    this.unsubscribeMoveEvents = function() {
        document.body.removeEventListener('mousedown', boundMouseDown, true);
        document.body.removeEventListener('touchstart', boundMouseDown, true);
    }
}

function ensurePreviousSceneDestroyed() {
    if (this.scene) {
        this.scene.dispose();
        this.scene = null;
    }
    if (this.unsubscribeMoveEvents) {
        this.unsubscribeMoveEvents();
        this.unsubscribeMoveEvents = null;
    }
}

function mainCreateGraph(loaded) {
    let canvas = document.getElementById("canvas");

    let scene = wgl.scene(canvas);
}