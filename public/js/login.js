$('.form').each(function() {
    $(this).find('button').click(function(e) {
        e.preventDefault();

        var username = $(this).parents('.form').find('input[type="text"]').val();
        var password = $(this).parents('.form').find('input[type="password"]').val();
    
        $.ajax({
            type: 'POST',
            url: '/api/admin/login',
            data: {
                username: username,
                password: password
            },
            success: function(token) {
                localStorage.setItem('token', token);

                location = '/';
            },
            error: function(e) {
                alert('Bad credentials');
            }
        });
    }); 
}); 
