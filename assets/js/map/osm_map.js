(function($, _, RosTopic, Global) {
  return OsmMap = function(config) {
    var _params = {
        $rosObj         : null,
        $container      : 'map',
        $updateRate     : 100
    };

    var $map = null;
    var $marker = null;
    var _oGpsFixTopic = null;

    var _init = function() {
    	$.extend(_params, config);
	    _oGpsFixTopic = new RosTopic({
	        $rosConn: _params.$rosObj,
	        $name: '/ublox_gps/fix',
	        $messageType: 'sensor_msgs/NavSatFix'
	    });
	    _getLocation().then(_initMap);
	};

	var _initMap = function(data) {
		_updateGpsCoords(data);
		$map = L.map(_params.$container).fitWorld();
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			minZoom: 6,
			maxZoom: 19,
			attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
		}).addTo($map);
		
		$map.setView([Global.gpsLocation.lat, Global.gpsLocation.lon], 18);
		$marker = L.marker([Global.gpsLocation.lat, Global.gpsLocation.lon]).addTo($map)
		    //.bindPopup(Global.lat + ' ' + Global.lon)
		    .openPopup();

		new L.Toolbar2.Control({
            actions: [_zoomAction]
        }).addTo($map);
	}

	var _getGPSLocation = function (data) {
    	if ($marker) {
    		$marker.setLatLng([data.latitude, data.longitude]);
    	}
	};

	var _updateGpsCoords = function(data) {
	    Global.gpsLocation.lon = data.longitude;
    	Global.gpsLocation.lat = data.latitude;
    	console.log (Global.gpsLocation.lat + "  " + Global.gpsLocation.lon);
	};

	var _getLocation = function() {
	    return new Promise(function(resolve, reject){
	        _oGpsFixTopic.subscribe(function(result){
	        	if (result != null) {
		        	_getGPSLocation(result);
		            resolve(result);
		        } else {
		        	reject({"longitude" : "0.0", "latitude" : "0.0"});
		        }
	            _oGpsFixTopic.unsubscribe();
	        })
	    });
	};

    var _get$Map = function() {
      return $map;
    };

	var _zoomAction = L.Toolbar2.Action.extend({
		options: {
		toolbarIcon: {
		    html: '<i class="fas fa-search-location"></i>',
		    tooltip: 'I am here!!!'
		}
	},

	addHooks: function () {
		$map.setView([Global.gpsLocation.lat, Global.gpsLocation.lon], 18);
	}
	});

	_init();

	this.get$Map     = _get$Map;
	this.getLocation = _getLocation;
  };
})(jQuery, _, RosTopic, Global);