var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next)
{
    req.db.collection('places').find().toArray(function (err, placesDocs) {
        console.log(placesDocs);
        if (err) {
            return next(err)
        }
        else {
            return res.render('index', {title: 'Travel Wish List', places: placesDocs});
        }
    });

});

/* GET all items home page. */
router.get('/all', function(req, res)
{
    req.db.collection('places').find().toArray(function (err, placesDocs) {
        console.log(placesDocs);
        res.json(placesDocs);
    });
});
//
/// need to look into this
/* POST - add a new location */
router.post('/add', function(req, res, next)
{
   //var counter= req.db.collection('places').find().count();
    req.db.collection('places').find({'name':req.body.name}).toArray( function (err, doc)
    {
        console.log(req.body.name);
        console.log("Here" + doc);
        // gives the number of duplicate entry
        //checks if the list for the flower name is 0;then add it else give an error message
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
// this is working
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
                //return res.render('delete_places.hbs', {'places': req.body.name}); // directs to delete-page
                return res.json({"id":place_id})
            });

});

/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res){

  var filter = {'_id': req.body._id};
  var update ={$set:{'visited': 'true'}};  // all the body parameters are strings
  req.db.collection('places').findOneAndUpdate(filter, update,function (err)
        {
            if (err) {
                return next(err);
            }
        });
    return res.redirect('/all');
  //   }
  // }
});



module.exports = router;
