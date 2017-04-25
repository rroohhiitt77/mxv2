var express    = require('express');        // call express

var campDetailRESTRouter = express.Router();
var CampDetail = require('../models/CampDetail');   

module.exports = campDetailRESTRouter;

//middleware to use for all requests
campDetailRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in CampDetail REST router.');
    next(); // make sure we go to the next routes and don't stop here
});


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
campDetailRESTRouter.get('/campDetailTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our CampDetail REST api!' });   
});




campDetailRESTRouter.route('/')

// create a campDetail (accessed at POST http://localhost:8080/api/campDetail)
.post(function(req, res) {
    
	 CampDetail.findOne({'nameToUpper' :  req.body.name.toUpperCase() }, function(err, campDetail) {
         if (err)
             res.send(err);
         else if(campDetail)
        	 {
        	 	res.json("Camp: " +  req.body.name + " already Exist.");
        	 	console.log(req.body.name);
        	 }
         else
        	 {
        	 
        	 	var campDetail = new CampDetail();      // create a new instance of the CampDetail model
        	    
        	    Update(campDetail, req, true);
        	    
        	    // save the campDetail and check for errors
        	    campDetail.save(function(err) {
        	        if (err)
        	            res.send(err);

        	        res.json('CampDetail for camp ' + req.body.name + ' successfully created!' );
        	    });

        	 
        	 }
      });
 
	
   
    
})

// get all the  campDetail (accessed at POST http://localhost:8080/api/campDetail)
    .get(function(req, res) {
        CampDetail.find(function(err, campDetails) {
            if (err)
                res.send(err);

            res.json(campDetails);
        });
    });




//on routes that end in /bears/:bear_id
//----------------------------------------------------
campDetailRESTRouter.route('/:campDetail_id')

 // get the campDetail with that id (accessed at GET http://localhost:8080/api/campDetail/:campDetail_id)
 .get(function(req, res) {
	 //CampDetail.findById(req.params.campDetail_id, function(err, campDetail) {
	 //CampDetail.find({'createdBy' :  req.params.campDetail_id }, function(err, campDetail) {
	 //Temporary fix..get all the camps
	 CampDetail.find(function(err, campDetail) {
         if (err)
             res.send(err);
         if(campDetail)
        	 res.json(campDetail);
         else
        	 res.json({message:'campDetail not found'});
     });
 });
 
 
 
 // update the campDetail with this id (accessed at PUT http://localhost:8080/api/campDetail/:campDetail_id)
 campDetailRESTRouter.route('/camp/:campDetail_id')
 // get the campDetail with that id (accessed at GET http://localhost:8080/api/campDetail/:campDetail_id)
 .get(function(req, res) {
	 //CampDetail.findById(req.params.campDetail_id, function(err, campDetail) {
	 CampDetail.findById(req.params.campDetail_id, function(err, campDetail) {
         if (err)
             res.send(err);
         if(campDetail)
        	 res.json(campDetail);
         else
        	 res.json({message:'campDetail not found'});
     });
 })
 .put(function(req, res) {

        // use our bear model to find the bear we want
        //CampDetail.findById(req.params.campDetail_id, function(err, campDetail) {
    	CampDetail.findById(req.params.campDetail_id, function(err, campDetail) {

    		//console.log (req.params.campDetail_id);
    		//console.log(campDetail);
            if (err)
                res.send(err);

            if(campDetail)
            {
            //update the campDetail info
            	Update(campDetail, req, false);
	
	            // save the campDetail
	            campDetail.save(function(err) {
	                if (err)
	                    res.send(err);
	
	                res.json('CampDetail updated!' );
	            });
            }
            else
            	res.json('campDetail not found');
            	

        });
    })
    // delete the campDetail with this id (accessed at PUT http://localhost:8080/api/campDetail/:campDetail_id)
    .delete(function(req, res) {
        CampDetail.remove({
            _id: req.params.campDetail_id
        }, function(err, campDetail) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

function Update(campDetail, req, newRecord)
{
	campDetail.name = req.body.name; 
	campDetail.address1 = req.body.address1; 
	campDetail.address2 = req.body.address2;
	campDetail.city = req.body.city;
	campDetail.state = req.body.state;
	campDetail.pincode = req.body.pincode;
	campDetail.country = req.body.country;
	campDetail.campFinding = req.body.campFinding;
	
	campDetail.date = req.body.date;
	campDetail.timeFrom = req.body.timeFrom; 
	campDetail.timeTo = req.body.timeTo;
	campDetail.expectedPatients = req.body.expectedPatients; 
	campDetail.actualPatients = req.body.actualPatients;
	campDetail.doctors = req.body.doctors;
	campDetail.comments = req.body.comments;
	
	campDetail.conductedByOrganisation = req.body.conductedByOrganisation;
	campDetail.conductedByPrimaryName = req.body.conductedByPrimaryName;
	campDetail.conductedByPrimaryEmail = req.body.conductedByPrimaryEmail;
	campDetail.conductedByPrimaryPhone = req.body.conductedByPrimaryPhone;
	
	campDetail.conductedForOrganisation = req.body.conductedForOrganisation;
	campDetail.conductedForPrimaryName = req.body.conductedForPrimaryName;
	campDetail.conductedForPrimaryEmail = req.body.conductedForPrimaryEmail;
	campDetail.conductedForPrimaryPhone = req.body.conductedForPrimaryPhone;
	
	campDetail.conductedAtOrganisation = req.body.conductedAtOrganisation;
	campDetail.conductedAtPrimaryName = req.body.conductedAtPrimaryName;
	campDetail.conductedAtPrimaryEmail = req.body.conductedAtPrimaryEmail;
	campDetail.conductedAtPrimaryPhone = req.body.conductedAtPrimaryPhone;
	
	campDetail.updatedBy = req.body.updatedBy;
	
	if(newRecord)
		{
			campDetail.createdOn = GetCurrentDate();//"12/12/12"
			campDetail.createdBy = req.body.createdBy;
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


