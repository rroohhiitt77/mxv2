var express    = require('express');        // call express
var configDB = require('../../config/db');
var appointmentRESTRouter = express.Router();
var Appointment = require('../models/Appointment');
var Patient = require('../models/Patient');
var MR = require('../models/MR');
var Firebase = require('firebase');
var firebaseQURL = "";

if(process.env.ENVIRONMENT === 'Prod') {
    firebaseQRef = new Firebase(configDB.firebaseQProdUrl);
    firebaseQURL = configDB.firebaseQProdUrl;
}
else{
    firebaseQRef = new Firebase(configDB.firebaseQDevUrl);
    firebaseQURL = configDB.firebaseQDevUrl;
}

module.exports = appointmentRESTRouter;

//middleware to use for all requests
appointmentRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in Appointment REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
appointmentRESTRouter.get('/appointmentTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our Appointment REST api!' });   
});




//============================== BASIC CRUD for Appointment starts =====================================================
appointmentRESTRouter.route('/')

// create a appointment (accessed at POST http://localhost:8080/api/appointment)
.post(function(req, res) {
    
    var appointment = new Appointment();      // create a new instance of the Appointment model
        //get patientdetails and then add
        //fill patient details
        Patient.findById(req.body.patientID, function(err, patientDetails) {
            if (err)
                res.send(err);
            if(patientDetails) {
                Update(appointment, req, patientDetails);

                // save the appointment and check for errors
                appointment.save(function(err) {
                    if (err) {
                        res.send(err);
                        console.log(err);
                    }

                    console.log('Appointment created!');
                    res.json({ message: 'Appointment created!' });
                });

            }
            else {
                res.json({message: 'patient id not found'});
            }
        });


})

