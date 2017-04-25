var express    = require('express');        // call express
var prescriptionPatientRESTRouter = express.Router();
var PrescriptionPatient = require('../models/PrescriptionPatient');

module.exports = prescriptionPatientRESTRouter;

//middleware to use for all requests
prescriptionPatientRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in PrescriptionPatient REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
prescriptionPatientRESTRouter.get('/prescriptionPatientTest', function(req, res) {
    ParsePrescriptionPatientCodes();
    res.json({ message: 'hooray! welcome to our PrescriptionPatient REST api!' });
});

//============================== BASIC CRUD for PrescriptionPatient starts =====================================================
prescriptionPatientRESTRouter.route('/')

// create a prescriptionPatient (accessed at POST http://localhost:8080/api/prescriptionPatient)
    .post(function(req, res) {

        var prescriptionPatient = new PrescriptionPatient();      // create a new instance of the PrescriptionPatient model

        Update(prescriptionPatient, req);
        // save the prescriptionPatient and check for errors
        prescriptionPatient.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'PrescriptionPatient created!' });
        });
    })

// get all the  prescriptionPatient (accessed at POST http://localhost:8080/api/prescriptionPatient)
    .get(function(req, res) {

        PrescriptionPatient.find( GetQuery(req) ,function(err, prescriptionPatients) {
            if (err)
                res.send(err);

            res.json(prescriptionPatients);
        });
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
prescriptionPatientRESTRouter.route('/:prescriptionPatient_id')

    // get the prescriptionPatient with that id (accessed at GET http://localhost:8080/api/prescriptionPatient/:prescriptionPatient_id)
    .get(function(req, res) {
        //PrescriptionPatient.findById(req.params.prescriptionPatient_id, function(err, prescriptionPatient) {
        PrescriptionPatient.findById(req.params.prescriptionPatient_id, function(err, prescriptionPatient) {
            if (err)
                res.send(err);
            if(prescriptionPatient)
                res.json(prescriptionPatient);
            else
                res.json({message:'prescriptionPatient not found'});
        });
    })
    // update the prescriptionPatient with this id (accessed at PUT http://localhost:8080/api/prescriptionPatient/:prescriptionPatient_id)
    .put(function(req, res) {
        console.log(req);
        // use our bear model to find the bear we want
        //PrescriptionPatient.findById(req.params.prescriptionPatient_id, function(err, prescriptionPatient) {
        PrescriptionPatient.findById(req.params.prescriptionPatient_id, function(err, prescriptionPatient) {

            console.log (req.params.prescriptionPatient_id);
            console.log(prescriptionPatient);
            if (err)
                res.send(err);

            if(prescriptionPatient)
            {
                //update the prescriptionPatient info
                Update(prescriptionPatient, req);

                // save the prescriptionPatient
                prescriptionPatient.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'PrescriptionPatient updated!' });
                });
            }
            else
                res.json({message:'prescriptionPatient not found'});


        });
    })
    // delete the prescriptionPatient with this id (accessed at PUT http://localhost:8080/api/prescriptionPatient/:prescriptionPatient_id)
    .delete(function(req, res) {
        PrescriptionPatient.remove({
            _id: req.params.prescriptionPatient_id
        }, function(err, prescriptionPatient) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for PrescriptionPatient ends =====================================================


function Update(prescriptionPatient, req)
{

    prescriptionPatient.doctorID =  req.body.doctorID;
    prescriptionPatient.clinicID =  req.body.clinicID;
    prescriptionPatient.patientID =  req.body.patientID;
    prescriptionPatient.cretedOn =  Date.now();
    prescriptionPatient.templateName =  req.body.templateName;

    prescriptionPatient.prescriptionFields = [];

    //console.log(prescriptionPatient.PrescriptionPatientFields);

    for(i=0; i<req.body.prescriptionFields.length; ++i)
    {
        //console.log(i);
        pf = req.body.prescriptionFields[i];

        var prescriptionField = {
            drugName : pf.drugName,
            strength : pf.strength,
            duration : pf.duration,
            morning : pf.morning,
            afternoon : pf.afternoon,
            night : pf.night,
            instruction : pf.instruction,
            beforeFood : pf.beforeFood,
            afterFood : pf.afterFood
        }

        prescriptionPatient.PrescriptionPatientFields.push(prescriptionField);
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



