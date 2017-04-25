var express    = require('express');        // call express

var campCommonDoctorAdviseRESTRouter = express.Router();
var CampCommonDoctorAdvise = require('../models/CampCommonDoctorAdvise');

module.exports = campCommonDoctorAdviseRESTRouter;

//middleware to use for all requests
campCommonDoctorAdviseRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in CampCommonDoctorAdvise REST router.');
    next(); // make sure we go to the next routes and don't stop here
});


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
campCommonDoctorAdviseRESTRouter.get('/campCommonDoctorAdviseTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our CampCommonDoctorAdvise REST api!' });
});




campCommonDoctorAdviseRESTRouter.route('/')

// create a campCommonDoctorAdvise (accessed at POST http://localhost:8080/api/campCommonDoctorAdvise)
    .post(function(req, res) {

        CampCommonDoctorAdvise.findOne({'doctorAdviseUpper' :  req.body.doctorAdvise.toUpperCase().trim() }, function(err, campCommonDoctorAdvise) {
            if (err)
                res.send(err);
            else if(campCommonDoctorAdvise)
            {
                res.json("Common DoctorAdvise: " +  req.body.doctorAdvise + " already Exist.");
                //console.log(req.body.name);
            }
            else
            {

                var campCommonDoctorAdvise = new CampCommonDoctorAdvise();      // create a new instance of the CampCommonDoctorAdvise model

                Update(campCommonDoctorAdvise, req, true);

                // save the campCommonDoctorAdvise and check for errors
                campCommonDoctorAdvise.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json('Common DoctorAdvise  ' + req.body.doctorAdvise + ' successfully created!' );
                });


            }
        });




    })

// get all the  campCommonDoctorAdvise (accessed at POST http://localhost:8080/api/campCommonDoctorAdvise)
    .get(function(req, res) {
        CampCommonDoctorAdvise.find(function(err, campCommonDoctorAdvises) {
            if (err)
                res.send(err);

            res.json(campCommonDoctorAdvises);
        });
    });



function Update(campCommonDoctorAdvise, req, newRecord)
{
    campCommonDoctorAdvise.doctorAdvise = req.body.doctorAdvise.trim();
    campCommonDoctorAdvise.addedInCamp = req.body.addedInCamp.trim();


    campCommonDoctorAdvise.updatedBy = req.body.updatedBy.trim();

    if(newRecord)
    {
        campCommonDoctorAdvise.createdOn = GetCurrentDate();//"12/12/12"
        campCommonDoctorAdvise.createdBy = req.body.createdBy.trim();
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


