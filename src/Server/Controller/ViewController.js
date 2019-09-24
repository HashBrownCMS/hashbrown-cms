'use strict';

const FileSystem = require('fs');
const OS = require('os');
const Path = require('path');

/**
 * The controller for views
 *
 * @memberof HashBrown.Server.Controller
 */
class ViewController extends HashBrown.Controller.Controller {
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
                res.status(500).send(e.message);

            }

            res.sendFile(Path.join(APP_ROOT, 'theme', theme + '.css'));            
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
            try {
                let user = await this.authenticate(req.cookies.token);

                if(!user) { return res.redirect('/login?path=/readme'); }
                
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

        // Login
        app.get('/login/', async (req, res) => {
            try {
                let users = await HashBrown.Service.UserService.getAllUsers();

                if(!users || users.length < 1) { 
                    res.redirect('/setup/1');
                } else {
                    res.render('login');
                }
            } catch(e) {
                res.status(400).render('error', { message: e.message });
            }
        });

        // Dashboard
        app.get('/dashboard/:tab', async (req, res) => {
            let user = await this.authenticate(req.cookies.token);

            if(!user) { return res.redirect('/login?path=/dashboard/' + req.params.tab); }
            
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
        });

        // Test
        app.get('/test', (req, res) => {
            res.redirect('/test/frontend');
        });

        app.get('/test/:tab', async (req, res) => {
            try {
                let user = await this.authenticate(req.cookies.token, null, null, true);
                
                if(!user) { return res.redirect('/login?path=test/' + req.params.tab); }
                
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
            res.render('demo', { title: 'Demo | HashBrown CMS' });
        });

        // Environment
        app.get('/:project/:environment/', async (req, res) => {
            try {
                let user = await this.authenticate(req.cookies.token, req.params.project);

                if(!user) { return res.redirect('/login?path=/' + req.params.project + '/' + req.params.environment + '/'); }

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
                    isMediaPicker: !!req.query.isMediaPicker,
                    user: user,
                    themes: themes
                });
            } catch(e) {
                res.status(400).render('error', { message: e.message });
            }
        });
    }
}

module.exports = ViewController;
