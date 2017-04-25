var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactUsSchema = new Schema({

	subject : String,
	name : String,
	email : String,
	feedback : String,
	source : String,  //eg healthcamp
	queryStatus : {type:String, default:'Open'},  //Open-->In Progress-->Closed 
	createdOn : {type:Date, default:Date.now},
	createdBy : String,
	update : {type:Date, default:Date.now}
					
});

var ContactUs = mongoose.model('ContactUs', ContactUsSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  ContactUs;