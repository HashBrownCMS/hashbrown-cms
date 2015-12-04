require('../client');
require('./partials/navbar');

var Issue = require('./partials/issue');

api.issues(function(issues) {
    $('.page-content').html(
        _.div({class: 'container'},
            _.each(
                issues,
                function(i, issue) {
                    return new Issue({
                        model: issue
                    }).$element;
                }
            )
        )
    );
});
