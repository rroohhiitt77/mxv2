var express    = require('express');        // call express
var doctorRESTRouter = express.Router();
var Doctor = require('../models/Doctor');
var aws = require('aws-sdk');
var url = require('url');

module.exports = doctorRESTRouter;

//middleware to use for all requests
doctorRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in Doctor REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
doctorRESTRouter.get('/doctorTest', function(req, res) {
    res.json({ message: 'hooray! welcome to our Doctor REST api!' });   
});

doctorRESTRouter.route('/getSignedURL')
    // Get he AWS signed URL
    .post(function(req, res)
    {
        //this is the file path on AWS
        var key = process.env.ENVIRONMENT+ '_'+ req.body.source + '/'
            + req.body.mxID +'/'
            + req.body.directory + '/' +  req.body.fileName;

        aws.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            signatureVersion: 'v4',
            region: 'ap-southeast-1'
        });

        // now say you want fetch a URL for an object named `objectName`
        var s3 = new aws.S3();
        var s3_params = {
            Bucket: 'medixprt',
            Key: key,
            Expires: 300,  //300 seconds expiry time for url
            ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3_params, function (err, signedUrl) {
            // send signedUrl back to client
            if(err)
                res.status(500).json(
                    {
                        'error' : err
                    }
                )
            else {

                //You'll probably want to know the URL to GET your object to (typically if it's an image).
                // To do this, I simply removed the query string from the URL:
                var parsedUrl = url.parse(signedUrl);
                parsedUrl.search = null;
                var objectUrl = url.format(parsedUrl);
                //console.log('objectUrl');console.log(objectUrl);

                res.status(200).json(
                    {
                        'signedUrl': signedUrl ,
                        'url': objectUrl
                    }
                );
            }
        });
    });


//get a list of all MxIDs and user names
doctorRESTRouter.route('/testData/:id')
    .get(function(req, res) {
        //create number of test records
        for(var i = 0; i<req.params.id; i++)
        {
            var doctor = new Doctor();      // create a new instance of the Doctor model
            CreateTestDoctor(doctor, i);
            console.log(doctor);
            //save the doctor and check for errors
            doctor.save(function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            });
        }
        res.json(req.params.id + " doctors created");
    });


//get a list of all MxIDs and user names
doctorRESTRouter.route('/seqId')
    .get(function(req, res) {
        console.log('a');
        Doctor.find(function(err, details) {
            if (err)
                res.send(err);
            //console.log(details);
            res.json(BuildResultSetfroMxID(details));
            console.log(BuildResultSetfroMxID(details));
            return;
        });
    });


// get the doctors by specialization

doctorRESTRouter.route('/specialization/:id')
// get the doctors by specialization
    .get(function(req, res) {

        console.log('Finding doctors by specialization:' + req.params.id);
        Doctor.find({'specializationsToUpper' :  req.params.id.toUpperCase()}, function(err, data) {
            if (err)
                res.send(err);
            if(data)
                res.json(data);
            else
                res.json({message:'doctor not found for specialization' + req.params.id });
        });

    });



//============================== BASIC CRUD for Doctor starts =====================================================
doctorRESTRouter.route('/')

// create a doctor (accessed at POST http://localhost:8080/api/doctor)
.post(function(req, res) {
    
    var doctor = new Doctor();      // create a new instance of the Doctor model
    
    Update(doctor, req);
    
    // save the doctor and check for errors
    doctor.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Doctor created!' });
    });

    
})

