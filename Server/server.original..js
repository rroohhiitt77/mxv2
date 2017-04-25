//set up ======================================================================
//get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8085;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var methodOverride = require('method-override');
var Firebase = require("firebase");
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


// config files
var configDB = require('./config/db');
var configPassport = require('./config/passport');

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
    console.log('Connecting to DEV Databases');
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

//console.log(mongoose.connections);
configPassport(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

//required for passport
var sessionMins = 30*24*60;  //30days  //session expirty will reset to 30mins after every user interaction.
app.use(session(
	{
        secret: 'MedXprtrtrtrtrgggagsgdsgwtgfhswgtr',
        cookie: {
            //expires: new Date(Date.now() + 60 * 10000),
            maxAge: sessionMins*60*1000
        },
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }
    )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs'); // set up ejs for templating


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users


app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        console.log(res._headers);
        oneof = true;
    }
    else
    {
        console.log('received null origin');
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Expose-Headers', 'Access-Control-Allow-Origin,Access-Control-Allow-Credentials');
    }


    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        console.log('OPTIONS');
        console.log(res._headers);
        res.send(200);
    }
    else {
        next();
    }
});

// routes ==================================================
require('./app/routes')(app, passport); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app