function findNearestPoint(x, y, hetTestTree, maxDistanceToExplore = 2000) {
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
        return findNearestPoint(x, y, hetTestTree, maxDistanceToExplore * 2);
    }
}