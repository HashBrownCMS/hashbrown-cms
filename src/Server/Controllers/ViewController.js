'use strict';

const FileSystem = require('fs');
const Marked = require('marked');
const OS = require('os');

const ProjectHelper = require('Server/Helpers/ProjectHelper');
const UserHelper = require('Server/Helpers/UserHelper');
const ConfigHelper = require('Server/Helpers/ConfigHelper');

const Controller = require('./Controller');
const ApiController = require('./ApiController');

/**
 * The controller for views
 *
 * @memberof HashBrown.Server.Controllers
 */
class ViewController extends Controller {
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

            FileSystem.readFile(appRoot + '/' + filename, (err, file) => {
                if(err) {
                    res.status(400).render('error', { message: e.message });
                } else {
                    res.status(200).send(isMarkdown ? Marked(file.toString()) : file.toString());
                }
            });
        });

        // First time setup
        app.get('/setup/:step', (req, res) => {
            let check = () => {
                switch(parseInt(req.params.step)) {
                    case 1:
                        return ConfigHelper.exists('database')
                        .then((exists) => {
                            if(!exists) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('Database config exists already'));
                        });

                    case 2:
                        return UserHelper.getAllUsers()
                        .then((users) => {
                            if(!users || users.length < 1) { 
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('Cannot create first admin, users already exist. If you lost your credentials, please assign the the admin from the commandline.'));
                        });
                }

                return Promise.reject(new Error('No such step "' + req.params.step + '"'));
            };

            check()
            .then(() => {
                res.render('setup', { step: req.params.step });
            })
            .catch((e) => {
                res.status(400).render('error', { message: e.message });
            });
        });

        // Login
        app.get('/login/', (req, res) => {
            if(req.query.inviteToken) {
                UserHelper.findInviteToken(req.query.inviteToken)
                .then((user) => {
                    res.render('login', {
                        invitedUser: user
                    });
                })
                .catch((e) => {
                    res.status(400).render('error', { message: e.message });
                });

            } else {
                UserHelper.getAllUsers()
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
                    app: require(appRoot + '/package.json')
                });
            })
            .catch((e) => {
                res.status(403).redirect('/login');  
            });
        });

        // Environment
        app.get('/:project/:environment/', (req, res) => {
            let user;
            let project;

            ProjectHelper.getProject(req.params.project)
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

        // Test
        app.get('/:project/:environment/test', (req, res) => {
            res.redirect('/' + req.params.project + '/' + req.params.environment + '/test/frontend');
        });

        app.get('/:project/:environment/test/:tab', (req, res) => {
            ViewController.authenticate(req.cookies.token)
            .then((user) => {
                FileSystem.readFile(appRoot + '/public/md/ui-checklist.md', (err, file) => {
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
    }
}

module.exports = ViewController;
