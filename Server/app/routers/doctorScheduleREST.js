var express    = require('express');        // call express
var doctorScheduleRESTRouter = express.Router();
var DoctorSchedule = require('../models/DoctorSchedule');
var configDB = require('../../config/db');
var Firebase = require('firebase');
var Appointment = require('../models/Appointment');
var mongoose = require('mongoose');
var firebaseURL = "";

if(process.env.ENVIRONMENT === 'Prod') {
    firebaseRef = new Firebase(configDB.firebaseProdUrl);
    firebaseURL = configDB.firebaseProdUrl;
}
else{
    firebaseRef = new Firebase(configDB.firebaseDevUrl);
    firebaseURL = configDB.firebaseDevUrl;
}


module.exports = doctorScheduleRESTRouter;

//middleware to use for all requests
doctorScheduleRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in DoctorSchedule REST router.');
    next(); // make sure we go to the next routes and don't stop here
});


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
doctorScheduleRESTRouter.get('/doctorScheduleTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our DoctorSchedule REST api!' });
});




doctorScheduleRESTRouter.route('/')

// create a doctorSchedule (accessed at POST http://localhost:8080/api/doctorSchedule)
    .post(function(req, res) {
        console.log('DoctorSchedule created!');
        var doctorSchedule = new DoctorSchedule();      // create a new instance of the DoctorSchedule model
        console.log('DoctorSchedule created!');
        Update(doctorSchedule, req);
        console.log('DoctorSchedule created!');
        // save the doctorSchedule and check for errors
        doctorSchedule.save(function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            }

            //if its holiday, cancel all appointments and mark the slots as disabled with reason holiday
            if(req.body.type == 'Holiday')
            {
                console.log('Holiday Schedule')
                EnableDisableFireBaseSlots(doctorSchedule, true, "Holiday");
                CancelAppointments(doctorSchedule, "Holiday");
            }
            else {
                //create the slots in firebase for this schedule
                UpdateFireBase(doctorSchedule, firebaseRef);
            }

            res.json({ message: 'DoctorSchedule created!' });
            console.log('DoctorSchedule created!');
        });


    })

// get all the  doctorSchedule (accessed at POST http://localhost:8080/api/doctorSchedule)
    .get(function(req, res) {
        DoctorSchedule.find(GetQuery(req), function(err, doctorSchedules) {
            if (err)
                res.send(err);

            res.json(doctorSchedules);
        });
    });




//on routes that end in /bears/:bear_id
//----------------------------------------------------
doctorScheduleRESTRouter.route('/:doctorSchedule_id')

    // get the doctorSchedule with that id (accessed at GET http://localhost:8080/api/doctorSchedule/:doctorSchedule_id)
    .get(function(req, res) {
        //DoctorSchedule.findById(req.params.doctorSchedule_id, function(err, doctorSchedule) {
        DoctorSchedule.findById(req.params.doctorSchedule_id, function(err, doctorSchedule) {
            if (err)
                res.send(err);
            if(doctorSchedule)
                res.json(doctorSchedule);
            else
                res.json({message:'doctorSchedule not found'});
        });
    })
    // update the doctorSchedule with this id (accessed at PUT http://localhost:8080/api/doctorSchedule/:doctorSchedule_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        //DoctorSchedule.findById(req.params.doctorSchedule_id, function(err, doctorSchedule) {
        DoctorSchedule.findById(req.params.doctorSchedule_id, function(err, doctorSchedule) {

            //console.log (req.params.doctorSchedule_id);
            //console.log(doctorSchedule);
            if (err)
                res.send(err);

            if(doctorSchedule)
            {
                //update the doctorSchedule info
                Update(doctorSchedule, req);

                // save the doctorSchedule
                doctorSchedule.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'DoctorSchedule updated!' });
                });
            }
            else
                res.json({message:'doctorSchedule not found'});


        });
    })
    // delete the doctorSchedule with this id (accessed at PUT http://localhost:8080/api/doctorSchedule/:doctorSchedule_id)
    .delete(function(req, res) {

        DoctorSchedule.findById(req.params.doctorSchedule_id, function(err, doctorSchedule) {

            console.log ('deleting schedule for:' + req.params.doctorSchedule_id);
            console.log(doctorSchedule);
            if (err)
                res.send(err);

            if(doctorSchedule)
            {
                //enable the slots
                EnableDisableFireBaseSlots(doctorSchedule, false, '');

                // delete the doctorSchedule
                DoctorSchedule.remove({_id: req.params.doctorSchedule_id}, function(err, doctorSchedule) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Successfully deleted' });
                });
            }
            else {
                res.json({message: 'doctorSchedule not found'});
            }


        });


    });

