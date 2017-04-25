var express    = require('express');        // call express

var campCommonDoctorExaminationRESTRouter = express.Router();
var CampCommonDoctorExamination = require('../models/CampCommonDoctorExamination');

module.exports = campCommonDoctorExaminationRESTRouter;

//middleware to use for all requests
campCommonDoctorExaminationRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in CampCommonDoctorExamination REST router.');
    next(); // make sure we go to the next routes and don't stop here
});


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
campCommonDoctorExaminationRESTRouter.get('/campCommonDoctorExaminationTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our CampCommonDoctorExamination REST api!' });
});




campCommonDoctorExaminationRESTRouter.route('/')

// create a campCommonDoctorExamination (accessed at POST http://localhost:8080/api/campCommonDoctorExamination)
    .post(function(req, res) {

        CampCommonDoctorExamination.findOne({'doctorExaminationUpper' :  req.body.doctorExamination.toUpperCase().trim() }, function(err, campCommonDoctorExamination) {
            if (err)
                res.send(err);
            else if(campCommonDoctorExamination)
            {
                res.json("Common DoctorExamination: " +  req.body.doctorExamination + " already Exist.");
                //console.log(req.body.name);
            }
            else
            {

                var campCommonDoctorExamination = new CampCommonDoctorExamination();      // create a new instance of the CampCommonDoctorExamination model

                Update(campCommonDoctorExamination, req, true);

                // save the campCommonDoctorExamination and check for errors
                campCommonDoctorExamination.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json('Common DoctorExamination  ' + req.body.doctorExamination + ' successfully created!' );
                });


            }
        });




    })

// get all the  campCommonDoctorExamination (accessed at POST http://localhost:8080/api/campCommonDoctorExamination)
    .get(function(req, res) {
        CampCommonDoctorExamination.find(function(err, campCommonDoctorExaminations) {
            if (err)
                res.send(err);

            res.json(campCommonDoctorExaminations);
        });
    });



function Update(campCommonDoctorExamination, req, newRecord)
{
    campCommonDoctorExamination.doctorExamination = req.body.doctorExamination.trim();
    campCommonDoctorExamination.addedInCamp = req.body.addedInCamp.trim();


    campCommonDoctorExamination.updatedBy = req.body.updatedBy.trim();

    if(newRecord)
    {
        campCommonDoctorExamination.createdOn = GetCurrentDate();//"12/12/12"
        campCommonDoctorExamination.createdBy = req.body.createdBy.trim();
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


