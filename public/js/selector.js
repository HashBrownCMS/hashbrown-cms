$('select').each(function() {
    var $select = $(this);

    $.ajax({
        type: 'GET',
        url: $select.attr('data-api') + '?token=' + localStorage.getItem('token'),
        success: function(options) {
            if(Array.isArray(options)) {
                for(var i in options) {
                    var option = options[i];
                    
                    $select.append(
                        $('<option value="' + option + '">' + option + '</option>')
                    );
                }
            
            } else {
                console.log(options);

            }
        },
        error: function(e) {
            if(e.status == 403) {
                location = '/login/?path=' + location.pathname;
            }
        }
    });
});
