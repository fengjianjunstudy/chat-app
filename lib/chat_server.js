var socketio = require('socket.io');
var io;
var guestNum = 1;
var nickNames= {};
var namesUsed = [];
var currentRoom = {};
function assignGuestName(socket,guestNum,nickNames,namesUsed){
    var name = 'guest'+guestNum;
    nickNames[socket.id] = name;
    namesUsed.push(name);
    socket.emit('nameResult',{success:true,name:name})
    return guestNum++;
}
exports.listen = function(server){
    console.log(server);
    io = socketio.listen(server);
    server.listen(3000);
    //io.set('log level',1);
    //console.log(io.sockets);
    io.sockets.on('connection',function(socket){
        console.log('===================');
        guestNum = assignGuestName(socket,guestNum,nickNames,namesUsed);
        console.log('guestNum',guestNum);
        //joinRoom(socket,'Lobby');
        //handleMessageBoardCasting(socket,nickNames);
        //handleNameChange(socket,nickNames,namesUsed);
        //handleRoomJoin(socket);
        //socket.on('room',function(){
        //    socket.emit('room',io.sockets.manager.room);
        //})
        //handleClientDisconnection(socket,nickNames,namesUsed);
    })
}