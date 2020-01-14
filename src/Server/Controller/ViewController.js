'use strict';

const FileSystem = require('fs');
const OS = require('os');
const Path = require('path');

/**
 * The controller for views
 *
 * @memberof HashBrown.Server.Controller
 */
class ViewController extends HashBrown.Controller.ControllerBase {
    /**
     * Initialises this controller
     */
    static init(app) {
        // Serve theme
        app.get('/css/theme.css', async (req, res) => {
            let theme = 'default';

            try {
                let user = await this.authenticate(req.cookies.token);
            
                theme = user.theme || 'default';

            } catch(e) {
                // Ignore any errors, since we need a theme file no matter what

            } finally {
                res.sendFile(Path.join(APP_ROOT, 'theme', theme + '.css'));            

            }
        });

        // Catch evildoers
        app.get(['/admin', '/user', '/wp-admin', '/umbraco' ], (req, res) => {
            res.sendStatus(404);
        });

        // Inform users with old browsers
        app.get('/update-browser', (req, res) => {
            res.status(400).render('error', {
                message: 'Your browser is out-of-date. Please upgrade to a more recent version.'
            });
        });

        // Root
        app.get(['/', '/dashboard'], (req, res) => {
            res.redirect('/dashboard/projects');
        });
        
        // Readme
        app.get('/readme', async (req, res) => {
            let user = null;

            try {
                user = await this.authenticate(req.cookies.token);
            
            } catch(e) {
                let users = await HashBrown.Service.UserService.getAllUsers();

                if(!users || users.length < 1) { 
                    res.redirect('/setup/1');
                } else {
                    res.render('login');
                }

                return;
            }
            
            try {
                let markdown = await HashBrown.Service.FileService.read(Path.join(APP_ROOT, 'README.md'));
                let html = HashBrown.Service.MarkdownService.toHtml(markdown.toString('utf8'));

                res.status(200).send(html);

            } catch(e) {
                res.status(500).send(e.message);

            }
        });
        
        // First time setup
        app.get('/setup/:step', async (req, res) => {
            try {
                let users = await HashBrown.Service.UserService.getAllUsers();
                
                if(users && users.length > 0) { 
                    return res.status(400).render('error', { message: 'Cannot create first admin, users already exist. If you lost your credentials, please assign the admin using CLI.' });
                }

                res.render('setup', { step: req.params.step });

            } catch(e) {
                res.status(400).render('error', { message: e.message });
            
            }
        });

        // Dashboard
        app.get('/dashboard/:tab', async (req, res) => {
            let user = null;
            
            try {
                user = await this.authenticate(req.cookies.token);
            
            } catch(e) {
                let users = await HashBrown.Service.UserService.getAllUsers();

                if(!users || users.length < 1) { 
                    res.redirect('/setup/1');
                } else {
                    res.render('login');
                }

                return;
            }

            try {
                user.clearSensitiveData();
                
                let themes = await HashBrown.Service.AppService.getThemes();

                let uptime = {};
                uptime['seconds'] = OS.uptime();
                uptime['days'] = Math.floor(uptime['seconds'] / (60*60*24));
                uptime['hours'] = Math.floor(uptime['seconds'] / (60*60)) - uptime['days'] * 24;
                uptime['minutes'] = Math.floor(uptime['seconds'] % (60*60) / 60);

                res.render('dashboard', {
                    tab: req.params.tab,
                    os: OS,
                    user: user,
                    app: require(APP_ROOT + '/package.json'),
                    uptime: uptime,
                    themes: themes
                });

            } catch(e) {
                res.status(e.code || 502).render('error', { message: e.message });

            }
        });

        // Test
        app.get('/test', (req, res) => {
            res.redirect('/test/frontend');
        });

        app.get('/test/:tab', async (req, res) => {
            let user = null;
            
            try {
                user = await this.authenticate(req.cookies.token);
                this.authorize(user, null, null, true);
            
            } catch(e) {
                let users = await HashBrown.Service.UserService.getAllUsers();

                if(!users || users.length < 1) { 
                    res.redirect('/setup/1');
                } else {
                    res.render('login');
                }

                return;
            }
                
            res.render('test', {
                user: user,
                tab: req.params.tab
            });
        });

        // Demo
        app.get('/demo/', (req, res) => {
            res.render('demo', { title: 'Demo | HashBrown CMS' });
        });

        // Environment
        app.get('/:project/:environment/', async (req, res) => {
            let user = null;

            try {
                user = await this.authenticate(req.cookies.token);
            
            } catch(e) {
                let users = await HashBrown.Service.UserService.getAllUsers();

                if(!users || users.length < 1) { 
                    res.redirect('/setup/1');
                } else {
                    res.render('login');
                }

                return;
            }

            try {
                this.authorize(user, req.params.project);

                let project = await HashBrown.Service.ProjectService.getProject(req.params.project);

                if(project.environments.indexOf(req.params.environment) < 0) {
                    throw new Error('The environment "' + req.params.environment + '" could not be found in the project "' + project.settings.info.name + '"');
                }

                user.clearSensitiveData();

                let themes = await HashBrown.Service.AppService.getThemes();
                
                res.render('environment', {
                    title: project.settings.info.name,
                    currentProject: project.id,
                    currentProjectName: project.settings.info.name,
                    currentProjectSettings: project.settings,
                    currentEnvironment: req.params.environment,
                    user: user,
                    themes: themes
                });

            } catch(e) {
                res.status(e.code || 502).render('error', { message: e.message });
            
            }
        });
    }
}

module.exports = ViewController;
