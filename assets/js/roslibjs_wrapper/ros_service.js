/* 
Copyright (C) 2020 by Balamurugan Kandan

Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without l> imitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following 
conditions:

The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/

(function($, _, RosConnection) {
  return RosService = function(config) {
    var _params = {
  	  $rosConn     : null, /* RosConnection object (object) */
  	  $name        : null, /* ros service object (string) */
  	  $serviceType : null, /* ros service type (string) */
      $request     : null, /* ros service request (json string) */
      $response    : null  /* ros respose callback function (function) */
    };
    var $ros = null;
    var $service = null;

    var _init = function() {
      $.extend(_params, config);
      $ros = _params.$rosConn;
      _createService();
    };

    var _createService = function() {
      console.log($ros);
      if (($ros != null) && $ros.isConnected()) {
	    $topic = new ROSLIB.Service({
  			ros: $ros.getRos(),
  			name: _params.$name,

		  });
      } else {
      	console.log("ROS connection failure!!!");
      }
    };

    var _call = function() {
      if(typeof _params.$response === 'function') {
        var ros_request = new ROSLIB.Message(_params.$request);
      	($ros.isConnected()) ? $topic.callService(ros_request, _params.$response) : console.log("call failed");
      } else {
        console.log("Please provice request and response functions");
      }
    };

    // Get ROS object
    var _get$service = function() {
      return $service;
    };

    _init();

    this.get$Service = _get$service;
    this.call = _call;
  };
})(jQuery, _, RosConnection);
