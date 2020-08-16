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
  return RosParam = function(config) {
    var _params = {
  	  $rosConn  	: null, /* ros_connection object (object) */
  	  $name   		: null  /* ros param name (string) */
    };

    var $param = null;
    var $ros = null;

    var _init = function() {
      $.extend(_params, config);
      $ros = _params.$rosConn;
      _createParam();
    };

    var _createParam = function() {
      if (($ros != null) && $ros.isConnected()) {
        $param = new ROSLIB.Param({
            ros: $ros.getRos(),
            name: _params.$name
        });
      } else {
      	console.log("ROS connection failure!!!");
      }
    };

    var _get = function(callback) {
      if((typeof callback === 'function')) {
      	($ros.isConnected()) ? $param.get(callback) : console.log("get failed");
      }
    };

    var _set = function(value) {
      ($ros.isConnected()) ? $param.set(value) : console.log("set failed");
    };

    // Get ROS object
    var _get$Param = function() {
      return $param;
    };

    _init();

    this.get$Param = _get$Param;
    this.get = _get;
    this.set = _set;
  };
})(jQuery, _, RosConnection);
