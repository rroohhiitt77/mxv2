var express    = require('express');        // call express

var campUserRESTRouter = express.Router();
var CampUser = require('../models/CampUser');   

module.exports = campUserRESTRouter;

//middleware to use for all requests
campUserRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in CampUser REST router.');
    next(); // make sure we go to the next routes and don't stop here
});


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
campUserRESTRouter.get('/campUserTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our CampUser REST api!' });   
});




campUserRESTRouter.route('/')

// create a campUser (accessed at POST http://localhost:8080/api/campUser)
.post(function(req, res) {
   
	 	//check if mxId already exists for the given campname
	    
		CampUser.find({$and:[{'campNameToUpper' :  req.body.campName.toUpperCase()}, {'mxId':req.body.mxID}]}, function(err, campUser) {
	        if (err)
	            res.send(err);
	        else if(campUser.length > 0)
	        	{
	       	 		res.json({message:'campUser already exists for the given camp :' + req.body.campName });
	       	 		//console.log(campUser);
	       	 		console.log(campUser.length);
	        	}
	        else
	        	{
	        	
		        	var campUser = new CampUser();      // create a new instance of the CampUser model
		    	    
		    	    Update(campUser, req, true);
		    	    
		    	    // save the campUser and check for errors
		    	    campUser.save(function(err) {
		    	        if (err)
		    	            res.send(err);
	
		    	        res.json('CampUser ' + req.body.firstName + ' ' + req.body.lastName + ' successfully created!. MX id is: MX' + campUser.mxId + campUser.mxIdSuffix );
		    	    });
	        	
	        	}
		});
	
		
 
	
   
    
})

// get all the  campUser (accessed at POST http://localhost:8080/api/campUser)
    .get(function(req, res) {
        CampUser.find(function(err, campUsers) {
            if (err)
                res.send(err);

            res.json(campUsers);
        });
    });




//on routes that end in /bears/:bear_id
//----------------------------------------------------
campUserRESTRouter.route('/campName/:campName_id')

 // get the campUser for the given camp name.
 .get(function(req, res) {
	 //CampUser.findById(req.params.campUser_id, function(err, campUser) {
	 
		 console.log('Finding users for camp:' + req.params.campName_id);
			 CampUser.find({'campNameToUpper' :  req.params.campName_id.toUpperCase()}, function(err, campUser) {
		         if (err)
		             res.send(err);
		         if(campUser)
		        	 res.json(campUser);
		         else
		        	 res.json({message:'campUser not found for camp' + req.params.campName_id });
		     });
		 
 });
 

//get a list of all MxIDs and user names
campUserRESTRouter.route('/mxId')
.get(function(req, res) {
	
	CampUser.find(function(err, campUsers) {
        
	    if (err)
            res.send(err);
	     
	    res.json(BuildResultSetfroMxID(campUsers));

    	
    	return;
	});
});

 


