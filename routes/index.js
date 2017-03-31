var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next)
{
    //.find() gets all the documents inside a collection
    req.db.collection('places').find().toArray(function (err, placesDocs) {
        console.log(placesDocs);
        if (err) {
            return next(err)
        }
        else {
            return res.render('index', {title: 'Travel Wish List', places: placesDocs}); // placesdocs contains all object items
        }
    });

});

/* GET all items home page. */
router.get('/all', function(req, res)
{
    req.db.collection('places').find().toArray(function (err, placesDocs) {
        console.log(placesDocs);
        res.json(placesDocs); // returns Json object
    });
});
//
/// need to look into this
/* POST - add a new location */
router.post('/add', function(req, res, next)
{
   //var counter= req.db.collection('places').find().count();
    // gives a total number if any place already exists
    req.db.collection('places').find({'name':req.body.name}).toArray( function (err, doc)
    {
        console.log(req.body.name);
        console.log("Here" + doc);
        // gives the number of duplicate entry
        //checks if the list for the place's name is 0;then add it else give an error message
        if(doc.length == 0)
        {

            req.db.collection('places').insertOne({'name':req.body.name,'visited':false }, function (err,docs)
            {

                if (err)
                {
                    return next(err);
                }
                return res.json(docs.ops[0]); // directs to home-page
            });
        }
        else {
            res.send("Duplicate Entry");

        }

    });

});
// grabs id from the body, convert it into objectid id and then deletes it
router.delete('/delete', function(req, res, next)
{
  var place_id = req.body.id;
    console.log("I am place id" + place_id);
    req.db.collection('places').deleteOne({"_id": ObjectID(place_id)}, function (err, docs) {
                if (err)
                {
                    console.log("I am the docs" + docs);
                    return next(err);
                }

                return res.json({"id":place_id}); // sends one single data to Ajax call in script.js
            });

});

/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res){

  var filter = {'_id': ObjectID(req.body.id)};
  var update ={$set:{'visited': true}};  // all the body parameters are strings
    //finds with the id  and update it to true
  req.db.collection('places').findOneAndUpdate(filter, update,function (err,docs)
        {
            if (err) {
                return next(err);
            }
        });
    return res.json({"id":req.body.id, visited:true}); // sends id to Ajax call in script.js
  //   }
  // }
});



module.exports = router;
