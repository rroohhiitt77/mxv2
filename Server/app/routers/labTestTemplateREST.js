var express    = require('express');        // call express
var labTestTemplateRESTRouter = express.Router();
var LabTestTemplate = require('../models/LabTestTemplate');

module.exports = labTestTemplateRESTRouter;

//middleware to use for all requests
labTestTemplateRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in LabTestTemplate REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
labTestTemplateRESTRouter.get('/labTestTemplateTest', function(req, res) {
    ParseLabTestTemplateCodes();
    res.json({ message: 'hooray! welcome to our LabTestTemplate REST api!' });
});

//============================== BASIC CRUD for LabTestTemplate starts =====================================================
labTestTemplateRESTRouter.route('/')

// create a labTestTemplate (accessed at POST http://localhost:8080/api/labTestTemplate)
    .post(function(req, res) {

        var labTestTemplate = new LabTestTemplate();      // create a new instance of the LabTestTemplate model

        Update(labTestTemplate, req);
        // save the labTestTemplate and check for errors
        labTestTemplate.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'LabTestTemplate created!' });
        });
    })

// get all the  labTestTemplate (accessed at POST http://localhost:8080/api/labTestTemplate)
    .get(function(req, res) {

        LabTestTemplate.find( GetQuery(req) ,function(err, labTestTemplates) {
            if (err)
                res.send(err);

            res.json(labTestTemplates);
        });
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
labTestTemplateRESTRouter.route('/:labTestTemplate_id')

    // get the labTestTemplate with that id (accessed at GET http://localhost:8080/api/labTestTemplate/:labTestTemplate_id)
    .get(function(req, res) {
        //LabTestTemplate.findById(req.params.labTestTemplate_id, function(err, labTestTemplate) {
        LabTestTemplate.findById(req.params.labTestTemplate_id, function(err, labTestTemplate) {
            if (err)
                res.send(err);
            if(labTestTemplate)
                res.json(labTestTemplate);
            else
                res.json({message:'labTestTemplate not found'});
        });
    })
    // update the labTestTemplate with this id (accessed at PUT http://localhost:8080/api/labTestTemplate/:labTestTemplate_id)
    .put(function(req, res) {
        console.log(req);
        // use our bear model to find the bear we want
        //LabTestTemplate.findById(req.params.labTestTemplate_id, function(err, labTestTemplate) {
        LabTestTemplate.findById(req.params.labTestTemplate_id, function(err, labTestTemplate) {

            console.log (req.params.labTestTemplate_id);
            console.log(labTestTemplate);
            if (err)
                res.send(err);

            if(labTestTemplate)
            {
                //update the labTestTemplate info
                Update(labTestTemplate, req);

                // save the labTestTemplate
                labTestTemplate.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'LabTestTemplate updated!' });
                });
            }
            else
                res.json({message:'labTestTemplate not found'});


        });
    })
    // delete the labTestTemplate with this id (accessed at PUT http://localhost:8080/api/labTestTemplate/:labTestTemplate_id)
    .delete(function(req, res) {
        LabTestTemplate.remove({
            _id: req.params.labTestTemplate_id
        }, function(err, labTestTemplate) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for LabTestTemplate ends =====================================================


function Update(labTestTemplate, req)
{

    labTestTemplate.doctorID =  req.body.doctorID;
    labTestTemplate.name =  req.body.name;
    labTestTemplate.labTestTemplateFields = [];

    //console.log(labTestTemplate.labTestTemplateFields);

    for(i=0; i<req.body.labTestFields.length; ++i)
    {
        console.log(i);
        pf = req.body.labTestFields[i];

        var labTestField = {
            testName : pf.testName,
            prefferedLab : pf.prefferedLab,
            instruction : pf.instruction,

        }

        labTestTemplate.labTestTemplateFields.push(labTestField);
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



