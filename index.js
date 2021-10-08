$("#close-open").click((e)=>{
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
})