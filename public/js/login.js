$('.login').each(function() {
    var $login = $(this);
    
    $(document).keyup(function(e) {
        if(e.which == 13) {
            $login.find('button').click();
        }
    });

    $login.find('button').click(function(e) {
        e.preventDefault();

        var username = $login.find('input[type="text"]').val();
        var password = $login.find('input[type="password"]').val();
    
        $.ajax({
            type: 'POST',
            url: '/api/user/login',
            data: {
                username: username,
                password: password
            },
            success: function(token) {
                localStorage.setItem('token', token);

                location = location.href.replace(location.protocol + '//' + location.hostname + location.pathname + '?path=', '');
            },
            error: function(e) {
                alert('Bad credentials');
            }
        });
    }); 
}); 
