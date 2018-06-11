var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

var roomCount = 1;
io.on('connection', function(socket) {
   
   //Only 5 clients max per room, otherwise join next room
   if(io.nsps['/'].adapter.rooms["room-" + roomCount] && 
   io.nsps['/'].adapter.rooms["room-"+roomCount].length > 1) {
    roomCount++;
   }
   socket.join("room-" + roomCount);

   //broadcast someone joined in the room
   io.sockets.in("room-" + roomCount).emit('joinRoom', "Someone joined in room- " + roomCount + `(${io.nsps['/'].adapter.rooms["room-"+roomCount].length})`);
})

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});