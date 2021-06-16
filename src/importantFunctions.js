const SVGContainer = require("./createScene/SVGContainer");
const wgl = require("w-gl");
const queryState = require("query-state");
const qs = queryState({
    graph: 'amsterdam-roads'
});






function initHitTestTree(loadedPoints) {
    hetTestTree = createTree();
    hetTestTree.initAsync(loadedPoints, {
        progress(i, total) {
            if (i % 500 !== 0) return;

            api.progress.message = 'Initializing tree for point & click'
            api.progress.completed = Math.round(100 * i / total) + '%';
        },
        done() {
            api.progress.treeReady = true;
        }
    });
}

function findNearestPoint(x, y, graph, maxDistanceToExplore = 2000) {
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
        return findNearestPoint(x, y, graph, maxDistanceToExplore * 2);
    }
}

function pointDistance(src, x, y) {
    let dx = src.x - x;
    let dy = src.y - y;
    return Math.sqrt(dx * dx + dy * dy);
}

function updateSVGElements(svgConntainer) {
    let strokeWidth = 6 / svgConntainer.scale;
    this.$refs.foundPath.setAttributeNS(null, 'stroke-width', strokeWidth + 'px');
    this.scale = svgConntainer.scale / this.scene.getPixelRatio();
}

function getSvgPath(points) {
    if (points.length < 1) return '';

    return points.map((pt, index) => {
        let prefix = (index === 0) ? 'M' : ''
        return prefix + toPoint(pt);
    }).join(' ');
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

function updateGraph() {
    ensurePreviousSceneDestroyed();
    setTimeout(() => {
        updateSelectedGraph();
    }, 0);
}

function clearRoute() {
    /*
    let routeStart = new RouteHandleViewModel(updateRoute, findNearestPoint);
    let routeEnd = new RouteHandleViewModel(updateRoute, findNearestPoint);
    */
    routeStart.clear();
    routeEnd.clear();
    qs.set({
        fromId: -1,
        toId: -1
    });
}

function updateSelectedGraph() {
    qs.set({
        graph: settings.graphSettings.selected,
        fromId: -1,
        toId: -1
    });

    loadPositions();
    clearRoute();
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

function getGraphBBox() {
    return graphBBox;
}

// IMPORTANT ----------------------------------------

function createScene() {
    ensurePreviousSceneDestroyed();

    let canvas = this.$refs.canvas;
    loaded = true;

    scene = wgl.scene(canvas);
    // this.scene.setPixelRatio(2);
    let svgConntainer = new SVGContainer(this.$refs.svg.querySelector('.scene'), updateSVGElements.bind(this));
    scene.appendChild(svgConntainer)
    scene.setClearColor(12 / 255, 41 / 255, 82 / 255, 1)
        //scene.setClearColor(1, 1, 1, 1)

    let bbox = getGraphBBox();
    let initialSceneSize = bbox.width / 8;
    scene.setViewBox({
        left: -initialSceneSize,
        top: -initialSceneSize,
        right: initialSceneSize,
        bottom: initialSceneSize,
    })

    let graph = getGraph();

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
//---------------------------------------------------

function handleMouseDown(e) {
    var s;
    var touchId = undefined;
    if (e.touches) {
        let mainTouch = (e.changedTouches || e.touches)[0];
        s = this.scene.getSceneCoordinate(mainTouch.clientX, mainTouch.clientY);
        touchId = mainTouch.identifier;
    } else {
        s = this.scene.getSceneCoordinate(e.clientX, e.clientY);
    }

    let handleUnderCursor = api.getRouteHandleUnderCursor({
        sceneX: s.x,
        sceneY: s.y
    }, this.scene);
    if (handleUnderCursor) {
        e.stopPropagation()
        e.preventDefault()
        handleUnderCursor.startDragging(this.scene, touchId);
        return;
    }
}