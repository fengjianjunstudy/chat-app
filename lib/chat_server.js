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
function joinRoom(socket,room){
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinRoom',{room:room});
    socket.broadcast.to(room).emit('message',{text:nickNames[socket.id]+'has joined'+room})
    usersInroom = io.sockets.client(room);
    if(usersInroom.length>0){
        var usersInRoomSumary = 'users in currently in'+room+'.';
        for(var index in usersInroom){
            var userSocketId = usersInroom[index].id;
            if(userSocketId != socket.id){
                if(index>0){
                    usersInRoomSumary += ',';
                }
            }
            usersInRoomSumary += nickNames[userSocketId];
        }
        usersInRoomSumary += '.';
        socket.emit('message',{text:usersInRoomSumary})
    }
}
function handleMessageBoardCasting(socket,nickNames){
    socket.on('message',function(message){
        socket.broadcast.to(message.room).emit('message',{text:nickNames[socket.id]+":"+message.text})
    })
}
function handleRoomJoin(socket){
    socket.on('join',function(room){
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket,room);
    })
}
function handleNameChange(socket,nickNames,namesUsed){
    socket.on('nameAttempt',function(name){
        if(name.indexOf('guest') == 0){
            socket.emit('nameResult',{success:false,message:'name cannot begin with guest'})
        }else{
            if(namesUsed.indexOf('name') == -1){
                var preName = nickNames[socket.id];
                var preIndex = namesUsed.indexOf(preName);
                namesUsed.push(name);
                delete namesUsed[preIndex];
                nickNames[socket.id] = name;
                socket.emit('nameResult',{success:true,name:name})
                socket.broadcast.to(currentRoom[socket.id]).emit("message",{text:preName + "is now known as" + name})
            }else{
                socket.emit({success:false,message:'that name is already in use'})
            }
        }
    })
}
function handleClientDisconnection(socket,nickNames,namesUsed){
    socket.on('disconnect',function(){
        var name = nickNames[socket.id];
        var index = namesUsed.indexOf(name);
        delete namesUsed[index];
        delete nickNames[socket.id];
    })
}
exports.listen = function(server){
    io = socketio(server);
    server.listen(80,function(){
        console.log('listen 3000')
    });
    io.sockets.on('connection',function(socket){
        guestNum = assignGuestName(socket,guestNum,nickNames,namesUsed);
        socket.on('rooms', function(msg){
            socket.emit('mes','hehe'+msg);
        });
        joinRoom(socket,'Lobby');
        handleMessageBoardCasting(socket,nickNames);
        handleNameChange(socket,nickNames,namesUsed);
        handleRoomJoin(socket);
        socket.on('room',function(){
            socket.emit('room',io.sockets.manager.room);
        })
        handleClientDisconnection(socket,nickNames,namesUsed);
    })
}