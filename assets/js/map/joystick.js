(function($, _, RosTopic, Global) {
  return JoyStickTwist = function(config) {
    var _params = {
        $rosObj         : null,
        $container      : 'joystick',
        $size           : 120,
        $color          : "yellow",
        $maxAngular     : 1.0,
        $maxLinear      : 1.0,
        $maxDistance    : 75.0, 
        $msgTopicName   : "/cmd_vel"
    };
    var _oPublishTopic = null;

    var _init = function() {
      $.extend(_params, config);

      _oPublishTopic = new RosTopic({
        $rosConn: _params.$rosObj,
        $name: _params.$msgTopicName,
        $messageType: 'geometry_msgs/Twist'
      });

      _createJoystick();
    };

    var _move = function (linear, angular) {
      var twist = {
        linear: {
          x: linear,
          y: 0.0,
          z: 0.0
        },
        angular: {
          x: 0.0,
          y: 0.0,
          z: angular
        }
      };
      console.log(linear + " " + angular);
      _oPublishTopic.publishMsg(twist);
    };

    var _createJoystick = function () {
      var options = {
        zone: document.getElementById(_params.$container),
        threshold: 0.1,
        position: { right: 50 + '%' },
        mode: 'static',
        size: _params.$size,
        color: _params.$color,
      };
      manager = nipplejs.create(options);

      var linear_speed = 0;
      var angular_speed = 0;

      manager.on('start', function (event, nipple) {
        timer = setInterval(function () {
          _move(linear_speed, angular_speed);
        }, 25);
      });

      manager.on('move', function (event, nipple) {
        max_linear = _params.$maxLinear; // 5.0  m/s
        max_angular = _params.$maxAngular; // rad/s
        max_distance = _params.$maxDistance; //75.0; // pixels;
        linear_speed = Math.sin(nipple.angle.radian) * max_linear * nipple.distance/max_distance;
        angular_speed = -Math.cos(nipple.angle.radian) * max_angular * nipple.distance/max_distance;
      });

      manager.on('end', function () {
        if (timer) {
          clearInterval(timer);
        }
        linear_speed = 0;
        angular_speed = 0;
        _move(linear_speed, angular_speed);
      });
    };

    // Get Joystick object
    var _get$Joystick = function() {
      return $ros;
    };

    _init();

    this.get$Joystick = _get$Joystick;
    this.createJoystick = _createJoystick;
  };
})(jQuery, _, RosTopic, Global);
