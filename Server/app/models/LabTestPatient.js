
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LabTestPatientSchema = new Schema({

	//one prescription per clinic/doctor/date combination
	doctorID : {type:Schema.Types.ObjectId, ref:'Doctor'},  //unique identifier
	patientID : {type:Schema.Types.ObjectId, ref:'Doctor'},  //unique identifier
	clinicID : {type:Schema.Types.ObjectId, ref:'Doctor'},  //unique identifier
	createdOn : Date,

	templateName : String, //if created from a template
	templateNameToUpper : String,

	prescriptionFields:[{
		testName : String,
		prefferedLab : String,
		instructions : String
	}],

	createdBy : String,
	updatedBy : String,
	updateOn : {type:Date, default:Date.now}

});

LabTestPatientSchema.pre('save', function(next){
	var doc = this;

	//Store upper cse version of camp name for case insensitive search
	doc.templateNameToUpper = doc.templateName.toUpperCase();
	next();
});


var LabTestPatient = mongoose.model('LabTestPatient', LabTestPatientSchema);
//module.exports allows us to pass this to other files when it is called
module.exports =  LabTestPatient;


