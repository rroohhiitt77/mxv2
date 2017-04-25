// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
// load up the user model
var User            = require('../app/models/User');
//load up the Doctor model
var Doctor            = require('../app/models/Doctor');
//load up the SuperAdmin model
var SuperAdmin            = require('../app/models/SuperAdmin');
//load up the Patient model
var Patient            = require('../app/models/Patient');




// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with phonenummber
        usernameField : 'phoneNumber',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, phoneNumber, password, done) {

    	//email = email.toLowerCase();
    	
    	//console.log(req.body);
        // asynchronous
        // User.findOne wont fire unless data is sent back

        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.phoneNumber' :  phoneNumber }, function(err, user) {
            // if there are any errors, return the error
            if (err)
            	{
            	console.log('Post Signup:' + err);
                return done(err);
            	}

            // check to see if theres already a user with that phone number
            if (user) {
            	console.log('Post Signup: User found');
                return done(null, false, req.flash('signupMessage', 'That phone number is already taken.'));
            } else {
            	console.log('Post Signup:1');
                // if there is no user with that phone
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.phoneNumber = phoneNumber ;
                newUser.local.password = newUser.generateHash(password);

                console.log("req.body.entityType" + req.body.entityType);
                console.log("req" + req);

                if(req.body.entityType == 'Doctor')
                	UpdateDoctor(newUser, req, done);
                else if(req.body.entityType == 'SuperAdmin')
                	UpdateSuperAdmin(newUser, done);
                else if(req.body.entityType == 'Patient')
                    UpdatePatient(newUser, req, done);
                else {
                    console.log('Post Signup:2');
                    return done(null, false, req.flash('signupMessage', 'Invalid Entity Type.'));
                }
            }

        });    

        });

    }));
    
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'phoneNumber',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, phoneNumber, password, done) { // callback with phoneNumber and password from our form

    	//phoneNumber = phoneNumber.toLowerCase();
    	
        // find a user whose phoneNumber is the same as the forms phoneNumber
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.phoneNumber' :  phoneNumber }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, {alert:'No user found.'}); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, {alert:'No user found.'}); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
};



function UpdateDoctor(newUser, req, done){

    //create an entry for this user in doctor table. User can update profile later on.
    var phoneNumber =  newUser.local.phoneNumber;

    var newDoctor = new Doctor();
    newDoctor.phoneNumber = phoneNumber;
    newDoctor.firstName = req.body.firstName;
    newDoctor.lastName = req.body.lastName;
    newDoctor.email = req.body.email;

    // save the doctor in doctor table
    newDoctor.save(function(err) {
        if (err)
            throw err;

        //get the ID and save in newuser for cross reference
        Doctor.findOne({'phoneNumber' : phoneNumber}, function(err, doctor){
            if(err)
                throw err;
            if(doctor){
                newUser.userType.entityType = 'doctor';
                newUser.userType.id = doctor._id;
                newUser.userType.mxID = 'MX' + doctor.mxId + doctor.mxIdSuffix;
            }
            else
                console.log('no doctor found for phone: ' + phoneNumber);

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });

        });

    });



};

function UpdateSuperAdmin(newUser, done){

    //create an entry for this user in super admin table. User can update profile later on.
    var email =  newUser.local.email;

    var newSuperAdmin = new SuperAdmin();
    newSuperAdmin.email = email;

    // save the super admin in super admin table
    newSuperAdmin.save(function(err) {
        if (err)
            throw err;

        //get the ID and save in newuser for cross reference
        SuperAdmin.findOne({'email' : email}, function(err, superAdmin){
            if(err)
                throw err;
            if(superAdmin){
                newUser.userType.entityType = 'superAdmin';
                newUser.userType.id = superAdmin._id;
            }
            else
                console.log('no superAdmin found for email: ' + email);

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });

        });

    });


};

function UpdatePatient(newUser, req, done){

    //create an entry for this user in patient table. User can update profile later on.
    var phoneNumber =  newUser.local.phoneNumber;

    var newPatient = new Patient();
    newPatient.phoneNumber = phoneNumber;
    newPatient.firstName = req.body.firstName;
    newPatient.lastName = req.body.lastName;
    newPatient.email = req.body.email;

    // save the pateint in patient table
    newPatient.save(function(err) {
        if (err)
            throw err;

        //get the ID and save in newuser for cross reference
        Patient.findOne({'phoneNumber' : phoneNumber}, function(err, patient){
            if(err)
                throw err;
            if(patient){
                newUser.userType.entityType = 'patient';
                newUser.userType.id = patient._id;
                newUser.userType.mxID = 'MX' + patient.mxId + patient.mxIdSuffix;
            }
            else
                console.log('no patient found for phone: ' + phoneNumber);

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });

        });

    });


};