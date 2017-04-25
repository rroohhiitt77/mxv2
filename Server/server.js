//set up ======================================================================
//get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8085;
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var Firebase = require("firebase");
var morgan       = require('morgan');
var bodyParser   = require('body-parser');

// config files
var configDB = require('./config/db');
var compress = require('compression');
app.use(compress());


//configuration ===========================================

//not creating global for moainmongo connection since getting some errors in passport and associated models like doctor, user, etc;
//
if(process.env.ENVIRONMENT === 'Prod') {
    //PROD CONNECTIONS
    console.log('Connecting to PROD Databases');
    mongoose.connect(configDB.dbprod_medixprt_doctor);
    global.mongoStaticConnection = mongoose.createConnection(configDB.dbprod_medixprt_static);
    global.mongoPatientConnection = mongoose.createConnection(configDB.dbprod_medixprt_patient);
}
else {
    console.log('Connecting to DEVvv Databases');
    mongoose.connect(configDB.dblocal_medxiprt_doctor);
    global.mongoStaticConnection = mongoose.createConnection(configDB.dblocal_medxiprt_static);
    global.mongoPatientConnection = mongoose.createConnection(configDB.dblocal_medxiprt_patient);
}

mongoose.connection.on('error', function (err) {
	 console.log ('failed to connect:' +  err);
	});

mongoStaticConnection.on('error', function (err) {
    console.log ('failed to connect:' +  err);
});

mongoPatientConnection.on('error', function (err) {
    console.log ('failed to connect:' +  err);
});

app.use(morgan('dev')); // log every request to the console

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/dist')); // set the static files location /public/img will be /img for users
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//
require('./routes')(app); // pass our application into our routes

process.on('uncaughtException', function(err) {
    console.log(err);
});
// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app