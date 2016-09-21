function apiCall(method, url, data) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), url);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        if(data) {
            if(typeof data === 'object') {
                data = JSON.stringify(data);
            }
            
            xhr.send(data);

        } else {
            xhr.send();
        
        }

        xhr.onreadystatechange = () => {
            let DONE = 4;
            let OK = 200;
            let NOT_MODIFIED = 304;
            
            if (xhr.readyState === DONE) {
                if(xhr.status == OK || xhr.status == NOT_MODIFIED) {
                    let response = xhr.responseText;

                    if(response && response != 'OK') {
                        try {
                            response = JSON.parse(response);
                        
                        } catch(e) {
                            console.log('Response: ' + response, this)
                            console.log(e, this)

                        }
                    }

                    resolve(response);

                } else {
                    reject(new Error(xhr.responseText));
                
                }
            }
        }
    });
};

$('.login').each(function() {
    var $login = $(this);
    
    $(document).keyup(function(e) {
        if(e.which == 13) {
            $login.find('button').click();
        }
    });

    $login.submit(function(e) {
        e.preventDefault();

        var username = $login.find('input[type="text"]').val();
        var password = $login.find('input[type="password"]').val();
        var data = {
            username: username,
            password: password
        };

        let apiPath = '/api/user/login';
        let inviteToken = $login.attr('data-invite-token');

        if(inviteToken) {
            apiPath = '/api/user/activate';
            
            data.inviteToken = inviteToken;
        }

        apiCall('post', apiPath, data)
        .then(function() {
            let newLocation = location.href.replace(location.protocol + '//' + location.hostname + location.pathname, '');
            newLocation = newLocation.replace('?path=', '') || '';
            
            // Check for initial hash
            if(newLocation[0] == '#') {
                newLocation = newLocation.slice(1);
            }

            // Check for initial slash
            if(newLocation[0] != '/') {
                newLocation = '/' + newLocation;
            }

            location = newLocation || '/';
        })
        .catch(function(e) {
            alert(e.toString());
        });
    }); 
}); 
