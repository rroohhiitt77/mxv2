var express    = require('express');        // call express

var contactUsRESTRouter = express.Router();
var ContactUs = require('../models/ContactUs');   

module.exports = contactUsRESTRouter;

//middleware to use for all requests
contactUsRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in ContactUs REST router.');
    next(); // make sure we go to the next routes and don't stop here
});


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
contactUsRESTRouter.get('/contactUsTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our ContactUs REST api!' });   
});




contactUsRESTRouter.route('/:source')

// create a contactUs (accessed at POST http://localhost:8080/api/contactUs)
.post(function(req, res) {
   
	 var contactUs = new ContactUs();      // create a new instance of the ContactUs model
	    
	    var source = req.params.source;  
	    Update(contactUs, req, source, true);
	    
	    // save the contactUs and check for errors
	    contactUs.save(function(err) {
	        if (err)
	            res.send(err);

	        res.json('Thanks for your feedback.' );
	    });
 
	
   
    
});
contactUsRESTRouter.route('/')

// get all the  contactUs (accessed at POST http://localhost:8080/api/contactUs)
    .get(function(req, res) {
        ContactUs.find(function(err, contactUss) {
            if (err)
                res.send(err);

            res.json(contactUss);
        });
    });



function Update(contactUs, req, source, newRecord)
{
	contactUs.name =  req.body.name;
	contactUs.subject = req.body.subject; 
	contactUs.email = req.body.email;
	contactUs.feedback = req.body.feedback;
	contactUs.source = source;
		
	console.log(req);
	
	if(newRecord)
		{
			contactUs.createdOn = GetCurrentDate();//"12/12/12"
			contactUs.createdBy = req.body.createdBy;
		}
			
		
}

//Need to review this..not working correctly
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


