'use strict';

const FileSystem = require('fs');
const OS = require('os');

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
        
        // First time setup
        app.get('/setup/:step', async (req, res) => {
            try {
                let users = await HashBrown.Helpers.UserHelper.getAllUsers();
                
                if(users && users.length > 0) { 
                    return res.status(400).render('error', { message: 'Cannot create first admin, users already exist. If you lost your credentials, please assign the the admin from the commandline.' });
                }

                res.render('setup', { step: req.params.step });
            } catch(e) {
                res.status(400).render('error', { message: e.message });
            }
        });

        // Login
        app.get('/login/', async (req, res) => {
            if(req.query.inviteToken) {
                try {
                    let user = await HashBrown.Helpers.UserHelper.findInviteToken(req.query.inviteToken);

                    res.render('login', { invitedUser: user });
                } catch(e) {
                    res.status(400).render('error', { message: e.message });
                }

            } else {
                try {
                    let users = await HashBrown.Helpers.UserHelper.getAllUsers();

                    if(!users || users.length < 1) { 
                        res.redirect('/setup/1');
                    } else {
                        res.render('login');
                    }
                } catch(e) {
                    res.status(400).render('error', { message: e.message });
                }
            }
        });

        // Dashboard
        app.get('/dashboard/:tab', async (req, res) => {
            try {
                let user = await ViewController.authenticate(req.cookies.token);

                user.clearSensitiveData();
                
                res.render('dashboard', {
                    tab: req.params.tab,
                    os: OS,
                    user: user,
                    app: require(APP_ROOT + '/package.json')
                });
            } catch(e) {
                res.status(403).redirect('/login');  
            }
        });

        // Test
        app.get('/test', (req, res) => {
            res.redirect('/test/frontend');
        });

        app.get('/test/:tab', async (req, res) => {
            try {
                let user = await ViewController.authenticate(req.cookies.token, null, null, true);

                res.render('test', {
                    user: user,
                    tab: req.params.tab
                });
            } catch(e) {
                res.status(400).render('error', { message: e.message });
            }
        });

        // Demo
        app.get('/demo/', (req, res) => {
            res.render('demo');
        });

        // Environment
        app.get('/:project/:environment/', async (req, res) => {
            try {
                let user = await ViewController.authenticate(req.cookies.token);
                
                if(!user.isAdmin && !user.scopes[req.params.project]) {
                    throw new Error('User "' + user.username + '" doesn\'t have project "' + req.params.project + '" in scopes');
                }  
                
                let project = await HashBrown.Helpers.ProjectHelper.getProject(req.params.project);

                if(project.environments.indexOf(req.params.environment) < 0) {
                    throw new Error('The environment "' + req.params.environment + '" could not be found in the project "' + project.settings.info.name + '"');
                }

                user.clearSensitiveData();

                res.render('environment', {
                    currentProject: project.id,
                    currentProjectName: project.settings.info.name,
                    currentProjectSettings: project.settings,
                    currentEnvironment: req.params.environment,
                    isMediaPicker: !!req.query.isMediaPicker,
                    user: user
                });
            } catch(e) {
                res.status(400).render('error', { message: e.message });
            }
        });
    }
}

module.exports = ViewController;
