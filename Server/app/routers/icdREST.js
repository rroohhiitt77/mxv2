var express    = require('express');        // call express
var icdRESTRouter = express.Router();
var ICD = require('../models/ICD');

module.exports = icdRESTRouter;

//middleware to use for all requests
icdRESTRouter.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in ICD REST router.');
    next(); // make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
icdRESTRouter.get('/icdTest', function(req, res) {
    ParseICDCodes();
    res.json({ message: 'hooray! welcome to our ICD REST api!' });
});

//============================== BASIC CRUD for ICD starts =====================================================
icdRESTRouter.route('/')

// create a icd (accessed at POST http://localhost:8080/api/icd)
    .post(function(req, res) {

        var icd = new ICD();      // create a new instance of the ICD model

        Update(icd, req);
        // save the icd and check for errors
        icd.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'ICD created!' });
        });
    })

// get all the  icd (accessed at POST http://localhost:8080/api/icd)
    .get(function(req, res) {

        ICD.find( GetQuery(req) ,function(err, icds) {
            if (err)
                res.send(err);

            res.json(icds);
        });
    });



//on routes that end in /bears/:bear_id
//----------------------------------------------------
icdRESTRouter.route('/:icd_id')

    // get the icd with that id (accessed at GET http://localhost:8080/api/icd/:icd_id)
    .get(function(req, res) {
        //ICD.findById(req.params.icd_id, function(err, icd) {
        ICD.findById(req.params.icd_id, function(err, icd) {
            if (err)
                res.send(err);
            if(icd)
                res.json(icd);
            else
                res.json({message:'icd not found'});
        });
    })
    // update the icd with this id (accessed at PUT http://localhost:8080/api/icd/:icd_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        //ICD.findById(req.params.icd_id, function(err, icd) {
        ICD.findById(req.params.icd_id, function(err, icd) {

            //console.log (req.params.icd_id);
            //console.log(icd);
            if (err)
                res.send(err);

            if(icd)
            {
                //update the icd info
                Update(icd, req);

                // save the icd
                icd.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'ICD updated!' });
                });
            }
            else
                res.json({message:'icd not found'});


        });
    })
    // delete the icd with this id (accessed at PUT http://localhost:8080/api/icd/:icd_id)
    .delete(function(req, res) {
        ICD.remove({
            _id: req.params.icd_id
        }, function(err, icd) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//============================== BASIC CRUD for ICD ends =====================================================


function Update(icd, req)
{
    icd.status =  req.body.status;
    icd.code =  req.body.code;
    icd.title =  req.body.title;

}

function ParseICDCodes()
{

    var fs = require('fs'),
        readline = require('readline');

    var rd = readline.createInterface({
        input: fs.createReadStream('D:\\Intellilabs\\Java Projects\\Files\\icd_csv.csv'),
        output: process.stdout,
        terminal: false
    });

    rd.on('line', function(line) {

        var arr = line.split(",");

        var icd = new ICD();      // create a new instance of the ICD model
        var body= {};
        var req = {};

        body.code = arr[0];
        body.title = arr[1];
        req.body = body;

        Update(icd, req);
        // save the icd and check for errors
        icd.save(function(err) {
            if (err)
                console.log(err);
            else
                console.log("Added code:" + body.code + " title:" + body.title);

        });
    });
}



