(function(){
	$(".slides").hide();
	$("#pageNum1").show();
	
	
	var socket = io.connect(window.location.href);
	
	socket.on("changePage", function(change){
		$(".slides").hide(1000);
		$("#pageNum"+change).show(1000);
	});
	
}());