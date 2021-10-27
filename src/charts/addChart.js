const ChartAK = require("./chart");
const ChartsContainer = require("./chartsContainer");

function addChart(name, chartIconPath, location, id){
    let chart = new ChartAK(name, location, id);
    let chartIcon = `<a name="" id="" class="btn btn-primary chart-icon-button" data-chart-id="${id}" href="#" style="background-image: url('${chartIconPath}');" role="button"></a>`
    document.getElementById("chart-icon-container").append(chartIcon);
    ChartsContainer.charts.push(chart);
    return chart;
}
module.exports = addChart;