
$(function(){

  // Add a listener for input text; listen for Enter key.
  // Send POST request to create new place

  getAllPlaces(); // calls /all url in index.js and displays all the data;line 92 on this page;

});

//when you hit enter which #13, it calls addnewplace(line 112) with input text value
function addNewPlaceFormListener()
{

  $("#new_place").keypress(function(event){
    var placename = $(this).val();
      console.log("I am the place name "+ placename);
    if (event.which == 13 && placename ) {   //if user presses Enter and $(this).val has a value
      addNewPlace(placename);
    }
  });

}

// Create elements for the html page

function addPlacesToPage(places) {
  //if (!places || places.length == 0){
  //  //todo no places method
  //}

  var parent = $('#place_list');
  for (var i = 0 ; i < places.length ; i++) {
    addPlace(places[i], parent);
  }

  // Remove any old listeners, add listeners

  // Add listener to input checkboxes. As input checkboxes are checked and unchecked,
  // send PUT request to update the visited value of the place with the corresponding ID
  $('.visited').off().click(checkListener);

  // Add listener to delete buttons. Send DELETE request to delete place when clicked.
  $('.delete').off().click(deleteListener);

}

//dynamically creating html element for the travel-list
function addPlace(place, parent)
{

    //place=JSON.stringify(place);
    console.log("I am final place "+JSON.stringify(place));
    console.log("Id" + place._id);
    //console.log("Name"+ obj.name);

  var html = '<div id="' + place._id + '"><span class="placename">' + place.name + '</span><label class="visited_label" for="' + place._id + '_is_visited">Visited?</label>';

  if (place.visited) {
    html += '<span class="controls"><input class="visited" id="' + place._id + '_is_visited" type="checkbox" checked />'
  }
  else {
    html += '<span class="controls"><input class="visited" id="' + place._id + '_is_visited" type="checkbox"/>'
  }

  html += '<button id="'+ place._id +'_delete" class="delete">Delete?</button></span></div>';

  parent.append(html);
}


// Listener functions
function deleteListener() {

  $(this).text('Deleting...');              // Change button text to 'deleting...' Visual feedback for slower connections.
  var elem_id = $(this).attr('id');         // Get the id of the element clicked, expected to be in the format '4_delete' for place id 4
  var id = elem_id.replace('_delete', '');  // Cut off the _delete part, left with the number id
  deletePlace(id);                          // Make AJAX request to delete the place with this ID
}

//
function checkListener() {
  //todo feedback on updated?
  var visited = $(this).is(':checked');   // Is the checkbox checked or unchecked?
  var elem_id = $(this).attr('id');             // Get the checkbox id. For place with id 4, the id will be 4_visited
  var id = elem_id.replace('_is_visited', '');   // Remove the _is_visited part
  updateVisited(id, visited);                    // make AJAX request to update the place with this ID to the new visited state.
}


// These functions make AJAX calls
// get all -/all router in index.js
function getAllPlaces(){

  $.ajax({
    method:"GET",
    url:"/all"
  }).done(function(data){
    //Build HTML for each place in list
    addPlacesToPage(data);
    //console.log(data[data.length-1].name);
    addNewPlaceFormListener();  //Once page is loaded, enable form

  }).fail(function(error){
    console.log("GET error");
    console.log(error);
  });

}

//adds new places-gets info from index.js-/add router
function addNewPlace(placename){

  $.ajax({
    method:"POST",
    url:"/add",
    data: { "name" : placename }
  }).done(function(data)
  {
    console.log("I am the data" + placename);

    console.log('POST complete');

    $('#new_place').val('');        // Clear input text box

    var parent = $('#place_list');
    addPlace(data, parent);

    // Update listeners
    var new_checkbox_id = '#' +data._id + '_is_visited';
    var new_delete_id = '#' +data._id + '_delete';

    $(new_checkbox_id).click(checkListener);
    $(new_delete_id).click(deleteListener);


  }).fail(function(error){
    console.log('POST Error');
    console.log(error);
  });

}

//gets info from /update in index.js
function updateVisited(id, visited) {

  $.ajax({
    method:"PUT",
    url:"/update",
    data:{ "id":id, "visited":visited }
  }).done(function(){
    console.log('PUT complete');  // Could update the page here, if needed
  }).fail(function(error){
    console.log('PUT error');
    console.log(error)
  });
}

// gets id from /delete route in index.js
function deletePlace(id) {

  $.ajax({
    method: "DELETE",
    url: "/delete",
    data: { "id": id }
  }).done(function (data) {
    console.log('DELETE complete');
    // Select div containing this item, and remove from page
    var selector_id = '#' + data.id + "";
    $(selector_id).fadeOut(function(){
      $(this).remove();
    });
  }).fail(function (error) {
    console.log('DELETE error');
    console.log(error);
  });
}

