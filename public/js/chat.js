function Chat(socket){
    this.socket = socket;
}
Chat.prototype.sendMessage = function(room,mes){
    var message = {
        room:room,
        text:mes
    }
    this.socket.emit('message',message)
}
Chat.prototype.changeRoom = function(room){
    this.socket.emit('join',room)
}
Chat.prototype.processCommand = function(command){
    var words = command.split(' ');
    var c = words[0].substring(1,words[0].length).toLocaleLowerCase();
    var message = '';
    switch (c){
        case 'join':
            var room = words.slice(1).join(' ');
            this.changeRoom(room);
            break;
        case 'nick':
            var name = words.slice(1).join(' ');
            this.socket.emit('nameAttempt',name)
            break;
        default:
            message = '命令无法识别';
    }
    return message;
}