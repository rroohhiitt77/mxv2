var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PatientCaseSchema = new Schema({

	doctorID : {type:Schema.Types.ObjectId, ref:'Doctor'},  //doctor who ceates this case
	patientID : {type:Schema.Types.ObjectId, ref:'Patient'},  //patient for whom this is created
	created : {type:Date, default:Date.now},   //will maintian history of case entries.
	title : String, //title of case, unique udentofier to link case history. will be appended with date when created
	description : String, //case description
	complaints : String, //patient complaints
	symptoms : String, //patient symptoms
	diagnosis : String, //doctor diagnosis
	docNotes : String, //doctor notes not visible to patient
	attachments : String, //attached documents

	prescription : [{
	drugName: String,
	duration: String,
	strength: String,
	morning: Boolean,
	afternoon: Boolean,
	night: Boolean,
	instruction: String,
	afterFood: Boolean,
	beforeFood: Boolean
	}],

	labTests:[{
		testName : String,
		prefferedLab : String,
		instructions : String
	}],

	update : {type:Date, default:Date.now}
					
});

PatientCaseSchema.pre('save', function(next){
	var doc = this;
    next();
});


var PatientCase = mongoose.model('PatientCase', PatientCaseSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  PatientCase;