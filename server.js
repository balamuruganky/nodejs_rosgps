"use strict";

const express = require('express'); // Express Server
const exphbs = require('express-handlebars'); // Express handlebars
const fs = require('fs'); //File System (Open/read files)
const FileStreamRotator = require('file-stream-rotator'); //Log file rotation (YYYY-MM-DD)
const path = require('path'); // Utility for working with files and paths
const cookieParser = require('cookie-parser'); // CookieParser
const bodyParser = require('body-parser'); // BodyParser
const morgan = require('morgan'); // Log requests to the console
const session = require('express-session'); // Express-session
//const redisStore = require('connect-redis')(session); // Redis session store backed
//const redis = require('redis'); // in-memory data structure store
//const RedisClient  = redis.createClient(); // Redis-client
require('events').EventEmitter.defaultMaxListeners = 15;

// Closing server if configuration file (config.js) missing
if(!fs.existsSync("config.js")){
	console.log("\n=========\nCannot find config file\n=========\n");
	process.exit(0);
}

// Paths and Files
const CFG = require(path.join(__dirname + '/config')); // Config file
const Index = require(path.join(__dirname + '/router/index')); // Login
const LogPath = path.join(__dirname + CFG.logPath); // LogPath

// Checking that logpath exists, if not, creating it.
fs.existsSync(LogPath) || fs.mkdirSync(LogPath)

// Settings FileStreamRotator
const LogStream = FileStreamRotator.getStream({
	filename: path.join(LogPath, CFG.logFile),
	frequency: CFG.logFrequency,
	verbose: CFG.logVerbose,
	date_format: CFG.logDateFormat
})

// Create Express Server
const server = express(); // Create Server

// RedisStore - Sessions
server.use(session({
	secret: CFG.session_cookie_secret,
	key: CFG.session_key,
	saveUninitialized: CFG.session_saveUninitialized,
	resave: CFG.session_resave,
	rolling: CFG.session_rolling,
	cookie: {
		maxAge: CFG.session_cookie_expire,
		secure: CFG.session_secure,
		httpOnly: CFG.session_httpOnly,
		secret: CFG.session_secret,
	}
	//,
	//store: new redisStore({
	//	client: RedisClient,
	//	port: CFG.redis_server_port,
	//	host: CFG.redis_server,
	//	pass: CFG.redis_server_password,
	//	ttl: CFG.session_ttl,
	//	prefix : CFG.redis_server_prefix
	//})
}));

// Configuration
server.use(cookieParser()); // CookieParser
server.use(bodyParser.json()); // JSON encoded bodies
server.use(bodyParser.urlencoded({extended: CFG.bodyParser_extended})); // Encoded bodies
server.use(morgan(CFG.logging)); // Console.log
server.use(morgan('combined', {stream: LogStream})); // Accesslog (log/access-YYYY-MM-DD.log)

//Enable cross-origin resource
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Default template settings for infoscreen
server.engine('.hbs', exphbs({extname: '.hbs'}));
server.set('view engine', '.hbs');
server.set('views', path.join(__dirname, '/views'));
server.use('/js', express.static(path.join(__dirname, '/assets/js')))
server.use('/css', express.static(path.join(__dirname, '/assets/css')))
server.use('/media', express.static(path.join(__dirname, '/assets/media')))
server.use('/plugins', express.static(path.join(__dirname, '/assets/plugins')))

// Websocket initialization
const WebSocket = require('ws');
const wssPort = 8081;
const rosWsAddr = 'ws://' + CFG.ros_master + ':' + CFG.ros_port;
const wss = new WebSocket.Server({ port: wssPort });

wss.on('connection', function connection(ws, request, client) {
  console.log('New wss connection');
  const rosWs = new WebSocket(rosWsAddr);
  // relay messages from the client
  ws.on('message', function message(msg) {
    console.log(`Received message ${msg} from user`);
    rosWs.send(msg);
  });
  // relay messages from ros
  rosWs.on('message', function message(msg) {
    console.log(`Received message ${msg} from ROS`);
    ws.send(msg);
  });
});

// Check
server.get('/test', function (req,res){
	res.json({status: 'online'});
});

//Routes
server.use('/', Index); // Index

// 404 Error
server.use("*",function(req,res){
	res.status(404).send('404: Page not Found');
});

// Starting server
let webserver_port;
if(process.argv[2] === undefined || process.argv[2] === null){
	webserver_port = CFG.webserver_port;
} else {
	webserver_port = process.argv[2];
}

server.listen(webserver_port,function(){
	console.log("%s API listening at http://%s:%s \n",CFG.servername,CFG.webserver_host,webserver_port);
});