function CancelAppointments(doctorSchedule, cancelReason)
{
    //Get the slots for teh holiday
    var scheduleStart = new Date(doctorSchedule.from);
    var scheduleEnd = new Date(doctorSchedule.to);
    var slotDate = scheduleStart;


    var update = {'status':'Cancel', 'comments':'DoctorHoliday'};
    var options = { multi: true };

    while(slotDate <= scheduleEnd) {


        var conditions = {'doctorID':doctorSchedule.doctorID, 'clinicID':doctorSchedule.clinicID,
            'date':GetDateFormatted(slotDate)};
        console.log('cancelling appointment:' + conditions);

        Appointment.update(conditions, update, options, function (err, numAffected) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                console.log('records updated for holiday:' + numAffected);
            }
        });

        slotDate = new Date(slotDate.setDate(slotDate.getDate() + 1));
    }

}


function Update(doctorSchedule, req)
{
   //console.log(req.body);
    doctorSchedule.doctorID = mongoose.Types.ObjectId(req.body.doctorId);
    doctorSchedule.doctorFirstName =  req.body.doctorFirstName;
    doctorSchedule.doctorLastName =  req.body.doctorLastName;
    doctorSchedule.doctorMXID =  req.body.doctorMXID;

    doctorSchedule.clinicID =  mongoose.Types.ObjectId(req.body.clinicId);
    doctorSchedule.clinicName =  req.body.clinicName;
    doctorSchedule.clinicMXID =  req.body.clinicMXID;

    doctorSchedule.from  =  req.body.dt;
    doctorSchedule.to  =  req.body.dt1;

    doctorSchedule.dayOfWeekMonday  =  req.body.monday;
    doctorSchedule.dayOfWeekTuesday  =  req.body.tuesday;
    doctorSchedule.dayOfWeekWednesday  =  req.body.wednesday;
    doctorSchedule.dayOfWeekThursday  =  req.body.thursday;
    doctorSchedule.dayOfWeekFriday  =  req.body.friday;
    doctorSchedule.dayOfWeekSaturday  =  req.body.saturday;
    doctorSchedule.dayOfWeekSunday  =  req.body.sunday;
    doctorSchedule.timeFrom  =  req.body.timeFrom;
    doctorSchedule.timeTo  =  req.body.timeTo;
    doctorSchedule.slotDuration  =  req.body.slotDuration;
    doctorSchedule.maxPerSlot  =  req.body.maxPerSlot;
    doctorSchedule.maxWalkInPerSlot  =  req.body.maxWalkInPerSlot;
    doctorSchedule.type  =  req.body.type;
    doctorSchedule.remarks  =  req.body.remarks;

}

function UpdateFireBase(doctorSchedule, firebase)
{

    //Create the slots for the entire duration of schedule validity.
    var scheduleStart = new Date(doctorSchedule.from);
    var scheduleEnd = new Date(doctorSchedule.to);

    var slotDate = scheduleStart;

    while(slotDate <= scheduleEnd){

        //check if the day of the week is selected
        if(ValidDayOfWeek(doctorSchedule, slotDate) == "true")
        {
            if(doctorSchedule.maxPerSlot > 0)
            {
                UpdateFirebaseSlots(doctorSchedule.type + "/" + "Appointment", doctorSchedule, slotDate, firebase);
            }
            if(doctorSchedule.maxWalkInPerSlot > 0)
            {
                UpdateFirebaseSlots(doctorSchedule.type + "/" +"Walkin", doctorSchedule, slotDate, firebase);
            }

        }

        slotDate = new Date(slotDate.setDate(slotDate.getDate() + 1));
    }
    //console.log(JSON.stringify(obj));
}


