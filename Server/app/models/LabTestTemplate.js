var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LabTestTemplateSchema = new Schema({

    doctorID : {type:Schema.Types.ObjectId, ref:'Doctor'},  //unique identifier

    name : String, //unique identifier per doctor
    nameToUpper : String,

    labTestTemplateFields:[{
        testName : String,
        prefferedLab : String,
        instruction : String
    }],

    createdBy : String,
    updatedBy : String,
    createdOn : Date,
    updateOn : {type:Date, default:Date.now}

});

LabTestTemplateSchema.pre('save', function(next){
    var doc = this;

    //Store upper cse version of camp name for case insensitive search
    doc.nameToUpper = doc.name.toUpperCase();
    next();
});


var LabTestTemplate = mongoose.model('LabTestTemplate', LabTestTemplateSchema);
//module.exports allows us to pass this to other files when it is called
module.exports =  LabTestTemplate;