// get all the  doctor (accessed at POST http://localhost:8080/api/doctor)
    .get(function(req, res) {

        Doctor
            .find( GetQuery(req))
            .populate('clinics.id')
            .exec(function(err, doctors) {
            if (err)
                res.send(err);

            res.json(doctors);
        });
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
doctorRESTRouter.route('/:doctor_id')

 // get the doctor with that id (accessed at GET http://localhost:8080/api/doctor/:doctor_id)
 .get(function(req, res) {
	 //Doctor.findById(req.params.doctor_id, function(err, doctor) {
	 Doctor.findById(req.params.doctor_id, function(err, doctor) {
         if (err)
             res.send(err);
         if(doctor)
        	 res.json(doctor);
         else
        	 res.json({message:'doctor not found'});
     });
 })
 // update the doctor with this id (accessed at PUT http://localhost:8080/api/doctor/:doctor_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        //Doctor.findById(req.params.doctor_id, function(err, doctor) {
        Doctor.findById(req.params.doctor_id, function(err, doctor) {

    		//console.log (req.params.doctor_id);
    		//console.log(doctor);
            if (err)
                res.send(err);

            if(doctor)
            {
            //update the doctor info
            	Update(doctor, req);
	
	            // save the doctor
	            doctor.save(function(err) {
	                if (err)
	                    res.send(err);
	
	                res.json({ message: 'Doctor updated!' });
	            });
            }
            else
            	res.json({message:'doctor not found'});
            	

        });
    })
    // delete the doctor with this id (accessed at PUT http://localhost:8080/api/doctor/:doctor_id)
    .delete(function(req, res) {
        Doctor.remove({
            _id: req.params.doctor_id
        }, function(err, doctor) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for Doctor ends =====================================================




function Update(doctor, req)
{
    console.log(req.body);

    doctor.firstName =  req.body.firstName;
    doctor.middleName  =  req.body.middleName;
    doctor.lastName  =  req.body.lastName;
    doctor.phoneNumber =  req.body.phoneNumber;
    doctor.email =  req.body.email;
    doctor.website = req.body.website;
    if(req.body.yearsOfExperience)
        doctor.yearsOfExperience.value = req.body.yearsOfExperience.value;
    doctor.profileDescription = req.body.profileDescription;
    doctor.address1 =  req.body.address1;
    doctor.address2 =  req.body.address2;
    doctor.city = req.body.city;
    doctor.state = req.body.state;
    doctor.country = req.body.country;
    doctor.pincode = req.body.pincode;

    doctor.phone1 = req.body.phone1;
    doctor.phone2 = req.body.phone2;
    doctor.services = req.body.services;
    doctor.specializations = req.body.specializations;
    doctor.registrations = req.body.registrations;

    //clinics
    doctor.clinics = [];
    for(i=0; i<req.body.clinics.length; i++) {
        var clinic = req.body.clinics[i]
        doctor.clinics.push(
            {
                id : clinic.id,
                fees : clinic.fees
            }
        )
    };

    //memberships
    doctor.memberships = [];
    for(i=0; i<req.body.memberships.length; i++) {
        var membership = req.body.memberships[i]
        doctor.memberships.push(
            {
                name:membership.name,
                number : membership.number,
                expiryDate: membership.expiryDate
            }
        )
    };

    //educations
    doctor.educations = [];
    for(i=0; i<req.body.educations.length; i++) {
        var education = req.body.educations[i]
        doctor.educations.push(
            {
                collegeName : education.collegeName,
                degree : education.degree,
                degreeYear : education.degreeYear
            }
        )
    };

    //hospitalExperiences
    doctor.hospitalExperiences = [];
    for(i=0; i<req.body.hospitalExperiences.length; i++) {
        var hospitalExperience = req.body.hospitalExperiences[i]
        doctor.hospitalExperiences.push(
            {
                name : hospitalExperience.name,
                designation : hospitalExperience.designation,
                empanneled : hospitalExperience.empanneled
            }
        )
    };

    doctor.CVR = req.body.CVR;

    doctor.refferedby  =  req.body.refferedby;
}

function CreateTestDoctor(doctor, number)
{
    doctor.firstName =  "TestF" + number;
    doctor.middleName  =  "TestM" + number;
    doctor.lastName  =  "TestL" + number;
    doctor.email =  "TestE" + number + "@test.test";
    doctor.profileDescription = "TestDescription" + number;
    doctor.address1 =  "Test1address" + number;
    doctor.address2 =  "Test2address" + number;
    doctor.city = "TestCity" + number;
    doctor.state = "Teststate" + number;
    doctor.country = "Testcountry" + number;
    doctor.pincode = "Testpin" + number;
    doctor.website = "Testwebsite" + number + ".com";
    doctor.phone1 = "Test1phone" + number;
    doctor.phone2 = "Test2phone" + number;
    doctor.fees = number  * 10;
    doctor.refferedby  =  "Testreffered" + number;

    doctor.services = "Testservices" + number;
    doctor.specializations = "Testspecialization" + number;
    doctor.registrations = "Testregistration" + number;
    doctor.education = "Testeducation" + number;
    //doctor.experience = "Testexperience" + number;
    doctor.memberships = "Testmembership" + number;


}


//used for autocomplete mxid
function BuildResultSetfroMxID(details)
{
    var resultSet = new Array();

    for(i in details)
    {
        var arg1 = new Object();
        console.log(i);
        arg1.firstName = details[i].firstName;
        arg1.middleName =  details[i].middleName;
        arg1.lastName = details[i].lastName;
        arg1.city = details[i].city;
        arg1.specializations = details[i].specializations;
        arg1.fees = details[i].fees;
        arg1.seqId = 'MX' + details[i].mxId + details[i].mxIdSuffix;
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
        else if(key == 'clinicID')
        {
            query['clinics.id'] = value;
        }
        else
        {
            query[key+'ToUpper'] = value.toUpperCase();
        }

        //console.log(key + ":" + obj[key]);

    });

    return query;

    //console.log("q:" + q);
    //var query = {};
    //var q1 = {};
    //q1['$gte'] = 20;
    //query['fees'] = q1;
    //{fees:{$gte:10}
}
