var done= 'false';
var User      = require('./app/models/User');
var Doctor            = require('./app/models/Doctor');
var jwt        = require("jsonwebtoken");
var Firebase = require('firebase');
var configDB = require('./config/db');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
	
	var contactUsRESTRouter = require('./app/routers/contactUsREST');
	app.use('/api/contactus', contactUsRESTRouter);
	
	var campCommonProblemRESTRouter = require('./app/routers/campCommonProblemREST');
	app.use('/api/campCommonProblem', campCommonProblemRESTRouter);

    var campCommonDoctorExaminationRESTRouter = require('./app/routers/campCommonDoctorExaminationREST');
    app.use('/api/campCommonDoctorExamination', campCommonDoctorExaminationRESTRouter);

    var campCommonDoctorAdviseRESTRouter = require('./app/routers/campCommonDoctorAdviseREST');
    app.use('/api/campCommonDoctorAdvise', campCommonDoctorAdviseRESTRouter);

	var doctorRESTRouter = require('./app/routers/doctorREST');
	app.use('/api/doctor', doctorRESTRouter);

    var appointmentRESTRouter = require('./app/routers/appointmentREST');
    app.use('/api/appointment', appointmentRESTRouter);

    var patientRESTRouter = require('./app/routers/patientREST');
    app.use('/api/patient', patientRESTRouter);

    var prescriptionTemplateRESTRouter = require('./app/routers/prescriptionTemplateREST');
    app.use('/api/prescriptionTemplate', prescriptionTemplateRESTRouter);

    var prescriptionPatientRESTRouter = require('./app/routers/prescriptionPatientREST');
    app.use('/api/prescriptionPatient', prescriptionPatientRESTRouter);

    var labTestTemplateRESTRouter = require('./app/routers/labTestTemplateREST');
    app.use('/api/labTestTemplate', labTestTemplateRESTRouter);

    var labTestPatientRESTRouter = require('./app/routers/labTestPatientREST');
    app.use('/api/labTestPatient', labTestPatientRESTRouter);

    var icdRESTRouter = require('./app/routers/icdREST');
    app.use('/api/icd', icdRESTRouter);

    var doctorScheduleRESTRouter = require('./app/routers/doctorScheduleREST');
    app.use('/api/doctorSchedule', doctorScheduleRESTRouter);

	var campDetailRESTRouter = require('./app/routers/campDetailREST');
	app.use('/api/campDetail', campDetailRESTRouter);

    var clinicDetailRESTRouter = require('./app/routers/clinicDetailREST');
    app.use('/api/clinicDetail', clinicDetailRESTRouter);
	
	var campUserRESTRouter = require('./app/routers/campUserREST');
	app.use('/api/campUser', campUserRESTRouter);

    var patientCaseRESTRouter = require('./app/routers/patientCaseREST');
    app.use('/api/patientCase', patientCaseRESTRouter);

    //=========================== DOCTOR DASHBOARD START ========================================

    //todo:improve error handling - http://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling


    app.post('/api/loginDoctor', function(req, res) {
        User.findOne({'local.phoneNumber': req.body.phoneNumber, 'userType.entityType':'doctor'}, function(err, user) {
            if (err) {
                res.status(500).json({
                    type: false,
                    message : "Error occured: " + err,
                    user: null
                });
            } else {
                if (user) {
                    //check password
                    if(user.validPassword(req.body.password)) {
                        res.status(200).json({
                            type: true,
                            message: "Login Successfull",
                            user: user.userType,
                            token: user.local.token
                        });
                    }
                    else{
                        res.status(401).json({
                            type: false,
                            message : "Incorrect password",
                            user: null
                        });
                    }
                } else {
                    res.status(401).json({
                        type: false,
                        message : "Incorrect phoneNumber",
                        user: null
                    });
                }
            }
        });
    });

    app.post('/api/registerDoctor', function(req, res) {
        User.findOne({'local.phoneNumber': req.body.phoneNumber, 'userType.entityType':'doctor'}, function(err, user) {
            if (err) {
                res.status(500).json({
                    type: false,
                    message : "Error occured: " + err,
                    user: null
                });
            } else {
                if (user) {
                    res.status(500).json({
                        type: false,
                        message : "User already exists!",
                        user: null
                    });
                } else {

                    console.log('Register Doc:1');
                    // if there is no user with that phone
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.local.phoneNumber = req.body.phoneNumber ;
                    newUser.local.password = newUser.generateHash(req.body.password);
                    UpdateDoctor(newUser, req, res);
                }
            }
        });
    });

    app.get('/me', EnsureAuthorized, function(req, res) {
        User.findOne({'local.token': req.token}, function(err, user) {
            if (err) {
                res.status(401).json({
                    type: false,
                    message : "Error occured: " + err,
                    data: null
                });
            } else {
                res.status(200).json({
                    type: true,
                    message : "Successfull",
                    data: user.userType
                });
            }
        });
    });

    //to allow html5 based refresh with angular.  eg /abc will get back to abc after refresh
    app.get('/*',function(req,res){
        //res.sendfile('d:/Intellilabs/Java Projects/MX_FUSE_DoctorDashboard/Server/dist/index.html');
        res.sendfile(__dirname + '/dist/index1.html');
    });


    //app.get('/logoutDoctor', function (req, res){
    //    req.logOut()  // <-- not req.logout();
    //    req.session.destroy(function (err) {
    //        return res.status(200).json({
    //            status: 'Logout successful!'
    //        });
    //    });
    //    //res.redirect('/loginDoctor')
    //
    //});

    //=========================== DOCTOR DASHBOARD END ========================================


    //set up subdomain routing // MUST BE AT END TO PREVENT REDIRECTIONS LOOP
    app.get('*', function(req, res, next){
        console.log(req.headers.host);
        var sd = GetSubDomain(req.headers.host.toUpperCase());
        sd = sd.toUpperCase();

        if(sd==null)
            res.send(404);
        if(sd == 'DOCTOR' || sd == 'MXDOC')
        {
            console.log('redirecting to doctor dashboard');
            //rnamed to index1, index.html get automatically sent wihtout coming to this routing.
            res.sendfile(__dirname + '/dist/index1.html');
        }
        else {
            //todo:check for available doctors vanity url and render appropraite page.  IF NOT FOUND then eturn 404 not found error
            res.send(404);
        }

        //next();
    });

};

