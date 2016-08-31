'use strict';

// Helper functions
require('./helpers');

// Get package file
window.app = require('../../../package.json');

// Views
window.ProjectEditor = require('./views/dashboard/ProjectEditor');

// Models
window.Project = require('../../common/models/Project');

apiCall('get', 'server/projects')
.then((projects) => {
    for(let i in projects) {
        apiCall('get', 'server/projects/' + projects[i])
        .then((project) => {
            let projectEditor = new ProjectEditor({
                model: new Project(project)
            });

            $('.dashboard .projects').append(projectEditor.$element);
        })
        .catch(errorModal);
    }
})
.catch(errorModal);
