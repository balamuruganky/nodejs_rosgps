$( document ).ready(function() {
    _mapInit();

	$(window).bind('orientationchange', function (event) {
	    location.reload(true);
	});

    $(document).click(function (event) {
        var click = $(event.target);
        var _open = $(".navbar-collapse").hasClass("show");
        if (_open === true && !click.hasClass("navbar-toggler")) {
            $(".navbar-toggler").click();
        }
    });
});

var _mapInit = function() {
	var oRosConnect = new RosConnection({
		$serverUri  : Global.ip_address,
		$serverPort : "9090",
		$reconnectInterval : 10
	});

    if (oRosConnect != null) {
        var _connectCallbackFn = function() { 
			console.log("GPS connected");
			var oJoyStickTwist = new JoyStickTwist({
				$rosObj         : oRosConnect,
				$color			: '#2F4F4F',
				$msgTopicName   : "/cmd_vel"
			});
			oJoyStickTwist.createJoystick();

			var oOsmMap = new OsmMap({
		    	$rosObj         : oRosConnect,
		    	$container      : 'map'
		    });
		    //console.log(oOsmMap);
		    if (oOsmMap != null)
    			setInterval(oOsmMap.getLocation, 100);
        };
        var _disconnectCallbackFn = function() { 
          console.log("GPS disconnected");
        };
        oRosConnect.registerRosConnectedCallbackFn(_connectCallbackFn);
        oRosConnect.registerRosDisconnectedCallbackFn(_disconnectCallbackFn);
    }
};