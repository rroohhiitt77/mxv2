/**
 * Created by india on 8/3/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var CampCommonDoctorExaminationSchema = new Schema({

    doctorExamination: String,
    doctorExaminationUpper : String,
    addedInCamp : String,

    createdBy : String,
    updatedBy : String,
    createdOn : Date,
    updateOn : {type:Date, default:Date.now}

});


CampCommonDoctorExaminationSchema.pre('save', function(next){
    var doc = this;

    //Store upper cse version of camp name for case insensitive search
    doc.doctorExaminationUpper = doc.doctorExamination.toUpperCase();
    next();

});



var CampCommonDoctorExamination = mongoose.model('CampCommonDoctorExamination', CampCommonDoctorExaminationSchema);
//module.exports allows us to pass this to other files when it is called
module.exports =  CampCommonDoctorExamination;
