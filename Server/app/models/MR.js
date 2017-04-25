var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sequenceGenerator = require("./SequenceGenerator");
var mxIdSuffix = "MER";


var MRSchema = new Schema({

    firstName : String,
    firstNameToUpper : String,
    middleName : String,
    middleNameToUpper : String,
    lastName : String,
    lastNameToUpper : String,
    nameToUpper : String,
    email : String,

    address1 : String,
    address2 : String,
    city : String,
    cityToUpper : String,
    state : String,
    country: String,
    pincode : String,
    phone1:String,
    phone2:String,

    refferedby : {type:String, entityType : String},

    mxId : {type:Number, default:-1},
    mxIdSuffix : {type:String, default:mxIdSuffix},

    update : {type:Date, default:Date.now}

});

//sequence instance
var sequence = sequenceGenerator('MR');


MRSchema.pre('save', function(next){
    var doc = this;

    //Store upper cse versions for insensitive search
    var firstNameUpper;
    var middleNameUpper;
    var lastNameUpper;
    var cityUpper;

    if(doc.firstName)
        firstNameUpper = doc.firstName.toUpperCase();
    else
        firstNameUpper = "";

    if(doc.middleName)
        middleNameUpper = doc.middleName.toUpperCase();
    else
        middleNameUpper = "";

    if(doc.lastName)
        lastNameUpper = doc.lastName.toUpperCase();
    else
        lastNameUpper = "";

    if(doc.city)
        cityUpper = doc.city.toUpperCase();
    else
        cityUpper = "";



    doc.firstNameToUpper = firstNameUpper;
    doc.middleNameToUpper = middleNameUpper;
    doc.lastNameToUpper = lastNameUpper;
    doc.cityToUpper = cityUpper;

    doc.nameToUpper = firstNameUpper +" "+ middleNameUpper + "" + lastNameUpper;


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


var MR = mongoose.model('MR', MRSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  MR;