 $( "#color-container" ).draggable({
  handle: "div#handle",
  containment: "window"
});

 $("#boardToggle").click(function(){
 	var v = ($("#toolbar").css("visibility") == "visible") 	
 	if(v) $("#toolbar").css("visibility", "hidden");
 	else $("#toolbar").css("visibility", "visible");	
 });