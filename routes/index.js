var express = require('express');
var router = express.Router();

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

            req.db.collection('places').insertOne({'name':req.body.name,'visited':false }, function (err)
            {
                if (err) {
                    return next(err);
                }
                return res.redirect('/all'); // directs to home-page
            });
        }
        else {
            res.send("Duplicate Entry");

        }

    });

});
// this is not working either
router.post('/delete/:id', function(req, res, next)
{
  var place_id = req.params._id;
    console.log("I am place id" + place_id);
    // for(var i=0;i<req.body.collection.length;i++)
    // {
    //     var place = req.body.collection[i];
    //     console.log("I am place" + place);
    //     if (place._id == place_id) {
            req.db.collection('places').deleteOne({'_id': place_id}, function (err, docs) {
                if (err)
                {
                    console.log("I am the docs" + docs);
                    return next(err);
                }
                //return res.render('delete_places.hbs', {'places': req.body.name}); // directs to delete-page
                return res.redirect("/all");
            });

    //
    //     }
    // }
});

/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res){

  var filter = {'_id': req.params._id};
  var update ={$set:{'visited': 'true'}};  // all the body parameters are strings

  // for (var i = 0 ; i < req.db.collection.length ; i++) {
  //   var place = req.body.collection[i];
  //   if (place._id == req.body._id)
  //   {
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
