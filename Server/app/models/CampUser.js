var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sequenceGenerator = require("./SequenceGenerator");
var mxIdSuffix = "CUX";




var CampUserSchema = new Schema({

	campName : String,  //unique identifier
	campNameToUpper : String,  //upper cse for case insensitive search 
	firstName : String,
	lastName : String,
	sex : String,
	age : String,
	dob : String,
	height : String,
	weight : String,
	hb : String,
	bp : String,
	comments : String,
	seenBy : String,
	complaint : String,
	examination : String,
	advise : String,
	healthCondition : String,
	
	mxId : {type:Number, default:-1},
	mxIdSuffix : {type:String, default:mxIdSuffix},
	
	createdBy : String,
	updatedBy : String,
	createdOn : Date,
	updateOn : {type:Date, default:Date.now}
					
});


//sequence instance
var sequence = sequenceGenerator('MX');

CampUserSchema.pre('save', function(next){
  var doc = this;
  // get the next sequence if this is create..dont get on update
  
  //Store upper cse version of camp name for case insensitive search
  doc.campNameToUpper = doc.campName.toUpperCase();
  
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




var CampUser = mongoose.model('CampUser', CampUserSchema);
//module.exports allows us to pass this to other files when it is called
module.exports =  CampUser;


