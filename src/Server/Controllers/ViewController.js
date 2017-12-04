'use strict';

const FileSystem = require('fs');
const Marked = require('marked');
const OS = require('os');

const ProjectHelper = require('Server/Helpers/ProjectHelper');
const UserHelper = require('Server/Helpers/UserHelper');

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
        // Catch evil-doers
        app.get([ '/wp-admin', '/wp-admin/', '/umbraco', '/umbraco/' ], (req, res) => {
            res.sendStatus(404);
        });

        // Root
        app.get('/', (req, res) => {
            res.redirect('/dashboard/projects');
        });
        
        app.get('/dashboard', (req, res) => {
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
                    res.status(502).send(e.message);
                } else {
                    res.status(200).send(isMarkdown ? Marked(file.toString()) : file.toString());
                }
            });
        });

        // First time setup
        app.get('/setup/:step', (req, res) => {
            UserHelper.getAllUsers()
            .then((users) => {
                if(!users || users.length < 1) { 
                    res.render('setup', { step: req.params.step });
                } else {
                    res.redirect('/');
                }
            })
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
                    res.render('login', {
                        message: e.message   
                    });
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
                    res.render('login', {
                        message: e.message   
                    });
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

            ProjectHelper.environmentExists(req.params.project, req.params.environment)
            .then((exists) => {
                if(!exists) {
                    return Promise.reject(new Error('404: The project and environment "' + req.params.project + '/' + req.params.environment + '" could not be found'));
                }

                return ViewController.authenticate(req.cookies.token);
            })
            .then((authUser) => {
                user = authUser;

                if(!user.isAdmin && !user.scopes[req.params.project]) {
                    return Promise.reject(new Error('User "' + user.username + '" doesn\'t have project "' + req.params.project + '" in scopes'));
                }  

                res.render('environment', {
                    currentProject: req.params.project,
                    currentEnvironment: req.params.environment,
                    user: user
                });
            })
            .catch((e) => {
                if(e.message.indexOf('404') == 0) {
                    res.status(404).render('404', { message: e.message });
                } else {
                    res.status(403).redirect('/login?path=/' + req.params.project + '/' + req.params.environment);  
                }
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
                        return res.status(502).send(e.message);

                    }
                
                    res.render('test', {
                        user: user,
                        tab: req.params.tab,
                        uiChecklistHtml: Marked(file.toString())
                    });
                });

            })
            .catch(() => {
                res.sendStatus(401);
            });
        });

        // Demo
        app.get('/demo/', (req, res) => {
            res.render('demo');
        });
    }
}

module.exports = ViewController;