function GetSubDomain(host){
    host = host.toUpperCase();
    if(process.env.ENVIRONMENT.toUpperCase() == 'DEV')
    {
        var n = host.indexOf(".LOCALHOST");
        console.log(n);

        var subDomain = host.substr(0, n);
        console.log(subDomain);
        return subDomain;
    }
    else if(process.env.ENVIRONMENT.toUpperCase() == 'PROD')
    {
        var n = host.indexOf(".MEDIXPRT");
        console.log(n);
        if(n==-1) //try herokuapp
        n = host.indexOf(".HEROKUAPP");
        console.log(n);

        var subDomain = host.substr(0, n);
        console.log(subDomain);
        return subDomain;
    }
    else
        return null;
};

function UpdateDoctor(newUser, req, res){

    //create an entry for this user in doctor table. User can update profile later on.
    var phoneNumber =  newUser.local.phoneNumber;

    var newDoctor = new Doctor();
    newDoctor.phoneNumber = phoneNumber;
    newDoctor.firstName = req.body.firstName;
    newDoctor.middleName = req.body.middleName;
    newDoctor.lastName = req.body.lastName;
    newDoctor.email = req.body.email;

    // save the doctor in doctor table
    newDoctor.save(function(err) {
        if (err)
        {
            error = 'Error in registration:' + err;
            console.log(error);
            return res.status(500).json({
                type: false,
                message : "Error occured: " + err,
                user: null
            });
        }

        //get the ID and save in newuser for cross reference
        Doctor.findOne({'phoneNumber' : phoneNumber}, function(err, doctor){
            if(err)
                throw err;
            if(doctor){
                newUser.userType.entityType = 'doctor';
                newUser.userType.id = doctor._id;
                newUser.userType.mxID = 'MX' + doctor.mxId + doctor.mxIdSuffix;
            }
            else {
                console.log('no doctor found for phone: ' + phoneNumber);
                return res.status(500).json({
                    type: false,
                    message : 'no doctor found for phone: ' + phoneNumber,
                    user: null
                });
            }

            newUser.save(function(err, user) {
                user.local.token = jwt.sign(user, 'MXhjhfdkahfkas68364328hfhkahsdfkjlk');//process.env.JWT_SECRET);
                user.save(function(err, user1) {
                    return res.status(200).json({
                        type: true,
                        message : 'Registration Successfull',
                        user: user1.userType,
                        token: user1.local.token
                    });
                });
            })

            //save the doctor in firebase chat
            AddToFirebaseChatDoctor(doctor);

            });

        });





};

function AddToFirebaseChatDoctor(doctor){
    var firebaseChatURL = "";

    if(process.env.ENVIRONMENT === 'Prod') {
        firebaseRef = new Firebase(configDB.firebaseChatProdUrl);
        firebaseChatURL = configDB.firebaseProdUrl;
    }
    else{
        firebaseRef = new Firebase(configDB.firebaseChatDevUrl);
        firebaseChatURL = configDB.firebaseDevUrl;
    }

    var docID = doctor._id;
    var mxID = 'MX' + doctor.mxId + doctor.mxIdSuffix;
    var firstName =  doctor.firstName ? doctor.firstName : '';
    var middleName =  doctor.middleName ? doctor.middleName : '';
    var lastName =    doctor.lastName ? doctor.lastName : '';
    var name = firstName + ' ' +middleName +' '+lastName;

    var slotRef = firebaseRef.child('DoctorsContacts');  //will crete if not exists
    slotRef = slotRef.child(docID + '_' + mxID);
    var doctorContact =
    {
        id: docID,
        mxID : mxID,
        name: name,
        avatar: "assets/images/avatars/Abbott.jpg",
        status: "online",
        mood: "",
        unread: null,
        lastMessage: null
    }
    slotRef.update(doctorContact);


}


function EnsureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}