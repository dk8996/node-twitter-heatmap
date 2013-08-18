var http = require('http').createServer(handler);
var io = require('socket.io').listen(http);
var util = require('util');
var locations = {};

var credentials = require('./credentials.js');

console.log(credentials.credentials.consumer_key);
 var keys = {
        "consumer_key" : credentials.credentials.consumer_key
      , "consumer_secret" : credentials.credentials.consumer_secret 
      , "access_token_key" : credentials.credentials.access_token_key
      , "access_token_secret" : credentials.credentials.access_token_secret
    };


var tu = require('tuiter')(keys);
tu.filter({locations: [{lat: 41.1, long: -71.7},{lat: 42.8, long: -70}]}, function(stream){

  // New tweet
  stream.on("tweet", function(data){
    console.log(data.text);
    console.log(data.entities);
    console.log(data.coordinates);
    console.log(data.place.full_name);
    console.log(data.place.bounding_box.coordinates);
    
    if(data.coordinates && data.coordinates.coordinates){
      io.sockets.emit("update", {
          coordinates: data.coordinates.coordinates
        , screen_name: data.user.screen_name
        , text: data.text
        , profile_image_url: data.user.profile_image_url
        , media_url: data.entities.media 
      });
    } else if(data.place){
      var place = data.place.bounding_box.coordinates[0][0];
       io.sockets.emit("update", {
          coordinates: place
        , screen_name: data.user.screen_name
        , text: data.text
        , profile_image_url: data.user.profile_image_url
        , media_url: data.entities.media
      });
    }
  });

  stream.on("delete", function(data){
    console.log("delete");
    //I don't care about deleted tweets
  });

  // Log errors
  stream.on("error", function(error){
    // handle errors
    console.log("error:"+error);
  });

});

tu.filter({locations: [{lat: 36, long: -122},{lat: 38, long: -123}]}, function(stream){

	  // New tweet
	  stream.on("tweet", function(data){
	    console.log(data.text);
	    console.log(data.entities);
	    console.log(data.coordinates);
	    console.log(data.place.full_name);
	    console.log(data.place.bounding_box.coordinates);
	    
	    if(data.coordinates && data.coordinates.coordinates){
	      io.sockets.emit("update", {
	          coordinates: data.coordinates.coordinates
	        , screen_name: data.user.screen_name
	        , text: data.text
	        , profile_image_url: data.user.profile_image_url
	        , media_url: data.entities.media 
	      });
	    } else if(data.place){
	      var place = data.place.bounding_box.coordinates[0][0];
	       io.sockets.emit("update", {
	          coordinates: place
	        , screen_name: data.user.screen_name
	        , text: data.text
	        , profile_image_url: data.user.profile_image_url
	        , media_url: data.entities.media
	      });
	    }
	  });

	  stream.on("delete", function(data){
	    console.log("delete");
	    //I don't care about deleted tweets
	  });

	  // Log errors
	  stream.on("error", function(error){
	    // handle errors
	    console.log("error:"+error);
	  });

	});



function handler(req, res) {
//	fs.readFile('index.html', function(err, data) {
//		res.writeHead(200, {
//			'Content-Type' : 'text/html'
//		});
//		res.end(data);
//	});
//        res.send(200);
};

io.sockets.on('connection', function(socket) {
	console.log("Someone connected");

	socket.on('subscribe', function(location) {
		if (socket.location === undefined) {
			socket.leave(socket.location);
		}
		
		socket.location = location;
		locations[location] = location;
		socket.join(location);
	});
});

http.listen(8081, function() {
	console.log('%s listening at %s', http.name, http.url);
});
