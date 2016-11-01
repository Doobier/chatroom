var http = require('http');
var fs = require('fs');
var socketIO = require('socket.io');

var httpServer = http.createServer(function(req,res){
	var filePath = req.url.substring(1);

	fs.readFile(filePath,function(err,data){
		if( err ){
			res.write('404');
			res.end();
		} else {
			res.write(data);
			res.end();
		}
	})
});

httpServer.listen('8899');

console.log('http://localhost:8899');

var socketArray = [];

var ws = socketIO.listen(httpServer);
ws.on('connection',function(socket){

	socketArray.push(socket);

	socket.on('message',function(data){
		for (var i = socketArray.length - 1; i >= 0; i--) {
			if( socketArray[i] !== socket ){
				socketArray[i].emit('received',data)
			}
		}
	})
})
