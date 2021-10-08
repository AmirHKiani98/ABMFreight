class Car {
    constructor(id, startPosition, stopPosition, currentPosition, currentFormula, data, startPositionIndex = 0, fuelConsumption = 50, currentFuel = 50, velocity = 20) {
        this.fuelConsumption = fuelConsumption;
        this.fuelCapacity = 50;
        this.currentFuel = currentFuel;
        this.id = id;
        this.startPosition = startPosition;
        this.stopPosition = stopPosition;
        this.currentFormula = currentFormula;
        this.data = data;
        this.startPositionIndex = startPositionIndex;
        this.currentPosition = currentPosition;
        this.velocity = velocity;
    }

    getRemailFuel() {

    }

    addFuel(fuelToAdd) {
        this.currentFuel += addFuel;
        if (this.currentFuel > this.fuelCapacity) {
            this.currentFuel = this.fuelCapacity;
        }
    }
    useFuel(fuelToSubstract) {
        this.currentFuel -= fuelTosubstract;
    }
}
module.exports = Car;