# ROS GPS Differential Drive Web Application

This application helps to interact with GPS differential drive robot through ROS bridge (http://wiki.ros.org/rosbridge_suite). 
The robot should publish and subscribe the below listed topics
  * /gps/fix (Publish from GPS sensor)
  * /cmd_vel (Subscribe to Motor controller connected to wheels)
 
# How To Start The Nodejs Application

Please change the IP address of the robot in _mapInit function available in map_init.js file before start the application.

  * Install dependencies: `npm install`.
  * Start server `npm start 3000`.

# How to launch the ROS Bridge

Websocket must be started in robot using the below mentioned command in ROS. This will start the websocket in port number 9090.

  * roslaunch rosbridge_server rosbridge_websocket.launch
  
# Usage

Tha web application can be opened using http://<ip_address>:3000. 
  * Software joystick available bottom right can be used to drive the robot.
  * Robot movement shown by the marker.
