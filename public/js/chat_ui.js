var socket = io.connect();
console.log(socket)
$(document).ready(function(){
    var chat = new Chat(socket)
    $('#send-form').on('submit',function(){
        var txt = $('#send_messages').val();
        if(txt.indexOf('/') == 0){
            chat.processCommand(txt);
        }
        return false;
    })
    socket.on('nameResult',function(data){
        console.log(data);

    })
    socket.on('joinResult',function(data){
        console.log(data);
    })
    socket.on('message',function(data){
        console.log(data);
    })
    socket.on('room',function(data){
        console.log(data);
    })
});
//io.on('connect', function(socket){
//
//    console.log('connection')
//});
