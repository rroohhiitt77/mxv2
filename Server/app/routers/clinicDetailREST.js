var express    = require('express');        // call express

var clinicDetailRESTRouter = express.Router();
var ClinicDetail = require('../models/Clinic');
var Doctor = require('../models/Doctor');

module.exports = clinicDetailRESTRouter;

//middleware to use for all requests
clinicDetailRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in ClinicDetail REST router.');
    next(); // make sure we go to the next routes and don't stop here
});


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
clinicDetailRESTRouter.get('/clinicDetailTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our ClinicDetail REST api!' });
});




clinicDetailRESTRouter.route('/')

// create a clinicDetail (accessed at POST http://localhost:8080/api/clinicDetail)
    .post(function(req, res) {

        ClinicDetail.findOne({'nameToUpper' :  req.body.name.toUpperCase() }, function(err, clinicDetail) {
            if (err)
                res.send(err);
            else if(clinicDetail)
            {
                res.status(500).json(
                    {'error' : "Clinic: " +  req.body.name + " already Exist."}
                );
                console.log(req.body.name);
            }
            else
            {

                var clinicDetail = new ClinicDetail();      // create a new instance of the ClinicDetail model

                Update(clinicDetail, req, true);

                // save the clinicDetail and check for errors
                clinicDetail.save(function(err) {
                    if (err)
                        res.send(err);

                    res.status(200).json(
                        {'message': 'ClinicDetail for clinic ' + req.body.name + ' successfully created!' }
                    );
                });


            }
        });




    })

// get all the  clinicDetail (accessed at POST http://localhost:8080/api/clinicDetail)
    .get(function(req, res) {
        ClinicDetail.find(function(err, clinicDetails) {
            if (err)
                res.send(err);

            res.json(clinicDetails);
        });
    });




//get a list of all MxIDs and user names, if doc id given get only for this doctor
clinicDetailRESTRouter.route('/seqId')
    .get(function(req, res) {
        if(req.query.doctorID && req.query.doctorID != 'null') {
            var doctorID = req.query.doctorID;
            //get the clinics for this doctor
            Doctor
                .findById(doctorID)
                .select({clinics: 1})
                .exec(function (err, doctor) {
                    //get all the clinic ids
                    var clinicIDs = GetClinicIDsForDoctor(doctor);
                    ClinicDetail
                        .find({_id: {$in: clinicIDs}})
                        .exec(function (err, details) {
                            if (err)
                                res.status(500).send(err);
                            res.status(200).json(BuildResultSetfroMxID(details));
                            return;
                        });
                });
        }
        else{
            ClinicDetail.find(function (err, details) {
                    if (err)
                        res.status(500).send(err);
                    res.status(200).json(BuildResultSetfroMxID(details));
                    return;
                });
        }


    });



//on routes that end in /clinicDetail/:clinicDetail_id
//----------------------------------------------------
clinicDetailRESTRouter.route('/:clinicDetail_id')

    // get the clinicDetail with that id (accessed at GET http://localhost:8080/api/clinicDetail/:clinicDetail_id)
    .get(function(req, res) {
        //ClinicDetail.findById(req.params.clinicDetail_id, function(err, clinicDetail) {
        //ClinicDetail.find({'createdBy' :  req.params.clinicDetail_id }, function(err, clinicDetail) {
        //Temporary fix..get all the clinics
        ClinicDetail.find(function(err, clinicDetail) {
            if (err)
                res.send(err);
            if(clinicDetail)
                res.json(clinicDetail);
            else
                res.json({message:'clinicDetail not found'});
        });
    });



// update the clinicDetail with this id (accessed at PUT http://localhost:8080/api/clinicDetail/:clinicDetail_id)
clinicDetailRESTRouter.route('/clinic/:clinicDetail_id')
    // get the clinicDetail with that id (accessed at GET http://localhost:8080/api/clinicDetail/:clinicDetail_id)
    .get(function(req, res) {
        //ClinicDetail.findById(req.params.clinicDetail_id, function(err, clinicDetail) {
        ClinicDetail.findById(req.params.clinicDetail_id, function(err, clinicDetail) {
            if (err)
                res.send(err);
            if(clinicDetail)
                res.json(clinicDetail);
            else
                res.json({message:'clinicDetail not found'});
        });
    })
    .put(function(req, res) {

        // use our bear model to find the bear we want
        //ClinicDetail.findById(req.params.clinicDetail_id, function(err, clinicDetail) {
        ClinicDetail.findById(req.params.clinicDetail_id, function(err, clinicDetail) {

            //console.log (req.params.clinicDetail_id);
            //console.log(clinicDetail);
            if (err)
                res.send(err);

            if(clinicDetail)
            {
                //update the clinicDetail info
                Update(clinicDetail, req, false);

                // save the clinicDetail
                clinicDetail.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json('ClinicDetail updated!' );
                });
            }
            else
                res.json('clinicDetail not found');


        });
    })
    // delete the clinicDetail with this id (accessed at PUT http://localhost:8080/api/clinicDetail/:clinicDetail_id)
    .delete(function(req, res) {
        ClinicDetail.remove({
            _id: req.params.clinicDetail_id
        }, function(err, clinicDetail) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

function Update(clinicDetail, req, newRecord)
{
    clinicDetail.name = req.body.name;
    clinicDetail.clinicDescription = req.body.clinicDescription;
    clinicDetail.address1 = req.body.address1;
    clinicDetail.address2 = req.body.address2;
    clinicDetail.city = req.body.city;
    clinicDetail.state = req.body.state;
    clinicDetail.pincode = req.body.pincode;
    clinicDetail.country = req.body.country;
    clinicDetail.phone1 = req.body.phone1;
    clinicDetail.phone2 = req.body.phone2;
    clinicDetail.website = req.body.website;
    clinicDetail.email = req.body.email;

    //doctors  //todo:proper way to handle many to mny relationship in mongo with data sync
    //Post.find({ postedBy : alex._id }).remove().exec();



    //working hours
    clinicDetail.workingHours = [];
    for(var i=0; i<req.body.workingHours.length; ++i)
    {
        workingHour = req.body.workingHours[i];
        clinicDetail.workingHours.push(
            {
                dayOfWeek : workingHour.dayOfWeek,
                timeFrom : workingHour.timeFrom,
                timeTo : workingHour.timeTo
            }
        )

    }


    clinicDetail.services = req.body.services;
    clinicDetail.specializations = req.body.specializations;
    clinicDetail.registrations = req.body.registrations;
    clinicDetail.comments = req.body.comments;

    clinicDetail.updatedBy = req.body.updatedBy;

    if(newRecord)
    {
        clinicDetail.createdOn = GetCurrentDate();//"12/12/12"
        clinicDetail.createdBy = req.body.createdBy;

    }
}

function GetCurrentDate()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    var today = mm+'/'+dd+'/'+yyyy;

    return today;
}


//used for autocomplete mxid
function BuildResultSetfroMxID(details)
{
    var resultSet = new Array();

    for(i in details)
    {
        var arg1 = new Object();

        arg1.nameToUpper = details[i].nameToUpper;
        arg1.city = details[i].city;
        arg1.value = 'MX' + details[i].mxId + details[i].mxIdSuffix;
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
        else if(key == 'date')
        {
            query[key] = GetDateFormatted(new Date(value));
        }
        else if(key == 'type')
        {
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

function GetClinicIDsForDoctor(doctor){

    var ids = [];
    for(var clinicNumber= 0; clinicNumber < doctor.clinics.length; clinicNumber++){
        ids.push(doctor.clinics[clinicNumber].id)
    }

    return ids;

}

