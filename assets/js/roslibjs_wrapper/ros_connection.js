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

(function($, _) {
  return RosConnection = function(config) {
    var _params = {
        $serverUri         : "localhost", /* ROS server IP or Host name (string) */
        $serverPort        : "9090",      /* ROS bridge websocket port number (string) */
        $isSecured         : false,       /* Whether websocket secure. if secure 'wss:' is created. (boolean) */
        $reconnectInterval : 1000         /* Reconnect interval. If 0 or negative, reconnect is disabled (number) */
    };
    var $ros = null;
    var $connectedCallbackFn = null;
    var $disconnectedCallbackFn = null;
    var $connected = false;
    var connect_scheduled = false;
    var rosWsUrl = null;
    var $nodesList = null;

    var _onFail = function() {
      if($connected) {
        // trigger disconnected event
        if((typeof disconnectedCallbackFn === 'function'))
          disconnectedCallbackFn();
      }
      $connected = false;

      connect_scheduled = (_params.$reconnectInterval <= 0) ? false : true;

      if (connect_scheduled) {
        setTimeout(_rosReconnect(), _params.$reconnectInterval);
      }
    };

    var _onSuccess = function() {
      if(!$connected) {
        $connected = true;
        // trigger connected event
        if((typeof connectedCallbackFn === 'function')) {
          connectedCallbackFn();
        }
      }
    };

    var _createRos = function(rosWsUrl) {
      return (new ROSLIB.Ros({
        url : rosWsUrl
      }));
    };

    var _init = function() {
      $.extend(_params, config);
      if (_params.$isSecured)
        rosWsUrl = 'wss://';
      else
        rosWsUrl = 'ws://';

      rosWsUrl += _params.$serverUri + ':' + _params.$serverPort;

      $ros = _createRos(rosWsUrl);

      $ros.on('connection', function() {
        console.log('Connected to websocket server.');
        _onSuccess();
      });
      $ros.on('error', function(error) {
        console.log('Error connecting to websocket server: ', error);
        _onFail();
      });
      $ros.on('close', function() {
        console.log("Connection closed.");
        _onFail();
      });
    };

    var _isConnected = function() {
      return $connected;
    };

    var _registerRosConnectedCallbackFn = function(callback) {
      if((typeof callback === 'function')) {
        connectedCallbackFn = callback;
      }
    };

    var _registerRosDisconnectedCallbackFn = function(callback) {
      if((typeof callback === 'function')) {
        disconnectedCallbackFn = callback;
      }
    };

    var _rosReconnect = function() {
      $ros.connect(rosWsUrl);
    };

    // Get topics list
    var _getTopicsList = function(callback) {
      if((typeof callback === 'function')) {
        $ros.getTopics(callback);
      }
    };

    // Get nodes list
    var _getNodesList = function(callback) {
      if((typeof callback === 'function')) {
        $ros.getNodes(callback);
      }
    };

    // Get params list
    var _getParamsList = function(callback) {
      if((typeof callback === 'function')) {
        $ros.getParams(callback);
      }
    };

    var _getServicesList = function(callback) {
      if((typeof callback === 'function')) {
        $ros.getServices(callback);
      }
    };

    // Get ROS object
    var _getRos = function() {
      return $ros;
    };

    _init();

    this.getRos = _getRos;
    this.isConnected = _isConnected;
    this.getTopicsList = _getTopicsList;
    this.getNodesList  = _getNodesList;
    this.getParamsList = _getParamsList;
    this.getServicesList = _getServicesList;
    this.registerRosConnectedCallbackFn = _registerRosConnectedCallbackFn;
    this.registerRosDisconnectedCallbackFn = _registerRosDisconnectedCallbackFn;
  };
})(jQuery, _);
