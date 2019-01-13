'use strict';

const FileSystem = require('fs');
const OS = require('os');

// TODO: Make this a GIT submodule
const Marked = require('marked');

/**
 * The controller for views
 *
 * @memberof HashBrown.Server.Controllers
 */
class ViewController extends HashBrown.Controllers.Controller {
    /**
     * Initialises this controller
     */
    static init(app) {
        // Catch evildoers
        app.get(['/admin', '/user', '/wp-admin', '/umbraco' ], (req, res) => {
            res.sendStatus(404);
        });

        // Root
        app.get(['/', '/dashboard'], (req, res) => {
            res.redirect('/dashboard/projects');
        });
        
        // Text
        app.get('/text/:name', (req, res) => {
            let filename = '';
            let isMarkdown = false;

            switch(req.params.name) {
                case 'readme':
                    filename = 'README.md';
                    isMarkdown = true;
                    break;

                case 'license':
                    filename = 'LICENSE';
                    break;

                case 'welcome':
                    filename = 'WELCOME.md';
                    isMarkdown = true;
                    break;
            }

            FileSystem.readFile(APP_ROOT + '/' + filename, (err, file) => {
                if(err) {
                    res.status(400).render('error', { message: e.message });
                } else {
                    res.status(200).send(isMarkdown ? Marked(file.toString()) : file.toString());
                }
            });
        });

        // First time setup
        app.get('/setup/:step', (req, res) => {
            return HashBrown.Helpers.UserHelper.getAllUsers()
            .then((users) => {
                if(users && users.length > 0) { 
                    return res.status(400).render('error', { message: 'Cannot create first admin, users already exist. If you lost your credentials, please assign the the admin from the commandline.' });
                }

                res.render('setup', { step: req.params.step });
            });
        });

        // Login
        app.get('/login/', (req, res) => {
            if(req.query.inviteToken) {
                HashBrown.Helpers.UserHelper.findInviteToken(req.query.inviteToken)
                .then((user) => {
                    res.render('login', {
                        invitedUser: user
                    });
                })
                .catch((e) => {
                    res.status(400).render('error', { message: e.message });
                });

            } else {
                HashBrown.Helpers.UserHelper.getAllUsers()
                .then((users) => {
                    if(!users || users.length < 1) { 
                        res.redirect('/setup/1');
                    } else {
                        res.render('login');
                    }
                })
                .catch((e) => {
                    res.status(400).render('error', { message: e.message });
                });

            }
        });

        // Dashboard
        app.get('/dashboard/:tab', (req, res) => {
            ViewController.authenticate(req.cookies.token)
            .then((user) => {
                res.render('dashboard', {
                    tab: req.params.tab,
                    os: OS,
                    user: user,
                    app: require(APP_ROOT + '/package.json')
                });
            })
            .catch((e) => {
                res.status(403).redirect('/login');  
            });
        });

        // Test
        app.get('/test', (req, res) => {
            res.redirect('/test/frontend');
        });

        app.get('/test/:tab', (req, res) => {
            ViewController.authenticate(req.cookies.token, null, null, true)
            .then((user) => {
                FileSystem.readFile(APP_ROOT + '/public/md/ui-checklist.md', (err, file) => {
                    if(err) {
                        return res.status(400).render('error', { message: err.message });
                    }
                
                    res.render('test', {
                        user: user,
                        tab: req.params.tab,
                        uiChecklistHtml: Marked(file.toString())
                    });
                });

            })
            .catch((e) => {
                res.status(400).render('error', { message: e.message });
            });
        });

        // Demo
        app.get('/demo/', (req, res) => {
            res.render('demo');
        });

        // Environment
        app.get('/:project/:environment/', (req, res) => {
            let user;
            let project;

            HashBrown.Helpers.ProjectHelper.getProject(req.params.project)
            .then((result) => {
                project = result;

                if(project.environments.indexOf(req.params.environment) < 0) {
                    return Promise.reject(new Error('The environment "' + req.params.environment + '" could not be found in the project "' + project.settings.info.name + '"'));
                }

                return ViewController.authenticate(req.cookies.token);
            })
            .then((result) => {
                user = result;

                if(!user.isAdmin && !user.scopes[req.params.project]) {
                    return Promise.reject(new Error('User "' + user.username + '" doesn\'t have project "' + req.params.project + '" in scopes'));
                }  

                res.render('environment', {
                    currentProject: project.id,
                    currentProjectName: project.settings.info.name,
                    currentEnvironment: req.params.environment,
                    user: user
                });
            })
            .catch((e) => {
                res.status(400).render('error', { message: e.message });
            });
        });
    }
}

module.exports = ViewController;
