var express = require('express');
var router = express.Router();


// "Database". Names of places, and whether the user has visited it or not.





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
//
/* POST - add a new location */
router.post('/add', function(req, res, next)
{
   var counter= req.db.collection('places').find().count();
    console.log("I am counter " + counter);
    req.db.collection('places').find({'name':req.body.name}).toArray( function (err, doc)
    {
        console.log(req.body.name);
        console.log(doc.length);
        // gives the number of duplicate entry
        //checks if the list for the flower name is 0;then add it else give an error message
        if(doc.length == 0)
        {

            req.db.collection('places').insertOne({'id':++counter,'name':req.body.name,'visited':false }, function (err)
            {
                console.log("Counter Increased " + counter);
                if (err) {
                    return next(err);
                }
                return res.redirect('/'); // directs to home-page
            });
        }
        else {
            res.send("Duplicate Entry");

        }

    });

});
router.post('/delete', function(req, res, next)
{
  console.log("I am body" + req.body);
  var place_id = req.body.id;
  console.log("I am the id"+place_id);
  req.db.collection('places').deleteOne({'id':place_id},function (err, docs)
    {
        if (err)
        {
            return next(err);
        }
        return res.render('delete_places.hbs',{'places': req.body.name} ); // directs to delete-page
    });


});

// /* PUT - update whether a place has been visited or not */
// router.put('/update', function(req, res){
//
//   var id = req.body.id;
//   var visited = req.body.visited == "true";  // all the body parameters are strings
//
//   for (var i = 0 ; i < places.length ; i++) {
//     var place = places[i];
//     if (place.id == id) {
//       place.visited = visited;
//       places[i] = place;
//     }
//   }
//
//   console.log('After PUT, the places list is');
//   console.log(places);
//
//   res.json(place);
//
// });
//
//

module.exports = router;
