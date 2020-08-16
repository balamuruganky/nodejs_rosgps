"use strict";

// Modules
let express = require('express'); // Express Server
let aa = require("aa"); // Async-Away

// Utils
let CFG = require(__dirname + '/../config'); // Config file

//Router() object
let Index = express.Router();

Index.route('/').get(function(req,res){
	aa(function*(){
		res.render('map');
	});
});

Index.route('/map').get(function(req,res){
	aa(function*(){
		res.render('map');
	});
});

Index.route('/settings').get(function(req,res){
	aa(function*(){
		res.render('settings');
	});
});

Index.route('/status').get(function(req,res){
	aa(function*(){
		res.render('status');
	});
});

Index.route('/about').get(function(req,res){
	aa(function*(){
		res.render('about');
	});
});

module.exports = Index;
