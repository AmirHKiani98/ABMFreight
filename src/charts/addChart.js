const ChartAK = require("./chart");
const ChartsContainer = require("./chartsContainer");

function addChart(name, chartIconPath, location, id){
    let chart = new ChartAK(name, location, id);
    ChartsContainer.charts.push(chart);
    return chart;
}
module.exports = addChart;