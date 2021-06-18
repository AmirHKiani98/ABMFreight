class CarHandler {
    constructor() {
        this.cars = [];
        this.lastCarId = 0;
    }
    addCar(data) {
        let newCar = { id: this.getNewId(), lastPositionIndex: 0, lastPosition: data[0], currentPosition: null, currentFormula: null, data: data };
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
    getEquation(x0, y0, x1, y1) {
        let a = (y1 - y0) / (x1 - x0)
        let b = y0 - (a) * x0;

        function getFormula(x) {
            return a;
        }
        return getFormula;
    }
}
// module.exports = carHandler;

let carHandler = new CarHandler();
console.log(carHandler.getEquation(5, 3, 1, 2)(5));