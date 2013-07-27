var restify = require('restify');
var socketio = require('socket.io');
var fs = require('fs');
var util = require('util');
var twitter = require('twitter');

var credentials = require('./credentials.js');

var credentailsFile = __dirname + '/credentails.json';

var twit = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

twit.stream('statuses/sample', function(stream) {
	stream.on('data', function(data) {
		console.log(util.inspect(data));
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


function data(req, res, next) {
	if (req.body === undefined) {
		return next(new restify.InvalidContentError(
				'Invalid JSON in the POST body'));
	}
	res.send(202);

	if (jsonObjects.lenght > 0) {
                console.log("emit: " + req.body);
		io.sockets.emit('update', req.body);
	}
	return next();
}



var server = restify.createServer();
server.use(restify.queryParser());

//plugin sets up all of the default headers for the system
//server.use(restify.fullResponse());
//remapps the body json to params but wont work with more complex json objects
server.use(restify.bodyParser({ mapParams: false }));

server.post('/data', data);

var io = socketio.listen(server);


io.sockets.on('connection', function (socket) {
                console.log("Someone connected");
});

server.listen(8081, function() {
	console.log('%s listening at %s', server.name, server.url);
});