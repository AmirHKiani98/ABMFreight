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