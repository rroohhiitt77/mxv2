var express    = require('express');        // call express
var patientCaseRESTRouter = express.Router();
var PatientCase = require('../models/PatientCase');
var mongoose = require('mongoose');

module.exports = patientCaseRESTRouter;

//middleware to use for all requests
patientCaseRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in PatientCase REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
patientCaseRESTRouter.get('/patientCaseTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our PatientCase REST api!' });   
});

patientCaseRESTRouter.route('/getLatestCases')

// get all the  patientCase (accessed at POST http://localhost:8080/api/patientCase)
    .get(function(req, res) {
        var obj = ParseQueryString(req);
        //first get all distinct titles and last record for each title
        PatientCase.aggregate(

                {$match:
                {'patientID': new mongoose.Types.ObjectId(obj.query.patientID),
                  'doctorID' : new mongoose.Types.ObjectId(obj.query.doctorID)
                }
                },
                { $sort: { created: 1, title: 1 } },
                {
                    $group:
                    {
                        _id: "$title",
                        created: { $last: "$created" },

                    }
                },
               function(err, patientcases) {
                if (err)
                    res.status(500).send(err);


                   //now retirive results for last record for each case
                   var titleArray = patientcases.map(function(a) {return a._id;});
                   var createdArray = patientcases.map(function(a) {return a.created;});

                   PatientCase
                       .find(
                       {'patientID': new mongoose.Types.ObjectId(obj.query.patientID),
                        'doctorID' : new mongoose.Types.ObjectId(obj.query.doctorID),
                        'title' : {$in : titleArray},
                        'created' : {$in : createdArray}

                       })
                       .select(obj.selectFields)
                       .sort({'created':-1})
                       .exec(function (err, patientCases1) {
                           if (err)
                               res.status(500).send(err);

                           res.status(200).json(patientCases1);
                       });

                //res.status(200).json(patientcases);
            }

        )

    });


//============================== BASIC CRUD for PatientCase starts =====================================================
patientCaseRESTRouter.route('/')

// create a patientCase (accessed at POST http://localhost:8080/api/patientCase)
.post(function(req, res) {

    var patientCase = new PatientCase();      // create a new instance of the PatientCase model
    Update(patientCase, req);
    // save the patientCase and check for errors
    patientCase.save(function(err) {
        if (err)
            res.status(500).send(err);

        res.status(200).json({ message: 'PatientCase created!' });
    });

    
})

