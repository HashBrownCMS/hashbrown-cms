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

$('.page--setup__step').each(function() {
    var $form = $(this);
    
    $(document).keyup(function(e) {
        if(e.which == 13) {
            $login.find('button').click();
        }
    });

    $form.submit(function(e) {
        e.preventDefault();

        var data = {};
        var formArray = $form.serializeArray();

        for (var i = 0; i < formArray.length; i++) {
            if(!formArray[i].value) { continue; }
            
            let objMatches = formArray[i].name.match(/([a-zA-Z]+)\[([a-zA-Z]+)\]/);

            if(objMatches && objMatches.length === 3) {
                if(!data[objMatches[1]]) {
                    data[objMatches[1]] = {};
                }
               
                data[objMatches[1]][objMatches[2]] = formArray[i].value;

            } else {
                data[formArray[i].name] = formArray[i].value;
            }
        }
        
        apiCall('post', $form.attr('action'), data)
        .then(function() {
            let step = parseInt($form.data('step')); 

            if(step < 1) {
                location = '/setup/' + (step + 1);
            } else {
                location = '/';
            }
        })
        .catch(function(e) {
            $('.widget--message').remove();
            $('.page--setup').prepend('<div class="widget widget--message fixed fixed--top warning">' + e + '</div>');
        });
    }); 
}); 
