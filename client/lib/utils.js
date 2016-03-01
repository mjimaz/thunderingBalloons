var logout = function () {
  $.get('/logout')
      .done(function (data){
       console.log('successfully logged out');
    }).fail(function (error){
      console.error('Failed to logout!', error);
    });
}

var getEvents = function (callback) {

  $.get('/events')
      .done(function (data){
       callback({eventsList: data, currentPage: '/myEvents'});




       console.log('events:', data);



    }).fail(function (error){
      console.error('Failed to receive events!', error);
    });
}

var addEvents = function (callback) {
  callback({currentPage: '/addEvent'});
}

var postEvent = function (places, users) {
  var chosenPlace = $("input[type='radio'][name='chosenPlace']:checked").val();
  var place = places[chosenPlace];
  var date = $('#date').val();
  var time = $('#time').val();
  var what = $('#term').val();
  var invitees = [];

  var location = place.location.address[0];

  var timestamp = new Date(date+' '+ time);

  $('input[name="usersAddresses"]:checked').each(function() {
    var index = $(this).attr("value");
    invitees.push(users[index].id) ;
  });
  
  var query = {
    event_info: {
      event_name: what +' @ '+ place.name,
      venue_name: place.name,
      street: place.location.address[0],
      city: place.location.city,
      state: place.location.state_code,
      event_time: new Date('October 10, 2014 10:30:00'),
      latitude: place.location.coordinate.latitude,
      longitude: place.location.coordinate.longitude,
      phone: place.phone,
      rating: place.rating,
      rating_img: place.rating_img_url_small,
      image: place.image_url,
      yelp_link: place.url
    },
    invitees: invitees
  }
  $.post('/events', query)
    .done(function (data) {
      console.log('successfully created event.', data);
  }).fail(function (error){
    console.error('Failed to post an event!', error);
  });

}

var getUsers = function (callback) {

  $.get('/users')
      .done(function (data){
       callback({users: data});
    }).fail(function (error){
      console.error('Failed to receive users!', error);
    });
}

// given an address return latitude and longitude
function codeAddress(address, callback) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
     var lat = results[0].geometry.location.lat();
     var lng = results[0].geometry.location.lng();
     callback(lat, lng);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

var searchPlaces = function (callback, users) {
  var term = $('#term').val();
  var latitude = 0;
  var longitude = 0;
  var count = 0;

  $('input[name="usersAddresses"]:checked').each(function() {
    var index =  $(this).attr("value");
    latitude += users[index].latitude;
    longitude += users[index].longitude;
    count++;
  });

  var query = {lat:latitude/count, lng:longitude/count, term:term};

  $.get('/places', query)
    .done(function (data){
      console.log('successfully YELP get', data);
      callback({placesList: data.businesses});
  }).fail(function (error){
    console.error('Yelp: Failed to receive places!', error);
  });
};
