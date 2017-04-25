var express    = require('express');        // call express
var patientRESTRouter = express.Router();
var Patient = require('../models/Patient');   

module.exports = patientRESTRouter;

//middleware to use for all requests
patientRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in Patient REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
patientRESTRouter.get('/patientTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our Patient REST api!' });   
});

//get a list of all MxIDs and user names
patientRESTRouter.route('/testData/:id')
    .get(function(req, res) {
        //create number of test records
        for(var i = 0; i<req.params.id; i++)
        {
            var patient = new Patient();      // create a new instance of the Patient model
            CreateTestPatient(patient, i);
            console.log(patient);
            //save the patient and check for errors
            patient.save(function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            });
        }
        res.json(req.params.id + " patients created");
    });

//search patientid based on phone num, create and return if not found.
patientRESTRouter.route('/getOrCreatePatientID')
    .post(function(req, res) {

        //search patient based on phone number
        Patient.find({'phone1' :req.body.phoneNum}, function(err, patients) {
            console.log('phoneNUme:' + req.body.phoneNum);
            console.log(patients);
            if (err)
                   res.send(err);
            else if(patients.length > 1)
                res.send('Too many patients found');
            else if(patients.length == 1) {
                console.log('patient found for phone num:' + req.body.phoneNum );
                console.log( patients[0]._id);
                res.send('success:' + patients[0]._id);
            }
            else if(patients.length == 0)
            {            //create if not found

                var patient = new Patient();      // create a new instance of the Patient model
                UpdateMinor(patient, req);

                // save the patient and check for errors
                patient.save(function(err) {
                    if (err)
                        res.send(err);
                    else
                        res.send('success:' + patient._id);
                });
            }
        });
    })


//get a list of all MxIDs and user names
patientRESTRouter.route('/seqId')
    .get(function(req, res) {
        console.log('a');
        Patient.find(function(err, details) {
            if (err)
                res.send(err);
            //console.log(details);
            res.json(BuildResultSetfroMxID(details));
            console.log(BuildResultSetfroMxID(details));
            return;
        });
    });



//============================== BASIC CRUD for Patient starts =====================================================
patientRESTRouter.route('/')

// create a patient (accessed at POST http://localhost:8080/api/patient)
.post(function(req, res) {
    
    var patient = new Patient();      // create a new instance of the Patient model
    
    Update(patient, req);
    
    // save the patient and check for errors
    patient.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Patient created!' });
    });

    
})

// get all the  patient (accessed at POST http://localhost:8080/api/patient)
    .get(function(req, res) {

        Patient.find( GetQuery(req) ,function(err, patients) {
            if (err)
                res.send(err);

            res.json(patients);
        });
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
patientRESTRouter.route('/:patient_id')

 // get the patient with that id (accessed at GET http://localhost:8080/api/patient/:patient_id)
 .get(function(req, res) {
	 //Patient.findById(req.params.patient_id, function(err, patient) {
	 Patient.findById(req.params.patient_id, function(err, patient) {
         if (err)
             res.send(err);
         if(patient)
        	 res.json(patient);
         else
        	 res.json({message:'patient not found'});
     });
 })
 // update the patient with this id (accessed at PUT http://localhost:8080/api/patient/:patient_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        //Patient.findById(req.params.patient_id, function(err, patient) {
        Patient.findById(req.params.patient_id, function(err, patient) {

    		//console.log (req.params.patient_id);
    		//console.log(patient);
            if (err)
                res.send(err);

            if(patient)
            {
            //update the patient info
            	Update(patient, req);
	
	            // save the patient
	            patient.save(function(err) {
	                if (err)
	                    res.send(err);
	
	                res.json({ message: 'Patient updated!' });
	            });
            }
            else
            	res.json({message:'patient not found'});
            	

        });
    })
    // delete the patient with this id (accessed at PUT http://localhost:8080/api/patient/:patient_id)
    .delete(function(req, res) {
        Patient.remove({
            _id: req.params.patient_id
        }, function(err, patient) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for Patient ends =====================================================

function UpdateMinor(patient, req)
{
    patient.firstName =  req.body.firstName;
    patient.lastName  =  req.body.lastName;
    patient.phone1 = req.body.phoneNum;

}



function Update(patient, req)
{
	    patient.firstName =  req.body.firstName;
		patient.middleName  =  req.body.middleName;
		patient.lastName  =  req.body.lastName;
        patient.sex  =  req.body.sex;
		patient.email =  req.body.email;
		patient.address1 =  req.body.address1;
		patient.address2 =  req.body.address2;
		patient.city = req.body.city;
		patient.state = req.body.state;
		patient.country = req.body.country;
		patient.pincode = req.body.pincode;
		patient.website = req.body.website;
        patient.phoneNumber= req.body.phoneNumber;
		patient.phone1 = req.body.phone1;
		patient.phone2 = req.body.phone2;
		patient.refferedby  =  req.body.refferedby;
		
}

function CreateTestPatient(patient, number)
{
    patient.firstName =  "TestPatientF" + number;
    patient.middleName  =  "TestPatientM" + number;
    patient.lastName  =  "TestPatientL" + number;
    patient.email =  "TestPatientE" + number + "@test.test";
    patient.address1 =  "TestPatient1address" + number;
    patient.address2 =  "TestPatient2address" + number;
    patient.city = "TestPatientCity" + number;
    patient.state = "TestPatientstate" + number;
    patient.country = "TestPatientcountry" + number;
    patient.pincode = "TestPatientpin" + number;
    patient.phoneNumber=  number;
    patient.phone1 = "TestPatient1phone" + number;
    patient.phone2 = "TestPatient2phone" + number;
    patient.refferedby  =  "TestPatientreffered" + number;
}


//used for autocomplete mxid
function BuildResultSetfroMxID(details)
{
    var resultSet = new Array();

    for(i in details)
    {
        var arg1 = new Object();
        console.log(i);
        arg1.firstName = details[i].firstName;
        arg1.middleName =  details[i].middleName;
        arg1.lastName = details[i].lastName;
        arg1.city = details[i].city;
        arg1.seqId = 'MX' + details[i].mxId + details[i].mxIdSuffix;
        arg1.id = details[i]._id;
        resultSet.push(arg1);
    }
    var jsonResultSet = JSON.parse(JSON.stringify(resultSet));

    return jsonResultSet;

}

function GetQuery(req)
{

    var obj = req.query;
    var query = {};
    var subQuery = {};

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
        else
        {
            query[key+'ToUpper'] = value.toUpperCase();
        }
        //console.log(key + ":" + obj[key]);

    });

    return query;

    //console.log("q:" + q);
    //var query = {};
    //var q1 = {};
    //q1['$gte'] = 20;
    //query['fees'] = q1;
    //{fees:{$gte:10}
}