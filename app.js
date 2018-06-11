var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});
var clients = 0;
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    clients++;

    //received a messege from a client
    socket.on('clientEvent', function(data) {
        console.log(data, '-> received in server side');
    });

    //Send a message after a timeout of 4seconds
   setTimeout(function() { 
        //Sending an object when emmiting an event
        socket.emit('fakeEvent', { description: 'Fake event has been broadcasted!'});
    }, 4000);

    //broadcast a new client is connected
    socket.emit('newclientconnect',{ description: 'new client connected!'});
   
    //Send a client number after a timeout of 4seconds
    setTimeout(function() { 
        //Sending an object when emmiting an event
        io.sockets.emit('newclientconnect',{ description: clients + ' client/s connected!'});
    }, 4000);
    
    //broadcast new number of clients after disconnection
    socket.on('disconnect', function () {
       clients--;
       console.log('client disconnected');
       io.sockets.emit('newclientconnect',{ description: clients + ' client/s connected!'});
    });

    // connecting a specific namespace
    // var nsp = io.of('/specific-namespace');
    // nsp.on('connection', function(socket) {
    // console.log('client connected');
    // });
 });

http.listen(3000, function() {
   console.log('listening on *:3000');
});