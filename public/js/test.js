/**
 * Initialises the service test
 */
function initServiceTest() {
    var divMessages = document.querySelector('.page--dashboard__backend-test__messages');
    var btnStart = document.querySelector('.page--dashboard__backend-test__run');
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
    var btnReset = document.querySelector('.page--dashboard__frontend-test__reset');
    var liChecks = document.querySelectorAll('.page--dashboard__frontend-test li');

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
        var checkboxes = document.querySelectorAll('.page--dashboard__frontend-test input');

        delete cache.ui;

        setCache(cache);

        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        })
    });

    liChecks.forEach(function(liCheck) {
        liCheck.className = 'page--dashboard__frontend-test__check';

        var checkKey = liCheck.innerHTML.toLowerCase().replace(/ /g, '-');
        var cache = getCache();

        var div = document.createElement('div');
        div.className = 'widget widget--input checkbox page--dashboard__frontend-test__check__checkbox';

        var extra = document.createElement('div');
        extra.className = 'widget--input__checkbox-extra fa fa-check';

        var input = document.createElement('input');
        input.className = 'widget--input__checkbox-input';
        input.type = 'checkbox';
        input.id = 'checkbox-' + checkKey;

        div.appendChild(input);
        div.appendChild(extra);

        liCheck.insertBefore(div, liCheck.firstChild);

        if(cache.ui[checkKey] === true) {
            input.checked = true;
        }

        input.addEventListener('change', function(e) {
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
if(location.href.indexOf('/frontend') > -1) {
    initUITests();
} else {
    initServiceTest();
}
