var ulMessages = document.querySelector('.messages');
var btnStart = document.querySelector('.btn-start');
    
var url = 'ws://' + location.host + '/api' + location.pathname;
var socket = new WebSocket(url);

btnStart.style.display = 'none';

socket.onopen = function() {
    btnStart.style.display = null;
};

socket.onclose = function() {
    ulMessages.innerHTML += '<li>DONE!</li>';
};

socket.onmessage = function(event) {
    if(event.data === 'done') {
        socket.close();
    } else {
        ulMessages.innerHTML += '<li>' + event.data + '</li>';
    }
};

btnStart.addEventListener('click', function() {
    socket.send('start');
});
