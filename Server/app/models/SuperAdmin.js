var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var SuperAdminSchema = new Schema({

    firstName : String,
    middleName : String,
    lastName : String,
    email : String,


    update : {type:Date, default:Date.now}

});

var SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);

//module.exports allows us to pass this to other files when it is called
module.exports =  SuperAdmin;