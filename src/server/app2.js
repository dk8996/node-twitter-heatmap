var http = require('http').createServer(handler);
var io = require('socket.io').listen(http);
var util = require('util');
var locations = {};


var cityBoxs = [];
var cityData = require('./city_data.json');
for ( var i = 0; i < cityData.length; i++) {
	for ( var j = 0; j < cityData[i].box.length; j++) {
		cityBoxs.push(cityData[i].box[j]);
	}
	
}
console.log(cityBoxs);

var credentials = require('./credentials.js');

console.log(credentials.credentials.consumer_key);
 var keys = {
        "consumer_key" : credentials.credentials.consumer_key
      , "consumer_secret" : credentials.credentials.consumer_secret 
      , "access_token_key" : credentials.credentials.access_token_key
      , "access_token_secret" : credentials.credentials.access_token_secret
    };


var tu = require('tuiter')(keys);
//tu.filter({locations: [{lat: 41.1, long: -71.7},{lat: 42.8, long: -70}]}, function(stream){
//
//  // New tweet
//  stream.on("tweet", function(data){
//    console.log(data.text);
//    console.log(data.entities);
//    console.log(data.coordinates);
//    console.log(data.place.full_name);
//    console.log(data.place.bounding_box.coordinates);
//    
//    if(data.coordinates && data.coordinates.coordinates){
//      io.sockets.emit("update", {
//          coordinates: data.coordinates.coordinates
//        , screen_name: data.user.screen_name
//        , text: data.text
//        , profile_image_url: data.user.profile_image_url
//        , media_url: data.entities.media 
//      });
//    } else if(data.place){
//      var place = data.place.bounding_box.coordinates[0][0];
//       io.sockets.emit("update", {
//          coordinates: place
//        , screen_name: data.user.screen_name
//        , text: data.text
//        , profile_image_url: data.user.profile_image_url
//        , media_url: data.entities.media
//      });
//    }
//  });
//
//  stream.on("delete", function(data){
//    console.log("delete");
//    //I don't care about deleted tweets
//  });
//
//  // Log errors
//  stream.on("error", function(error){
//    // handle errors
//    console.log("error:"+error);
//  });
//
//});

function findCity(coordinates) {
	var lat = coordinates[1];
	var long = coordinates[0];
	for ( var i = 0; i < cityData.length; i++) {
		var sw = cityData[i].box[0];
		var ne = cityData[i].box[1];
		if (sw.lat < lat && ne.lat > lat && sw.long < long && ne.long > long) {
			return cityData[i];
		}
	}
	return undefined;
}

function sendDataToClient(data) {
	var cityDataObject = findCity(data.coordinates);
	if(cityDataObject !== undefined){
		io.sockets.to(cityDataObject.city).emit('update', data);
	}
}

tu.filter({locations : cityBoxs }, function(stream) {
	
	// New tweet
	stream.on("tweet", function(data) {
		console.log(data.text);
		console.log(data.entities);
		console.log(data.coordinates);
		console.log(data.place.full_name);
		console.log(data.place.bounding_box.coordinates);

		if (data.coordinates && data.coordinates.coordinates) {
			sendDataToClient({
				coordinates : data.coordinates.coordinates,
				screen_name : data.user.screen_name,
				text : data.text,
				profile_image_url : data.user.profile_image_url,
				media_url : data.entities.media
			});

		} else if (data.place) {
			var place = data.place.bounding_box.coordinates[0][0];
			sendDataToClient({
				coordinates : place,
				screen_name : data.user.screen_name,
				text : data.text,
				profile_image_url : data.user.profile_image_url,
				media_url : data.entities.media
			});
		}
	});

	stream.on("delete", function(data) {
		console.log("delete");
		// I don't care about deleted tweets
	});

	// Log errors
	stream.on("error", function(error) {
		// handle errors
		console.log("error:" + error);
		  stream.emit('reconnect');
	});

});



function handler(req, res) {
// fs.readFile('index.html', function(err, data) {
// res.writeHead(200, {
//			'Content-Type' : 'text/html'
//		});
//		res.end(data);
//	});
//        res.send(200);
};

io.sockets.on('connection', function(socket) {
	console.log("Someone connected");
	var city = "Boston";
	socket.location = city;
	socket.join(city);
	
	socket.on('subscribe', function(city) {
		if (socket.location !== undefined) {
			socket.leave(socket.location);
		}
		socket.location = city;
		socket.join(city);
	});
});

http.listen(8081, function() {
	console.log('%s listening at %s', http.name, http.url);
});
