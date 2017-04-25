var express    = require('express');        // call express

var campCommonProblemRESTRouter = express.Router();
var CampCommonProblem = require('../models/CampCommonProblem');   

module.exports = campCommonProblemRESTRouter;

//middleware to use for all requests
campCommonProblemRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in CampCommonProblem REST router.');
    next(); // make sure we go to the next routes and don't stop here
});


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
campCommonProblemRESTRouter.get('/campCommonProblemTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our CampCommonProblem REST api!' });   
});




campCommonProblemRESTRouter.route('/')

// create a campCommonProblem (accessed at POST http://localhost:8080/api/campCommonProblem)
.post(function(req, res) {
	
	 CampCommonProblem.findOne({'problemUpper' :  req.body.problem.toUpperCase().trim() }, function(err, campCommonProblem) {
         if (err)
             res.send(err);
         else if(campCommonProblem)
        	 {
        	 	res.json("Common Problem: " +  req.body.problem + " already Exist.");
        	 	//console.log(req.body.name);
        	 }
         else
        	 {
        	 
        	 	var campCommonProblem = new CampCommonProblem();      // create a new instance of the CampCommonProblem model
        	    
        	    Update(campCommonProblem, req, true);
        	    
        	    // save the campCommonProblem and check for errors
        	    campCommonProblem.save(function(err) {
        	        if (err)
        	            res.send(err);

        	        res.json('Common Problem  ' + req.body.problem + ' successfully created!' );
        	    });

        	 
        	 }
      });
 
	
   
    
})

// get all the  campCommonProblem (accessed at POST http://localhost:8080/api/campCommonProblem)
    .get(function(req, res) {
        CampCommonProblem.find(function(err, campCommonProblems) {
            if (err)
                res.send(err);

            res.json(campCommonProblems);
        });
    });



function Update(campCommonProblem, req, newRecord)
{
	campCommonProblem.problem = req.body.problem.trim(); 
	campCommonProblem.addedInCamp = req.body.addedInCamp.trim(); 
	campCommonProblem.severity = req.body.severity.trim();
	
	campCommonProblem.updatedBy = req.body.updatedBy.trim();
	
	if(newRecord)
		{
			campCommonProblem.createdOn = GetCurrentDate();//"12/12/12"
			campCommonProblem.createdBy = req.body.createdBy.trim();
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


