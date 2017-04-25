var express    = require('express');        // call express
var labTestPatientRESTRouter = express.Router();
var LabTestPatient = require('../models/LabTestPatient');

module.exports = labTestPatientRESTRouter;

//middleware to use for all requests
labTestPatientRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in LabTestPatient REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
labTestPatientRESTRouter.get('/labTestPatientTest', function(req, res) {
    ParseLabTestPatientCodes();
    res.json({ message: 'hooray! welcome to our LabTestPatient REST api!' });
});

//============================== BASIC CRUD for LabTestPatient starts =====================================================
labTestPatientRESTRouter.route('/')

// create a labTestPatient (accessed at POST http://localhost:8080/api/labTestPatient)
    .post(function(req, res) {

        var labTestPatient = new LabTestPatient();      // create a new instance of the LabTestPatient model

        Update(labTestPatient, req);
        // save the labTestPatient and check for errors
        labTestPatient.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'LabTestPatient created!' });
        });
    })

// get all the  labTestPatient (accessed at POST http://localhost:8080/api/labTestPatient)
    .get(function(req, res) {

        LabTestPatient.find( GetQuery(req) ,function(err, labTestPatients) {
            if (err)
                res.send(err);

            res.json(labTestPatients);
        });
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
labTestPatientRESTRouter.route('/:labTestPatient_id')

    // get the labTestPatient with that id (accessed at GET http://localhost:8080/api/labTestPatient/:labTestPatient_id)
    .get(function(req, res) {
        //LabTestPatient.findById(req.params.labTestPatient_id, function(err, labTestPatient) {
        LabTestPatient.findById(req.params.labTestPatient_id, function(err, labTestPatient) {
            if (err)
                res.send(err);
            if(labTestPatient)
                res.json(labTestPatient);
            else
                res.json({message:'labTestPatient not found'});
        });
    })
    // update the labTestPatient with this id (accessed at PUT http://localhost:8080/api/labTestPatient/:labTestPatient_id)
    .put(function(req, res) {
        console.log(req);
        // use our bear model to find the bear we want
        //LabTestPatient.findById(req.params.labTestPatient_id, function(err, labTestPatient) {
        LabTestPatient.findById(req.params.labTestPatient_id, function(err, labTestPatient) {

            console.log (req.params.labTestPatient_id);
            console.log(labTestPatient);
            if (err)
                res.send(err);

            if(labTestPatient)
            {
                //update the labTestPatient info
                Update(labTestPatient, req);

                // save the labTestPatient
                labTestPatient.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'LabTestPatient updated!' });
                });
            }
            else
                res.json({message:'labTestPatient not found'});


        });
    })
    // delete the labTestPatient with this id (accessed at PUT http://localhost:8080/api/labTestPatient/:labTestPatient_id)
    .delete(function(req, res) {
        LabTestPatient.remove({
            _id: req.params.labTestPatient_id
        }, function(err, labTestPatient) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for LabTestPatient ends =====================================================


function Update(labTestPatient, req)
{

    labTestPatient.doctorID =  req.body.doctorID;
    labTestPatient.clinicID =  req.body.clinicID;
    labTestPatient.patientID =  req.body.patientID;
    labTestPatient.cretedOn =  Date.now();
    labTestPatient.templateName =  req.body.templateName;

    labTestPatient.labTestFields = [];

    //console.log(labTestPatient.labTestPatientFields);

    for(i=0; i<req.body.labTestFields.length; ++i)
    {
        //console.log(i);
        pf = req.body.labTestFields[i];

        var labTestField = {
            testName : pf.testName,
            prefferedLab : pf.prefferedLab,
            instructions : pf.instructions,

        }

        labTestPatient.LabTestPatientFields.push(labTestField);
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



