'use strict';

class IssuesEditor extends View {
    constructor(params) {
        super(params);

        this.fetch();
    }

    render() {
        console.log(this.model);
    }
}

module.exports = IssuesEditor;
