//var http = require('http').createServer(handler);
//var io = require('socket.io').listen(http);
//var util = require('util');
//var twitter = require('twitter');

var fridge = require('./fridge');
var credentials = require('./credentials.js');

var twit = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

twit.stream('statuses/sample', function(stream) {
	stream.on('data', function(data) {
		console.log(util.inspect(data));
		io.sockets.emit('update', req.body);
	});
});


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
	console.log('%s listening at %s', server.name, server.url);
});