// get all the  appointment (accessed at POST http://localhost:8080/api/appointment)
    .get(function(req, res) {

        console.log('Query for get appointment:' + GetQuery(req));

        //Appointment
        //    .find( GetQuery(req))
        //    .populate('doctorID')
        //    .populate('clinicID')
        //    .populate('patientID')
        //    .populate('mrID')
        //    .exec(function(err, appointments) {
        //    if (err)
        //        res.send(err);
        //    //patients dependng upon user type
        //    //console.log(appointments);
        //    res.json(appointments);
        //});

        Appointment
            .find( GetQuery(req))
            .populate('patientDetails')
            .exec(function(err, appointments) {
                if (err)
                    res.status(500).json(err);
                //patients dependng upon user type
                //console.log(appointments);
                res.status(200).json(appointments);
            });
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
appointmentRESTRouter.route('/:appointment_id')

 // get the appointment with that id (accessed at GET http://localhost:8080/api/appointment/:appointment_id)
 .get(function(req, res) {
	 //Appointment.findById(req.params.appointment_id, function(err, appointment) {
	 Appointment.findById(req.params.appointment_id, function(err, appointment) {
         if (err)
             res.send(err);
         if(appointment)
        	 res.json(appointment);
         else
        	 res.json({message:'appointment not found'});
     });
 })
 // update the appointment with this id (accessed at PUT http://localhost:8080/api/appointment/:appointment_id)
    .put(function(req, res) {
        // use our bear model to find the bear we want
        //Appointment.findById(req.params.appointment_id, function(err, appointment) {
        Appointment.findById(req.params.appointment_id)
            .populate('patientDetails')
            .exec(function(err, appointment) {

    		console.log (req.params.appointment_id);
    		console.log(appointment);
            if (err)
                res.send(err);

            if(appointment)
            {
            //update the appointment info
                console.log('1:' + appointment);
                //if fbQkey exist, update that.  this may not come from client as it is still on old dataset
                if(appointment.fbQKey){
                    req.body.fbQKey = appointment.fbQKey;
                }

            	Update(appointment, req, null);
                console.log('2:' + appointment);
	
	            // save the appointment
	            appointment.save(function(err) {
	                if (err) {
                        console.log(err);
                        res.send(err);
                    }

                    console.log('Appointment updated!' );
	                res.json({ message: 'Appointment updated!' });
	            });
            }
            else {
                console.log('appointment not found');
                res.json({message: 'appointment not found'});
            }
            	

        });
    })
    // delete the appointment with this id (accessed at PUT http://localhost:8080/api/appointment/:appointment_id)
    .delete(function(req, res) {
        Appointment.remove({
            _id: req.params.appointment_id
        }, function(err, appointment) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for Appointment ends =====================================================

//in case of post patientdetails != null.  in case of put patientdtails will be part of the appointmetn object
function Update(appointment, req, patientDetails)
{
    //console.log("req");
    appointment.doctorID = req.body.doctorID;
    appointment.doctorDetails = req.body.doctorID;
    appointment.clinicID = req.body.clinicID;
    appointment.clinicDetails = req.body.clinicID;

    appointment.userType = req.body.userType;
    appointment.date = req.body.date;
    appointment.time = req.body.time;
    appointment.type = req.body.type;
    appointment.status = req.body.status;
    appointment.patientID = req.body.patientID;
    if(patientDetails) appointment.patientDetails = req.body.patientID;
    appointment.mrID = req.body.mrID;
    appointment.fbQKey = req.body.fbQKey;

    var fbKey ;
    //add to fb if status=approve
    if(appointment.status === 'Approve') {
        fbKey = AddAppointmentToFB(appointment, patientDetails);
        appointment.fbQKey = fbKey;
    }

    //delete from fb if status = seen or no-show
    if(appointment.status === 'Seen' || appointment.status === 'NoShow' || appointment.status === 'Pending'){
        RemoveAppointmnetFromFB(appointment)
    }



}

function AddAppointmentToFB(appointment, patientDetails){

    var slotRef = firebaseQRef.child(appointment.date);  // get to the date node
    slotRef = slotRef.child(GetAppointmentId(appointment));  //this creates a child if it doesnt exist.
    slotRef = slotRef.child(appointment.time);  //this creates a child if it doesnt exist.
    console.log(slotRef.toString());



    //create the db object to addstartTimes[startTime] = {startTime:startTime,
    var qSlot = [];
    var time = appointment.time;
    var patientFirstName = patientDetails ? patientDetails.firstName : appointment.patientDetails.firstName;
    var patientMiddleName =  patientDetails ? patientDetails.middleName : appointment.patientDetails.middleName ;
    var patientLastName = patientDetails ? patientDetails.lastName : appointment.patientDetails.lastName;
    var patientPhoneNumber =  patientDetails ? patientDetails.phoneNumber : appointment.patientDetails.phoneNumber ;
    var fbKey = slotRef.push({
        startTime:time,
        appointmentType : appointment.type,
        personType : 'Patient',
        patientId :  appointment.patientID.toString(),
        patientFirstName : patientFirstName,
        patientMiddleName : patientMiddleName,
        patientLastName : patientLastName,
        patientMobile : patientPhoneNumber}).name();

    console.log(qSlot);
    return fbKey;


}

function RemoveAppointmnetFromFB(appointment){

    var slotRef = firebaseQRef.child(appointment.date);  // get to the date node
    slotRef = slotRef.child(GetAppointmentId(appointment));  //this creates a child if it doesnt exist.
    slotRef = slotRef.child(appointment.time);  //this creates a child if it doesnt exist.
    console.log(slotRef.toString());

    //get the fbQKey from the appointment

    slotRef.child(appointment.fbQKey).remove();

}

function GetAppointmentId(appointment)
{
    var doctorId = appointment.doctorID;
    var clinicId = appointment.clinicID;
    var appointmentId = doctorId + '_' + clinicId;  //unique identifier for doctor+clinic

    return appointmentId;

}

function GetQuery(req)
{

    var obj = req.query;
    var query = {};
    var subQuery = {};
    var dateLeft = null;
    var dateRight = null;

    Object.keys(obj).forEach(function(key) {
        value = obj[key];
        if(key == 'minFees')
        {
            subQuery['$gte'] = value;
            query['fees'] = subQuery;
        }
        else if(key == 'maxFees')
        {
            subQuery['$lte'] = value;
            query['fees'] = subQuery;
        }
        else if(key == 'fromDate')
        {
            //remove quotes from date string if exists
            console.log('from date:' + value);
            value = value.replace(/"/g,"");
            console.log('from date:' + value);
            dateLeft = GetDateFormatted(new Date(value));
        }
        else if(key == 'toDate')
        {
            //remove quotes from date string if exists
            console.log('to date:' + value);
            value = value.replace(/"/g,"");
            console.log('to date:' + value);
            dateRight = GetDateFormatted(new Date(value));
        }
        else if(key == 'type')
        {
            console.log('type:' + value);
            if(req.query.type != 'All')
                query[key] = value;
        }
        else if(key == 'status')
        {
            if(req.query.status != 'All')
                query[key] = value;
        }
        else
        {
            query[key] = value;
        }

        if(dateLeft!=null && dateRight!=null)
        {
            query["date"] = {
                '$gte': new Date(dateLeft.replace(/"/g,"")),
                '$lte': new Date(dateRight.replace(/"/g,""))}
        }


    });

    console.log('obj:' +JSON.stringify(obj));
    console.log('query:' +JSON.stringify(query));
    return query;


    //console.log("q:" + q);
    //var query = {};
    //var q1 = {};
    //q1['$gte'] = 20;
    //query['fees'] = q1;
    //{fees:{$gte:10}
}

function GetDateFormatted(date)
{
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];
    console.log('in Getformatted date:date:'+date);
    var day = date.getDate(); console.log('day:'+day);
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var dateFormatted = day.toString() + monthNames[monthIndex] + year.toString();

    return dateFormatted;


}
