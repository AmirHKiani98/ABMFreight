$("#close-open").click((e) => {
  let width = $("#right-part").css("width");
  switch (width) {
    case "0px":
      $("#right-part").css("width", "30%");
      $("#close-open-icon").removeClass();
      $("#close-open-icon").addClass("fa fa-window-close");
      break;

    default:
      $("#right-part").css("width", "0");
      $("#close-open-icon").removeClass();
      $("#close-open-icon").addClass("fa fa-arrow-circle-left");
      break;
  }
});

$(".chart-icon-button").click((event) => {
  chartId = event.currentTarget.dataset.chartId;
//   console.log(chartId);
  $("#right-part").css("width", "0");
  $("#close-open-icon").removeClass();
  $("#close-open-icon").addClass("fa fa-arrow-circle-left");
  $("#canvas-container").css("height", "30%");
    $("#" + chartId).toggleClass("disp_none");
    let height = $("#canvas-container").css("height").split("px")[0];
    let width = $("#canvas-container").css("width").split("px")[0];
    console.log(parseInt(width))
    Chart.getChart(chartId).resize(300,"100%")
});
