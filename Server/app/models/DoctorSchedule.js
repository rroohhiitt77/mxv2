var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var DoctorScheduleSchema = new Schema({

	doctorID : Schema.Types.ObjectId,
	doctorFirstName : String,
	doctorLastName : String,
	doctorMXID : String,
	clinicID: Schema.Types.ObjectId,
	clinicName : String,
	clinicMXID : String,

	from : Date,
	to : Date,

	dayOfWeekMonday : String,
	dayOfWeekTuesday : String,
	dayOfWeekWednesday : String,
	dayOfWeekThursday : String,
	dayOfWeekFriday : String,
	dayOfWeekSaturday : String,
	dayOfWeekSunday : String,

	timeFrom : String,
	timeTo : String,
	slotDuration : Number,
	maxPerSlot : Number,  //bookings per slot ie by appointment
	maxWalkInPerSlot : Number,
	type : String, //booking, MR, holiday
	remarks : String,

	update : {type:Date, default:Date.now}
					
});

var DoctorSchedule = mongoose.model('DoctorSchedule', DoctorScheduleSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  DoctorSchedule;