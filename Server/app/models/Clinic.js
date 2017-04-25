var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sequenceGenerator = require("./SequenceGenerator");
var mxIdSuffix = "CLC";


var ClinicSchema = new Schema({

    name : String,
    nameToUpper : String, //for making case insensistive search, this can be indexed hence better over REGEX
    clinicDescription : String,
    address1 : String,
    address1 : String,
    city : String,
    state : String,
    pincode : String,
    country: String,
    phone1:[String], //landline
    phone2:String,  //mobile
    website: String,
    email : String,
    //doctors:
    //    [{
    //        id:{type:Schema.Types.ObjectId, ref:'Doctor'},
    //        fees:Number
    //    }],
    workingHours : [{
        dayOfWeek : String,
        timeFrom : String,
        timeTo : String,
    }],
    services : [String],
    specializations : [String],
    registrations : [String],
    comments : String,

    mxId : {type:Number, default:-1},
    mxIdSuffix : {type:String, default:mxIdSuffix},

    update : {type:Date, default:Date.now}



});

//sequence instance
var sequence = sequenceGenerator('CLINIC');

ClinicSchema.pre('save', function(next){
    var doc = this;

    //Store upper cse version of camp name for case insensitive search
    doc.nameToUpper = doc.name.toUpperCase();

    // get the next sequence if this is create..dont get on update
    if (doc.mxId == -1) {
        sequence.next(function(nextSeq){
            doc.mxId = nextSeq;
            next();
        });
    }
    else
    {
        next();

    }



});



var Clinic = mongoose.model('Clinic', ClinicSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  Clinic;