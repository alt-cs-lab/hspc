const app = require('./server');
//const io = require('socket.io')();
//const port = 8000;

const server = app.listen(process.env.PORT || 3001, () => {
    console.log('App running on port ' + server.address().port + "\n");
});

// TWP TODO Websocket Not Functioning
// WebSocket
// io.on('connection', function (socket) {
//     console.log(socket.id, 'Connected');
//     socket.on('disconnect', function () {
//         console.log(socket.id, 'Disconnected');
//     });
//     socket.on('click', function (data) {
//         //io.sockets.emit('broadcast', data);
//         socket.broadcast.to(1).emit('broadcast', data);
//     });
//     socket.on('scoreboard', function() {
//         socket.join(1);
//     });
//     socket.on('exit scoreboard', function(){
//         socket.leave(1);
//     })
// });

// io.listen(port);
// console.log('Websocket listening on port', port);