var http = require('http').createServer(handler);
var io = require('socket.io').listen(http);
var util = require('util');
var twitter = require('ntwitter');
//var twitter = require('simple-twitter');
//var client = require('twitter-api').createClient();

var credentials = require('./credentials.js');
console.log(credentials.credentials.consumer_key);


var Stream = require('twitter-public-stream');
var twit = new twitter({
    consumer_key: credentials.credentials.consumer_key,
    consumer_secret: credentials.credentials.consumer_secret,
    access_token_key: credentials.credentials.access_token_key,
    access_token_secret: credentials.credentials.access_token_secret
});

//twit
//  .verifyCredentials(function (err, data) {
//    console.log(data);
//  });
//  .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
//    function (err, data) {
//      console.log(data);
//    }
//  );


//twit.search('nodejs OR #node', {}, function(err, data) {
//  console.log(data);
//});

twit.stream('statuses/sample', function(stream) {
  stream.on('data', function (data) {
    console.log(data);
  });
  stream.on('error', function (data) {
    console.log('error:'+ data);
  });
});


//client.setAuth(credentials.credentials.consumer_key,
//	       credentials.credentials.consumer_secret,
//	       credentials.credentials.access_token_key,
//   	       credentials.credentials.access_token_secret
//);


//twit.stream('statuses/sample', function(stream) {
//	stream.on('data', function(data) {
//		console.log(util.inspect(data));
//		io.sockets.emit('update', req.body);
//	});
//});


function handler(req, res) {
//	fs.readFile('index.html', function(err, data) {
//		res.writeHead(200, {
//			'Content-Type' : 'text/html'
//		});
//		res.end(data);
//	});
        res.send(200);
};

io.sockets.on('connection', function (socket) {
                console.log("Someone connected");
});

http.listen(8081, function() {
	console.log('%s listening at %s', http.name, http.url);
});
