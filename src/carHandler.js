const Car = require("./car");
class CarHandler {
    constructor(projector) {
        this.cars = [];
        this.lastCarId = 0;
        this.lastTime = Date.now();
        this.projector = projector;
    }
    addCar(data, fuelConsumption = 50, currentFuel = 50, velocity = 0.1) {
        // let newCar = { id: this.getNewId(), startPositionIndex: 0, startPosition: data[0], stopPosition: data[1], currentPosition: data[0], currentFormula: this.updateEquation(data[0], data[1], data[0], this.v), data: data };
        let newCar = new Car(this.getNewId(), data[0], data[1], data[0], this.updateEquation(data[0], data[1], data[0], velocity), data, 0, fuelConsumption, currentFuel, velocity);
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
        var signInX = x1 - x0;
        if (signInX > 0) {
            signInX = +1;
        } else if (signInX < 0) {
            signInX = -1;
        }
        if (x1 - x0 == 0) {
            var xInit = 0;
        } else {
            var xInit = signInX * v / (((((y1 - y0) / (x1 - x0)) ** 2) + 1) ** 0.5);
        }

        var signInY = y1 - y0;
        if (signInY > 0) {
            signInY = +1;
        } else if (signInY < 0) {
            signInY = -1;
        }

        if (y1 - y0 == 0) {
            var yInit = 0;
        } else {
            var yInit = signInY * v / (((((x1 - x0) / (y1 - y0)) ** 2) + 1) ** 0.5);
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
        var checkDistance = ((currentPosition.x - startPosition.x) ** 2 + (currentPosition.y - startPosition.y) ** 2) ** 0.5;
        if (checkDistance > distance) {
            return true;
        } else {
            return false;
        }
    }
    updateCarStartStopPosition(carId) {
        for (let i = 0; i < this.cars.length; i++) {
            var car = this.cars[i];
            if (car.id == carId) {
                if (this.cars[i].startPositionIndex !== this.cars[i].data.length - 2) {
                    this.cars[i].startPositionIndex += 1;
                    this.cars[i].startPosition = car.data[this.cars[i].startPositionIndex];
                    this.cars[i].stopPosition = car.data[this.cars[i].startPositionIndex + 1];
                    let velocity = this.cars[i].velocity;
                    this.cars[i].currentFormula = this.updateEquation(this.cars[i].startPosition, this.cars[i].stopPosition, this.cars[i].startPosition, velocity);
                    break;
                } else {}
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