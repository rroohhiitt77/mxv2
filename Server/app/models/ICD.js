var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ICDSchema = new Schema({

    status : String,
    code : String,
    title : String,

    update : {type:Date, default:Date.now}

});


var ICD = mongoose.model('ICD', ICDSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  ICD;