function EnableDisableFireBaseSlots(doctorSchedule, disable, disableReason)
{

    //Get the slots for teh holiday
    var scheduleStart = new Date(doctorSchedule.from);
    var scheduleEnd = new Date(doctorSchedule.to);
    var startTime = parseInt(doctorSchedule.timeFrom, 10);
    var endTime = parseInt(doctorSchedule.timeTo, 10);

    var slotDate = scheduleStart;

    while(slotDate <= scheduleEnd){

        var patientPath = firebaseURL + "/Patient/" + "/Appointment/" + GetDateFormatted(slotDate) + "/" + GetSlotId(doctorSchedule);
        disable ? EnableDisableSlot(patientPath, true, 'Holiday', startTime, endTime) : EnableDisableSlot(patientPath, false, '', startTime, endTime);
        patientPath = firebaseURL + "/Patient/" + "/Walkin/" + GetDateFormatted(slotDate) + "/" + GetSlotId(doctorSchedule);
        disable ? EnableDisableSlot(patientPath, true, 'Holiday', startTime, endTime) : EnableDisableSlot(patientPath, false, '', startTime, endTime);
        var mrPath = firebaseURL + "/MR/" + "/Appointment/" + GetDateFormatted(slotDate) + "/" + GetSlotId(doctorSchedule);
        disable ? EnableDisableSlot(mrPath, true, 'Holiday', startTime, endTime) : EnableDisableSlot(mrPath, false, '', startTime, endTime);
        mrPath = firebaseURL + "/MR/" + "/Walkin/" + GetDateFormatted(slotDate) + "/" + GetSlotId(doctorSchedule);
        disable ? EnableDisableSlot(mrPath, true, 'Holiday', startTime, endTime) : EnableDisableSlot(mrPath, false, '', startTime, endTime);

        slotDate = new Date(slotDate.setDate(slotDate.getDate() + 1));
    }
    //console.log(JSON.stringify(obj));
}


function EnableDisableSlot(appointmentPath, disable, disableReason, startTime, endTime)
{
    queryRef = new Firebase(appointmentPath);
    queryRef.once('value', function (allDataSnapshot) {

        if (!allDataSnapshot.exists()) {
            console.log('No Data to update for holiday');
            return;
        }

        allDataSnapshot.forEach(function (dataSnapshot) {

            //console.log('path:' + appointmentPath);
            //console.log('key:' + allDataSnapshot.key());
            //console.log(dataSnapshot.key());

            //check if time is between the given time
            var slotTime = parseInt(dataSnapshot.key(), 10);
            if(slotTime <= endTime && slotTime >= startTime) {

                //update firebase
                appointmentPathWithTime = appointmentPath + "/" + dataSnapshot.key();
                firebaseUpdateRef = new Firebase(appointmentPathWithTime);

                if (disable) {
                    firebaseUpdateRef.update({
                        disabled: true,
                        disabledReason: disableReason
                    })
                }
                else {
                    firebaseUpdateRef.update({
                        disabled: false,
                        disabledReason: disableReason
                    })
                }
            }
            else
            {
                console.log(slotTime + 'is outside ' + endTime + ' & ' + startTime);
            }


        });

    });

}


function UpdateFirebaseSlots(type, doctorSchedule, slotDate, firebase)
{
    var slotRef = firebase.child(type);  //get type of appointment
    slotRef = slotRef.child(GetDateFormatted(slotDate));  // get to the date node
    slotRef = slotRef.child(GetSlotId(doctorSchedule));  //this creates a child if it doesnt exist.
    //console.log(slotRef.toString());
    slotRef.update(GetStartTimes(doctorSchedule, type),function(error) {
        if (error) {
            console.log("Slots could not be updated" + error);
        } else {
            console.log("Slots saved successfully.");
        }
    });

}

