function makeCircle(x, y, points, carHandler) {
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
module.exports = makeCircle;