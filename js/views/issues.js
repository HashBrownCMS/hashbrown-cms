require('../client');
require('./partials/navbar');

var Issue = require('./partials/issue');
var IssueModal = require('./partials/issue-modal');

api.issues(function(issues) {
    $('.page-content').html([
        _.div({class: 'container'},
            _.each(
                issues,
                function(i, issue) {
                    return new Issue({
                        model: issue
                    }).$element;
                }
            )
        ),
        new IssueModal().$element
    ]);
});
