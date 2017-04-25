var express    = require('express');        // call express
var prescriptionTemplateRESTRouter = express.Router();
var PrescriptionTemplate = require('../models/PrescriptionTemplate');

module.exports = prescriptionTemplateRESTRouter;

//middleware to use for all requests
prescriptionTemplateRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in PrescriptionTemplate REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
prescriptionTemplateRESTRouter.get('/prescriptionTemplateTest', function(req, res) {
    ParsePrescriptionTemplateCodes();
    res.json({ message: 'hooray! welcome to our PrescriptionTemplate REST api!' });
});

//============================== BASIC CRUD for PrescriptionTemplate starts =====================================================
prescriptionTemplateRESTRouter.route('/')

// create a prescriptionTemplate (accessed at POST http://localhost:8080/api/prescriptionTemplate)
    .post(function(req, res) {

        var prescriptionTemplate = new PrescriptionTemplate();      // create a new instance of the PrescriptionTemplate model

        Update(prescriptionTemplate, req);
        // save the prescriptionTemplate and check for errors
        prescriptionTemplate.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'PrescriptionTemplate created!' });
        });
    })

// get all the  prescriptionTemplate (accessed at POST http://localhost:8080/api/prescriptionTemplate)
    .get(function(req, res) {

        PrescriptionTemplate.find( GetQuery(req) ,function(err, prescriptionTemplates) {
            if (err)
                res.send(err);

            res.json(prescriptionTemplates);
        });
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
prescriptionTemplateRESTRouter.route('/:prescriptionTemplate_id')

    // get the prescriptionTemplate with that id (accessed at GET http://localhost:8080/api/prescriptionTemplate/:prescriptionTemplate_id)
    .get(function(req, res) {
        //PrescriptionTemplate.findById(req.params.prescriptionTemplate_id, function(err, prescriptionTemplate) {
        PrescriptionTemplate.findById(req.params.prescriptionTemplate_id, function(err, prescriptionTemplate) {
            if (err)
                res.send(err);
            if(prescriptionTemplate)
                res.json(prescriptionTemplate);
            else
                res.json({message:'prescriptionTemplate not found'});
        });
    })
    // update the prescriptionTemplate with this id (accessed at PUT http://localhost:8080/api/prescriptionTemplate/:prescriptionTemplate_id)
    .put(function(req, res) {
        console.log(req);
        // use our bear model to find the bear we want
        //PrescriptionTemplate.findById(req.params.prescriptionTemplate_id, function(err, prescriptionTemplate) {
        PrescriptionTemplate.findById(req.params.prescriptionTemplate_id, function(err, prescriptionTemplate) {

            console.log (req.params.prescriptionTemplate_id);
            console.log(prescriptionTemplate);
            if (err)
                res.send(err);

            if(prescriptionTemplate)
            {
                //update the prescriptionTemplate info
                Update(prescriptionTemplate, req);

                // save the prescriptionTemplate
                prescriptionTemplate.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'PrescriptionTemplate updated!' });
                });
            }
            else
                res.json({message:'prescriptionTemplate not found'});


        });
    })
    // delete the prescriptionTemplate with this id (accessed at PUT http://localhost:8080/api/prescriptionTemplate/:prescriptionTemplate_id)
    .delete(function(req, res) {
        PrescriptionTemplate.remove({
            _id: req.params.prescriptionTemplate_id
        }, function(err, prescriptionTemplate) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for PrescriptionTemplate ends =====================================================


function Update(prescriptionTemplate, req)
{

    prescriptionTemplate.doctorID =  req.body.doctorID;
    prescriptionTemplate.name =  req.body.name;
    prescriptionTemplate.PrescriptionTemplateFields = [];

    console.log(prescriptionTemplate.PrescriptionTemplateFields);

    for(i=0; i<req.body.prescriptionFields.length; ++i)
    {
        console.log(i);
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

        prescriptionTemplate.PrescriptionTemplateFields.push(prescriptionField);
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



