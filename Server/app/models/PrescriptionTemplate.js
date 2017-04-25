var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PrescriptionTemplateSchema = new Schema({

    doctorID : {type:Schema.Types.ObjectId, ref:'Doctor'},  //unique identifier

    name : String, //unique identifier per doctor
    nameToUpper : String,
    PrescriptionTemplateFields:[{
        drugName: String,
        duration: String,
        strength: String,
        morning: String,
        afternoon: String,
        night: String,
        instruction: String,
        afterFood: Boolean,
        beforeFood: Boolean
    }],

    createdBy : String,
    updatedBy : String,
    createdOn : Date,
    updateOn : {type:Date, default:Date.now}

});

PrescriptionTemplateSchema.pre('save', function(next){
    var doc = this;

    //Store upper cse version of camp name for case insensitive search
    doc.nameToUpper = doc.name.toUpperCase();
    next();
});


var PrescriptionTemplate = mongoose.model('PrescriptionTemplate', PrescriptionTemplateSchema);
//module.exports allows us to pass this to other files when it is called
module.exports =  PrescriptionTemplate;


