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