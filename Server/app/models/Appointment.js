var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var AppointmentSchema = new Schema({
	doctorID : {type:Schema.Types.ObjectId},
    doctorDetails : {type:Schema.Types.ObjectId, ref:'Doctor'},
	clinicID : {type:Schema.Types.ObjectId},
    clinicDetails : {type:Schema.Types.ObjectId, ref:'Clinic'},
	patientID : {type:Schema.Types.ObjectId},
    patientDetails : {type:Schema.Types.ObjectId, ref:'Patient'},
    mrID : {type:Schema.Types.ObjectId, ref:'MR'},
    userType : String,   //Patient, MR, Salesman, etc

    date : String, //ddMMMyyyy
    time : Number,
    type : String,  //walkin, etc
	status : String, // Pending->Approve/Cancel->Seen/NoShow
    comments : String,

    creationDate : {type:Date, default:Date.now},
	update : {type:Date, default:Date.now},
    updatedBy : Schema.Types.ObjectId,

    fbQKey : String // firebase key where appointment saved in q
					
});

var Appointment = mongoose.model('Appointment', AppointmentSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  Appointment;