//Create date nodes for all slots.
function CreateTopLevelChild(firebase)
{

    console.log("start");
    var startDate = new Date("10Feb2016");
    var endDate = new Date("20Feb2016");

    var obj = {};

    while(startDate <= endDate){

        var dateFormatted = GetDateFormatted(startDate);

        var date = {date:dateFormatted};

        obj[dateFormatted] = date;
        //console.log(JSON.stringify(obj));

        startDate = new Date(startDate.setDate(startDate.getDate() + 1));

    }

    firebase.set(obj);


}

function GetStartTimes(doctorSchedule, type)
{
    var startTimes = {};

    var startTimeHrs = parseInt(doctorSchedule.timeFrom.substring(0,2), 10);
    var startTimeMin = parseInt(doctorSchedule.timeFrom.substring(2,4), 10);
    var endTimeHrs = parseInt(doctorSchedule.timeTo.substring(0,2), 10);
    var endTimeMin = parseInt(doctorSchedule.timeTo.substring(2,4), 10);
    var timeIncrement = doctorSchedule.slotDuration;

    var dtStart = new Date(99,01,01, startTimeHrs, startTimeMin, 0, 0 );
    var dtEnd = new Date(99,01,01, endTimeHrs, endTimeMin, 0, 0 );

    //console.log("start:" + dtStart);
    //console.log("end:" + dtEnd);

    while (dtStart < dtEnd)
    {
        console.log(dtStart);

        var startTime = (dtStart.getHours()*100 + dtStart.getMinutes()).toString();
        startTimes[startTime] = {startTime:startTime,
                                booked:false,
                                remaining: type=="Walkin" ? doctorSchedule.maxWalkInPerSlot : doctorSchedule.maxPerSlot,
                                total: 0,
                                disabled : false,   //can be disabled due to holidays
                                disabledReason : "",
                                patientIds : ""}

        dtStart.setMinutes(dtStart.getMinutes() + timeIncrement);
    }
    console.log(JSON.stringify(startTimes));
    return startTimes;

}


function GetDateFormatted(date)
{
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var dateFormatted = day.toString() + monthNames[monthIndex] + year.toString();

    return dateFormatted;


}

function GetSlotId(doctorSchedule)
{
    var doctorId = doctorSchedule.doctorMXID.toUpperCase() + '_' + doctorSchedule.doctorID;
    var clinicId = doctorSchedule.clinicMXID.toUpperCase() + '_' + doctorSchedule.clinicID;
    var slotId = doctorId + '_' + clinicId;  //unique identifier for doctor+clinic

    return slotId;

}

function ValidDayOfWeek(doctorSchedule, slotDate)
{
    var dayOfWeek = slotDate.getDay();  // 0 is sunday
    //console.log(doctorSchedule);
    //console.log(doctorSchedule.dayOfWeekMonday);
    //console.log(doctorSchedule.dayOfWeekTuesday);
    //console.log(dayOfWeek);

    switch(dayOfWeek)
    {
        case 0://sunday
            return doctorSchedule.dayOfWeekSunday;
            break;
        case 1:
            return doctorSchedule.dayOfWeekMonday;
            break;
        case 2:
            return doctorSchedule.dayOfWeekTuesday;
            break;
        case 3:
            return doctorSchedule.dayOfWeekWednesday;
            break;
        case 4:
            return doctorSchedule.dayOfWeekThursday;
            break;
        case 5:
            return doctorSchedule.dayOfWeekFriday;
            break;
        case 6:
            return doctorSchedule.dayOfWeekSaturday;
            break;

    }

}


function GetQuery(req)
{

    var obj = req.query;
    var query = {};
    var subQuery = {};

    Object.keys(obj).forEach(function(key) {
        value = obj[key];
        query[key] = value;

    });

    //console.log('obj:' +JSON.stringify(obj));
    //console.log('query:' +JSON.stringify(query));
    return query;

}