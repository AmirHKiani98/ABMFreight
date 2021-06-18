class CarHandler {
    constructor(v) {
        this.cars = [];
        this.lastCarId = 0;
        this.v;
        this.lastTime = Date.now();
    }
    addCar(data) {
        let newCar = { id: this.getNewId(), startPositionIndex: 0, startPosition: data[0], stopPosition: data[1], currentPosition: data[0], currentFormula: this.updateEquation(data[0], data[1], data[0], this.v), data: data };
        this.cars.push(newCar);
    }
    removeCar(carId) {
        var index = 0;
        for (let i = 0; i < this.cars.length; i++) {
            let element = this.casr[i];
            if (element.id == carId) {
                break;
            };
            index++;
        };
        this.cars.splice(index, 1);
    }
    moveCar(dx, dy) {

    }
    getNewId() {
        this.lastCarId = this.cars.length + 1;
        return this.lastCarId;
    }
    getLastCarId() {
        return this.lastCarId;
    }
    getNextStop(formula, v) {

    }
    updateEquation(startPosition, stopPosition, currentPosition, v) {
        var x0 = startPosition.x;
        var y0 = startPosition.y;
        var x1 = stopPosition.x;
        var y1 = stopPosition.y;
        var lastTime = this.lastTime;
        var currentX = currentPosition.x;
        var currentY = currentPosition.y;
        if (x1 - x0 == 0) {
            var xInit = 0;
        } else {
            var xInit = v / (((((y1 - y0) / (x1 - x0)) ** 2) + 1) ** 0.5);
        }
        if (y1 - y0 == 0) {
            var yInit = 0;
        } else {
            var yInit = v / (((((x1 - x0) / (y1 - y0)) ** 2) + 1) ** 0.5);
        }

        function getFormula(time) {
            return {
                x: (currentX + xInit * (time - lastTime)),
                y: (currentY + yInit * (time - lastTime))
            }
        }
        return getFormula;
    }
    checkPassTheStopPoint(startPosition, stopPosition, currentPosition) {
        var distance = ((startPosition.x - stopPosition.x) ** 2 + (startPosition.y - stopPosition.y) ** 2) ** 0.5;
        var checkDistance = ((currentPosition.x - stopPosition.x) ** 2 + (currentPosition.y - stopPosition.y) ** 2) ** 0.5;
        if (checkDistance > distance) {
            return true;
        } else {
            return false;
        }
    }
    updateCarStartStopPosition(carId) {
        for (let i = 0; i < this.cars.length; i++) {
            car = this.cars[i];
            if (car.id == carId) {
                this.cars[i].startPositionIndex += 1;
                if (this.cars[i].startPositionIndex !== this.cars[i].data.length) {
                    this.cars[i].startPosition = car.data[this.cars[i].startPositionIndex];
                    this.cars[i].stopPosition = car.data[this.cars[i].startPositionIndex + 1];
                    this.cars[i].currentFormula = this.updateEquation(this.cars[i].startPosition, this.cars[i].stopPosition, this.cars[i].currentPosition, this.v);
                    break;
                }
            }
        }
    }
    updateSVG(circle, newPosition) {
        circle.setAttribute("cx", newPosition.x);
        circle.setAttribute("cy", newPosition.y);
    }
    updateTime(time) {
        if (!time) {
            this.lastTime = Date.now();
            return;
        } else {
            this.lastTime = time;
        }
    }
}
module.exports = CarHandler;
// check = new CarHandler(10);
// console.log(check.updateEquation({ x: 10, y: 20 }, { x: 12, y: 22 }, { x: 11, y: 21 }, 10)(new Date().getTime() + 0.01));