//get the campUser with the MXID (accessed at PUT http://localhost:8080/api/campUser/mxId/:mxId)
campUserRESTRouter.route('/mxId/:mxId')
.get(function(req, res) {
	
	 
	 var id = req.params.mxId.toUpperCase();
	 
	 if ( id.indexOf("MX") == 0 && id.indexOf("CUX") > 0)
		 {
		  		var pos = id.lastIndexOf("CUX");
		  		mxId = id.slice(2, pos);
		 	    
		 	     //console.log(mxId + ":" + isNaN(mxId));
		 		 if (isNaN(mxId))
		 		 {
		 			res.json({message:'Invalid MXId'}); 
		 			console.log(mxId + ":" + isNaN(mxId));
		 			return;
		 		 }
		 	     
		 		 CampUser.find({'mxId' : mxId}, function(err, campUser) {
		         
		 	     if (err)
		             res.send(err);
		         
		         //console.log("campuser length:" + campUser.length);
		         if(campUser)
		        	 {
		        	 	res.json(campUser);
		        	 	console.log("camp user found for id:" + id +"," + mxId);
		        	 	console.log(campUser);
		        	 	return;
		        	 }
		         else
		        	 {
		        	 	res.json({message:'campUser not found'});
		        	 	console.log("camp user not found for id:" + id +"," + mxId);
		        	 	return;
		        	 }
		     });
		 
		 }
	 else
		 {
		 		res.json({message:'Invalid MXId'});
		 }
});
 
 // update the campUser with this id (accessed at PUT http://localhost:8080/api/campUser/:campUser_id)
 campUserRESTRouter.route('/:campUser_id')
 
 .get(function(req, res) {
	 
	 
	 var id = req.params.campUser_id;
	 
	 
		     CampUser.findById(id, function(err, campUser) {
		         if (err)
		             res.send(err);
		         if(campUser)
		        	 {
		        	 	res.json(campUser);
		        	 	console.log("user found for id:" + id);
		        	 	return;
		        	 }
		         else
		        	 {
		        	 
		        	 	 res.json({message:'campUser not found'});	
		        	     console.log("user not found for id:" + id);
		        	 	
		        	 }
		     });
		 
 })
 .put(function(req, res) {

        // use our bear model to find the bear we want
        //CampUser.findById(req.params.campUser_id, function(err, campUser) {
    	CampUser.findById(req.params.campUser_id, function(err, campUser) {

    		var commonInfoUpdated = false;
    		//console.log (req.params.campUser_id);
    		//console.log(campUser);
            if (err)
                res.send(err);

            if(campUser)
            {
            	console.log(commonInfoUpdated);
            	//check if any common info has been updated, this will then have to be changed for all records for this mxId
            	var commonInfoUpdated = IsCommonCampUserInfoChanged(campUser, req);
            	console.log(commonInfoUpdated);
            	//if yes update all records for this mxid
            	if(commonInfoUpdated)
            		{
            			UpdateCommonInfo(campUser, req);
            		
            		}
            	
            	//update the campUser info
            	Update(campUser, req, false);
	
	            // save the campUser
	            campUser.save(function(err) {
	                if (err)
	                    res.send(err);
	
	                res.json('CampUser updated!' );
	            });
            }
            else
            	res.json('campUser not found');
            	

        });
    })
    // delete the campUser with this id (accessed at PUT http://localhost:8080/api/campUser/:campUser_id)
    .delete(function(req, res) {
        CampUser.remove({
            _id: req.params.campUser_id
        }, function(err, campUser) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

function Update(campUser, req, newRecord)
{
	campUser.campName =  req.body.campName;
	campUser.firstName = req.body.firstName; 
	campUser.lastName = req.body.lastName;
	campUser.sex = req.body.sex;
	campUser.dob = req.body.dob; 
	campUser.age = req.body.age;
	campUser.weight = req.body.weight;
	campUser.height = req.body.height;
	campUser.bp = req.body.bp;
	campUser.hb = req.body.hb;
	campUser.seenBy = req.body.seenBy;
	campUser.complaint = req.body.complaint;
	campUser.examination = req.body.examination;
	campUser.advise = req.body.advise;
	campUser.comments = req.body.comments;
	campUser.healthCondition = req.body.healthCondition;
	campUser.updatedBy = req.body.updatedBy;
	
	if(newRecord)
		{
			campUser.createdOn = GetCurrentDate();//"12/12/12"
			campUser.createdBy = req.body.createdBy;
			if(req.body.mxID != -1)
				campUser.mxId = req.body.mxID;
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

//used for autocomplete mxid
function BuildResultSetfroMxID(campUsers)
{
	var resultSet = new Array();
	
	for(i in campUsers)
	{
		var arg1 = new Object();
		
		arg1.firstName = ' - ' + campUsers[i].firstName;
		arg1.lastName = campUsers[i].lastName;
		arg1.value = 'MX' + campUsers[i].mxId + campUsers[i].mxIdSuffix;
		arg1.campName = '(' + campUsers[i].campName + ')';
		arg1.id = campUsers[i]._id;
		resultSet.push(arg1);
			
	}
	
	var jsonResultSet = JSON.parse(JSON.stringify(resultSet));
	
	return jsonResultSet;

}

function UpdateCommonInfo(campUser, req)
{
		CampUser.find({'mxId' : campUser.mxId}, function(err, campUsers) {
        
		     if (err)
	            res.send(err);
	        
	        console.log("campuser length - update common info:" + campUsers.length);
	        if(campUsers.length > 1)
	       	 {
	        	
	       	 	for(i in campUsers)
	       	 		{
	       	 			console.log('Updateing:' + campUsers[i]._id);
	       	 			campUsers[i].firstName = req.body.firstName;
	       	 			campUsers[i].lastName = req.body.lastName;
	       	 			campUsers[i].sex = req.body.sex;
	       	 			campUsers[i].dob = req.body.dob;
	       	 			
	       	 		campUsers[i].save(function(err) {
		    	        if (err)
		    	            console.log(err);})
	       	 		
	       	 		}
	       	 	//console.log("camp user found for id:" + campUser.mxId);
	       	 	//console.log(campUser);
	       	 	return;
	       	 }
		});

}

function IsCommonCampUserInfoChanged(campUser, req)
{
	var changed = false;
	changed =  ( 
						   campUser.firstName != req.body.firstName ||  
						   campUser.lastName != req.body.lastName	|| 
						   campUser.dob != req.body.dob	  || 
						   campUser.sex != req.body.sex 
					    );
	
	
	
	return changed;
	

}

