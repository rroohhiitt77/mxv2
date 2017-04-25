var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var CampDetailSchema = new Schema({

	name : String,
	nameToUpper : String, //for making case insensistive search, this can be indexed hence better over REGEX
	address1 : String,
	address2 : String,
	city : String,
	state : String,
	pincode : String,
	country : String,
	date : String,
	campFinding : String,
	timeFrom : String,
	timeTo : String,
	expectedPatients : Number,
	actualPatients : Number,
	
	conductedByOrganisation : String,
	conductedByPrimaryName : String,
	conductedByPrimaryEmail : String,
	conductedByPrimaryPhone : String,
	
	conductedForOrganisation : String,
	conductedForPrimaryName : String,
	conductedForPrimaryEmail : String,
	conductedForPrimaryPhone : String,
	
	conductedAtOrganisation : String,
	conductedAtPrimaryName : String,
	conductedAtPrimaryEmail : String,
	conductedAtPrimaryPhone : String,
	
	doctors : String,
	comments : String,
	
	createdBy : String,
	updatedBy : String,
	createdOn : Date,
	updateOn : {type:Date, default:Date.now}
					
});


CampDetailSchema.pre('save', function(next){
	  var doc = this;
	  	  
	  //Store upper cse version of camp name for case insensitive search
	  doc.nameToUpper = doc.name.toUpperCase();
	  next();
	  	  
	});



var CampDetail = mongoose.model('CampDetail', CampDetailSchema);
//module.exports allows us to pass this to other files when it is called
module.exports =  CampDetail;