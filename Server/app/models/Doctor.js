var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sequenceGenerator = require("./SequenceGenerator");
var mxIdSuffix = "DOC";


var DoctorSchema = new Schema({

	firstName : String,
	firstNameToUpper : String,
	middleName : String,
	middleNameToUpper : String,
	lastName : String,
	lastNameToUpper : String,
	nameToUpper : String,
	phoneNumber : String, //login name
	email : String,
	website: String,
	yearsOfExperience:
		{
			value:Number,
			createdDate: {type:Date, default:Date.now}
		},
	profileDescription : String,
	profileImage : String, //path to profile image, for now it is S3
	
	address1 : String,
	address2 : String,
	city : String,
	cityToUpper : String,
	state : String,
	pincode : String,
	country: String,


	phone1:[String],  //landline numbers
	phone2:String,  //mobile numbers
	
	services : [String],
	specializations : [String],
	registrations : [String],

	clinics:
    [{
        id:{type:Schema.Types.ObjectId, ref:'Clinic'},
        fees:Number
    }],

    memberships:
    [{
        name:String,
        number : String,
        expiryDate : String
    }],

    educations:
    [{
        collegeName : String,
        degree : String,
        degreeYear : String
    }],

    hospitalExperiences:
    [{
        name:String,
        designation : String,
        empanneled : Boolean
    }],

    CVR : String,

	refferedby : {type:String, entityType : String},

	mxId : {type:Number, default:-1},
	mxIdSuffix : {type:String, default:mxIdSuffix},

	update : {type:Date, default:Date.now}
					
});

//sequence instance
var sequence = sequenceGenerator('DOCTOR');


DoctorSchema.pre('save', function(next){
	var doc = this;

    //Store upper cse versions for insensitive search
	var firstNameUpper;
	var middleNameUpper;
	var lastNameUpper;
	var specializationsUpper;
	var cityUpper;

	if(doc.firstName)
		firstNameUpper = doc.firstName.toUpperCase();
	else
		firstNameUpper = "";

	if(doc.middleName)
		middleNameUpper = doc.middleName.toUpperCase();
	else
		middleNameUpper = "";

	if(doc.lastName)
		lastNameUpper = doc.lastName.toUpperCase();
	else
		lastNameUpper = "";

	if(doc.city)
		cityUpper = doc.city.toUpperCase();
	else
		cityUpper = "";



	doc.firstNameToUpper = firstNameUpper;
	doc.middleNameToUpper = middleNameUpper;
	doc.lastNameToUpper = lastNameUpper;
	doc.cityToUpper = cityUpper;

	doc.nameToUpper = firstNameUpper +" "+ middleNameUpper + " " + lastNameUpper;
	doc.specializationsToUpper = specializationsUpper;


    // get the next sequence if this is create..dont get on update
    if (doc.mxId == -1) {
        sequence.next(function(nextSeq){
            doc.mxId = nextSeq;
            next();
        });
    }
    else
    {
        next();

    }
});


var Doctor = mongoose.model('Doctor', DoctorSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  Doctor;