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
$("#close-charts").click((e)=>{
  if($("#close-charts-icon").hasClass("fa-arrow-down")){
    $("#close-charts-icon").removeClass("fa-arrow-down");
    $("#close-charts-icon").addClass("fa-arrow-up");
  }else{
    $("#close-charts-icon").addClass("fa-arrow-down");
    $("#close-charts-icon").removeClass("fa-arrow-up");
  }
  let height = $("#canvas-container").css("height");
  $("#canvas-container").toggleClass("height-3");

  if(height == "0px"){

  }
})


$(".chart-icon-button").click((event) => {
  chartId = event.currentTarget.dataset.chartId;
  $("#right-part").css("width", "0");
  $("#close-open-icon").removeClass();
  $("#close-open-icon").addClass("fa fa-arrow-circle-left");
  $("#canvas-container").toggleClass("height-3");
  $("#" + chartId).toggleClass("disp_none");
  Chart.getChart(chartId).resize();
});
