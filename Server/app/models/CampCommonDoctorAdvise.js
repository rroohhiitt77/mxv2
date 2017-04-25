/**
 * Created by india on 8/3/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var CampCommonDoctorAdviseSchema = new Schema({

    doctorAdvise: String,
    doctorAdviseUpper : String,
    addedInCamp : String,

    createdBy : String,
    updatedBy : String,
    createdOn : Date,
    updateOn : {type:Date, default:Date.now}

});


CampCommonDoctorAdviseSchema.pre('save', function(next){
    var doc = this;

    //Store upper cse version of camp name for case insensitive search
    doc.doctorAdviseUpper = doc.doctorAdvise.toUpperCase();
    next();

});



var CampCommonDoctorAdvise = mongoose.model('CampCommonDoctorAdvise', CampCommonDoctorAdviseSchema);
//module.exports allows us to pass this to other files when it is called
module.exports =  CampCommonDoctorAdvise;
