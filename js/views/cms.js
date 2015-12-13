require('../client');
require('./partials/navbar');

let Tree = require('./partials/cms-tree');

class CMS extends View {
    constructor(args) {
        super(args);

        this.init();
    }

    render() {
        $('.page-content').html(
            _.div({class: 'cms-container'}, [
                new Tree().$element
            ])
        );
    }
}

new CMS();
