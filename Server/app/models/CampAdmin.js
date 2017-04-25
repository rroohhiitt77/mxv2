var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var CampAdminSchema = new Schema({

	firstName : String,
	lastName : String,
	email : String,
	address1 : String,
	address2 : String,
	city : String,
	state : String,
	country: String,
	pincode : String,
	website: String,
	phone1:String,
	phone2:String,
	
	organization : String,
	EditRights : Boolean,
		
	refferedby : {type:String, entityType : String},
	update : {type:Date, default:Date.now}
					
});

var CampAdmin = mongoose.model('CampAdmin', CampAdminSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  CampAdmin;