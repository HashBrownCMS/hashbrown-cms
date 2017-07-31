var divMessages = document.querySelector('.messages');
var btnStart = document.querySelector('.btn-start');
var ulSection = null;    

var url = 'ws://' + location.host + '/api' + location.pathname;
var socket = new WebSocket(url);

var errors = 0;

btnStart.style.display = 'none';

socket.onopen = function() {
    btnStart.style.display = null;
};

socket.onmessage = function(ev) {
    try{
        var data = JSON.parse(ev.data);

        if(data.isDone) {
            divMessages.innerHTML += '<h4>' + (errors > 0 ? 'TEST FAILED' : 'TEST SUCCEEDED') + '</h4>';

        } else {
            if(data.isSection) {
                divMessages.innerHTML += '<h4>' + data.message + '</h4>';

                ulSection = document.createElement('ul');

                divMessages.appendChild(ulSection);
            
            } else if(data.error) {
                errors++;

                var liError = document.createElement('li');
                liError.innerHTML = '[ERROR] ' + data.error;
                ulSection.appendChild(liError);
            
            } else {
                var liMessage = document.createElement('li');
                liMessage.innerHTML = data.message;
                ulSection.appendChild(liMessage);

            }
        }

    } catch(e) {
        alert(e.message);
    
    }
};

btnStart.addEventListener('click', function() {
    socket.send('start');

    divMessages.innerHTML = '';
});
