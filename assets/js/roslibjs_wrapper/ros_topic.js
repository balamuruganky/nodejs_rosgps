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
  return RosTopic = function(config) {
    var _params = {
	  $rosConn  	: null, /* RosConnection object (object) */
	  $name   		: null, /* ros topic name (string) */
	  $messageType 	: null  /* ros topic message type (string) */
    };
    var $ros = null;
    var $topic = null;

    var _init = function() {
      $.extend(_params, config);
      $ros = _params.$rosConn;
      _createTopic();
    };

    var _createTopic = function() {
      if (($ros != null) && $ros.isConnected()) {
  	    $topic = new ROSLIB.Topic({
    			ros: $ros.getRos(),
    			name: _params.$name,
    			messageType: _params.$messageType
  		  });
      } else {
      	console.log("ROS connection failure!!!");
      }
    };

    var _subscribe = function(callback) {
      if((typeof callback === 'function')) {
      	($ros.isConnected()) ? $topic.subscribe(callback) : console.log("subscribe failed");
      }
    };

    var _unsubscribe = function() {
      ($ros.isConnected()) ? $topic.unsubscribe() : console.log("unsubscribe failed");
    };

    var _publishMsg = function(message) {
      var ros_message = new ROSLIB.Message(message);
      ($ros.isConnected()) ? $topic.publish(ros_message) : console.log("publish failed");
    };

    var _get$Topic = function() {
      return $topic;
    };

    _init();

    this.get$Topic = _get$Topic;
    this.subscribe = _subscribe;
    this.unsubscribe = _unsubscribe;
    this.publishMsg = _publishMsg;
  };
})(jQuery, _, RosConnection);
