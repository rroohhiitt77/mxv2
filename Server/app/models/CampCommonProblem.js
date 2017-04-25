var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var CampCommonProblemSchema = new Schema({

	problem: String,
	problemUpper : String,
	addedInCamp : String,
	severity : String,  //low, medium, high
	
	createdBy : String,
	updatedBy : String,
	createdOn : Date,
	updateOn : {type:Date, default:Date.now}
					
});


CampCommonProblemSchema.pre('save', function(next){
	  var doc = this;
	  	  
	  //Store upper cse version of camp name for case insensitive search
	  doc.problemUpper = doc.problem.toUpperCase();
	  next();
	  	  
	});



var CampCommonProblem = mongoose.model('CampCommonProblem', CampCommonProblemSchema);
//module.exports allows us to pass this to other files when it is called
module.exports =  CampCommonProblem;