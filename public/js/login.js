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

function getParam(name) {
    var url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);

    if (!results) return '';
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " ")) || '';
}

$('.login').each(function() {
    var $login = $(this);
    
    $(document).keyup(function(e) {
        if(e.which == 13) {
            $login.find('button').click();
        }
    });

    $login.submit(function(e) {
        e.preventDefault();

        var username = $login.find('input#username').val();
        var fullName = $login.find('input#full-name').val();
        var password = $login.find('input#password').val();

        if(!username || !password) {
            return;
        }

        var data = {
            username: username,
            password: password,
            fullName: fullName
        };

        let apiPath = '/api/user/login?persist=true';
        let inviteToken = $login.attr('data-invite-token');
        let firstTime = $login.attr('data-first-time');

        if(inviteToken) {
            apiPath = '/api/user/activate';
            
            data.inviteToken = inviteToken;
        }

        if(firstTime) {
            apiPath = '/api/user/first';
        }

        apiCall('post', apiPath, data)
        .then(function() {
            let newLocation = getParam('path');
           
            if(newLocation) { 
                // Check for initial hash
                if(newLocation[0] == '#') {
                    newLocation = newLocation.slice(1);
                }

                // Check for initial slash
                if(newLocation[0] != '/') {
                    newLocation = '/' + newLocation;
                }
            }

            location = newLocation || '/';
        })
        .catch(function(e) {
            $('.login-container .message').remove();
            $('.login-container').prepend('<div class="message raised">' + e + '</div>');
        });
    }); 
}); 