// get all the  patientCase (accessed at POST http://localhost:8080/api/patientCase)
    .get(function(req, res) {
        var obj = ParseQueryString(req);
        if(obj.sort.length > 0 && obj.sortOrder.length > 0) {
            PatientCase
                .find(obj.query)
                .select(obj.selectFields)
                .sort([[obj.sort, obj.sortOrder]])
                .exec(function (err, patientCases) {
                    if (err)
                        res.send(err);

                    res.json(patientCases);
                });
        }
        else
        {
            PatientCase
                .find(obj.query)
                .select(obj.selectFields)
                .exec(function (err, patientCases) {
                    if (err)
                        res.send(err);

                    res.json(patientCases);
                });
        }
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
patientCaseRESTRouter.route('/:patientCase_id')

 // get the patientCase with that id (accessed at GET http://localhost:8080/api/patientCase/:patientCase_id)
 .get(function(req, res) {
	 //PatientCase.findById(req.params.patientCase_id, function(err, patientCase) {
	 PatientCase.findById(req.params.patientCase_id, function(err, patientCase) {
         if (err)
             res.status(500).send(err);
         if(patientCase)
        	 res.status(200).json(patientCase);
         else
        	 res.status(200).json({message:'patientCase not found'});
     });
 })
 // update the patientCase with this id (accessed at PUT http://localhost:8080/api/patientCase/:patientCase_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        //PatientCase.findById(req.params.patientCase_id, function(err, patientCase) {
        PatientCase.findById(req.params.patientCase_id, function(err, patientCase) {

    		//console.log (req.params.patientCase_id);
    		//console.log(patientCase);
            if (err)
                res.status(500).send(err);

            if(patientCase)
            {
            //update the patientCase info
            	Update(patientCase, req);
	
	            // save the patientCase
	            patientCase.save(function(err) {
	                if (err)
	                    res.status(500).send(err);
	
	                res.status(200).json({ message: 'PatientCase updated!' });
	            });
            }
            else
            	res.status(500).json({message:'patientCase not found'});
            	

        });
    })
    // delete the patientCase with this id (accessed at PUT http://localhost:8080/api/patientCase/:patientCase_id)
    .delete(function(req, res) {
        PatientCase.remove({
            _id: req.params.patientCase_id
        }, function(err, patientCase) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for PatientCase ends =====================================================


function Update(patientCase, req)
{
	    patientCase.doctorID =  req.body.doctorID;
		patientCase.patientID  =  req.body.patientID;
		patientCase.title  =  req.body.title;
        patientCase.description  =  req.body.description;
        patientCase.complaints  =  req.body.complaints;
		patientCase.symptoms =  req.body.symptoms;
		patientCase.diagnosis =  req.body.diagnosis;
		patientCase.docNotes =  req.body.docNotes;

        patientCase.prescription = [];

        if(req.body.prescription && req.body.prescription.length>0) {
            for (i = 0; i < req.body.prescription.length; ++i) {
                pf = req.body.prescription[i];
                var prescriptionField = {
                    drugName: pf.drugName,
                    strength: pf.strength,
                    duration: pf.duration,
                    morning: pf.morning,
                    afternoon: pf.afternoon,
                    night: pf.night,
                    instruction: pf.instruction,
                    beforeFood: pf.beforeFood,
                    afterFood: pf.afterFood
                }

                patientCase.prescription.push(prescriptionField);
            }
        }

        patientCase.labTests = [];

        //console.log(labTestPatient.labTestPatientFields);
        if(req.body.labTests && req.body.labTests.length>0) {
            for (i = 0; i < req.body.labTests.length; ++i) {
                //console.log(i);
                var lt = req.body.labTests[i];

                var labTestField = {
                    testName: lt.testName,
                    prefferedLab: lt.prefferedLab,
                    instructions: lt.instructions
                }
                patientCase.labTests.push(labTestField);
            }
        }
}


//Key words are sort, sortOrder, selectFields.  Everything else goes into filter query
function ParseQueryString(req)
{
    var returnObj = {};
    returnObj.selectFields = '';
    returnObj.sortOrder = '';
    returnObj.sort = '';

    var obj = req.query;
    var query = {};
    var subQuery = {};

    Object.keys(obj).forEach(function(key) {
        if(key =='selectFields') {
            returnObj.selectFields = obj[key];
        }
        else if(key =='sortOrder') {
            returnObj.sortOrder = obj[key];
        }
        else if(key =='sort') {
            returnObj.sort = obj[key];
        }
        else{
            value = obj[key];
            query[key] = value;
        }
    });
    returnObj.query = query;
    console.log(query);
    console.log(returnObj);
    return returnObj;
}

function GetQuery(req)
{
    var obj = req.query;
    var query = {};
    var subQuery = {};
    var dateLeft = null;
    var dateRight = null;

    Object.keys(obj).forEach(function(key) {
        if(key !='selectFields' && key!='sort' && key != 'sortOrder') {
            value = obj[key];
            if(key.toLowerCase() == 'dateleft')
            {
                dateLeft = value;
            }
            else if(key.toLowerCase() == 'dateright')
            {
                dateRight = value;
            }
            else
            {
                query[key] = value;
            }

            if(dateLeft!=null && dateRight!=null)
            {
                query["updatedOn"] = {
                    '$gte': new Date(dateLeft.replace(/"/g,"")),
                    '$lte': new Date(dateRight.replace(/"/g,""))}
            }
        }
    });
    console.log(query);
    return query;
}

function GetSelectFields(req)
{
    var obj = req.query;
    var value = '';

    Object.keys(obj).forEach(function(key) {
        if(key =='selectFields') {
            value = obj[key];
        }
    });
    console.log(value);
    return value;
}

function GetSortFields(req)
{
    var obj = req.query;
    var value = '';

    Object.keys(obj).forEach(function(key) {
        if(key =='sort') {
            value = obj[key];
        }
    });
    console.log(value);
    return value;
}

function GetSortOrder(req)
{
    var obj = req.query;
    var value = '';

    Object.keys(obj).forEach(function(key) {
        if(key =='sortOrder') {
            value = obj[key];
        }
    });
    console.log(value);
    return value;
}