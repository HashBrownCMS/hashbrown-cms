/**
 * Initialises the service test
 */
function initServiceTest() {
    var divMessages = document.querySelector('#service .service-test__messages');
    var btnStart = document.querySelector('#service .btn');
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
}

/**
 * Initialises the UI tests
 */
function initUITests() {
    var btnReset = document.querySelector('#ui .btn');
    var liChecks = document.querySelectorAll('#ui .container li');

    function getCache() {
        var cache = {};

        try {
            cache = JSON.parse(localStorage.getItem('test') || '{}');
        } catch(e) {

        }

        if(!cache.ui) { cache.ui = {}; }

        return cache;
    }

    function setCache(cache) {
        localStorage.setItem('test', JSON.stringify(cache));
    }

    btnReset.addEventListener('click', function(e) {
        var cache = getCache();
        var checkboxes = document.querySelectorAll('#ui input');

        delete cache.ui;

        setCache(cache);

        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        })
    });

    liChecks.forEach(function(liCheck) {
        var checkKey = liCheck.innerHTML;
        var cache = getCache();

        var inputCheck = document.createElement('input');
        inputCheck.className = 'form-control';
        inputCheck.type = 'checkbox';

        liCheck.insertBefore(inputCheck, liCheck.firstChild);

        if(cache.ui[checkKey] === true) {
            inputCheck.checked = true;
        }

        inputCheck.addEventListener('change', function(e) {
            var isChecked = e.currentTarget.checked;
            var cache = getCache();

            if(isChecked) {
                cache.ui[checkKey] = true;
            } else {
                delete cache.ui[checkKey];
            }

            setCache(cache);
        });
    });
}

// Init tests
initUITests();
initServiceTest();
