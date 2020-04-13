/**
 * Initialises the service test
 */
function initServiceTest() {
    let messages = document.querySelector('.page--dashboard__backend-test__messages');
    let btnStart = document.querySelector('.page--dashboard__backend-test__run');

    let url = '/api/test';

    btnStart.addEventListener('click', async () => {
        let result = '';
        
        messages.innerHTML = '';
        
        try {
            result = await HashBrown.Service.RequestService.customRequest('post', url);
        
        } catch(e) {
            result = e.message;    
        
        }
        
        messages.innerHTML = result;
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

        var sw = document.createElement('div');
        sw.className = 'widget--input__checkbox-switch';
        
        var bg = document.createElement('div');
        bg.className = 'widget--input__checkbox-background';

        var input = document.createElement('input');
        input.className = 'widget--input__checkbox-input';
        input.type = 'checkbox';
        input.id = 'checkbox-' + checkKey;

        div.appendChild(input);
        div.appendChild(bg);
        div.appendChild(sw);

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
