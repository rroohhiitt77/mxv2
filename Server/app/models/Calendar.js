var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var CalendarSchema = new Schema({

	doctorID: String,
	clinicID : String,
	event: String,
	update : {type:Date, default:Date.now}
					
});

var Calendar = mongoose.model('Calendar', CalendarSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  Calendar;