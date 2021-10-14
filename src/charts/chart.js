class ChartAK {
  constructor(
    name,
    location,
    id,
    color = "rgb(255, 99, 132)",
    intervalTime = 0.1
  ) {
    this.name = name;
    this.location = location;

    this.data = {
      datasets: [
        {
          label: name,
          backgroundColor: color,
          borderColor: color,
          labels: [],
          data: [],
          pointRadius: 5,
          pointHoverRadius: 5,
          fill: false,
          tension: 0,
          showLine: true,
          yAxisID: "y1",
        },
      ],
    };
    this.config = {
      type: "scatter",
      responsive:true,
     maintainAspectRatio: false,
      data: this.data,
      options: {
        scales: {
          y1: {
            display: true,
          },
        },
      },
    };

    // Creating Canvas
    var canv = document.createElement("canvas");
    canv.id = id;
    // canv.style.width ='100%';
    // canv.style.height='100%';
    $("#canvas-container").append(canv);
    var ctx = document.getElementById(id).getContext("2d"); // 2d context
    this.chart = new Chart(ctx, this.config);
    this.intervalTime = intervalTime;
    canv.className = "disp_none";

  }

  triggerFunction(func) {
    this.trgFunction = func;
  }

  updateWithFunction() {
    let values = this.trgFunction();
    let x = values[0];
    let y = values[1];
    this.addData(x, y);
  }

  updateWithoutFunction(x, y) {
    this.addData(x, y);
  }

  addData(label, data) {
    this.chart.data.labels.push(label);
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    this.chart.update("none");
  }
}

module.exports = ChartAK;
