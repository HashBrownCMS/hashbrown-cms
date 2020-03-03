'use strict';

const FileSystem = require('fs');
const OS = require('os');
const Path = require('path');
const HTTP = require('http');

/**
 * The controller for views
 *
 * @memberof HashBrown.Server.Controller
 */
class ViewController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/': {
                redirect: '/dashboard'
            },
            '/dashboard': {
                redirect: '/dashboard/projects',
            },
            '/css/theme.css': {
                handler: this.theme
            },
            '/update-browser': {
                handler: this.updateBrowser
            },
            '/readme': {
                handler: this.readme
            },
            '/test': {
                redirect: '/test/frontend',
                user: true
            },
            '/demo': {
                handler: this.demo
            },
            '/setup/${step}': {
                hander: this.setup
            },
            '/dashboard/${tab}': {
                handler: this.dashboard,
                user: true
            },
            '/${project}/${environment}': {
                handler: this.environment,
                user: true
            }
        };
    }
    
    /**
     * Handles an error
     *
     * TODO: Redirect to setup screen when needed
     *
     * @param {HttpError} error
     */
    static error(error) {
        checkParam(error, 'error', HttpError, true);
       
        switch(error.code) {
            default:
                return super.error(error);
            
            case 402:
                return new HttpResponse(error.message, 302, { 'Location': '/login', 'Content-Type': 'text/plain' });
        }
    }

    /**
     * Renders a page
     *
     * @param {String} template
     * @param {Object} model
     * @param {Number} code
     *
     * @return {HttpResponse} Rendered content
     */
    static async render(template, model = {}, code = 200) {
        checkParam(template, 'template', String, true);
        checkParam(model, 'model', Object);
        checkParam(code, 'code', Number, true);

        let templatePath = Path.join(APP_ROOT, 'template', 'page', template);
        
        let view = new HashBrown.Entity.View.ViewBase({
            template: require(templatePath),
            model: model
        });
    
        return new HttpResponse(view.render(), code, { 'Content-Type': 'text/html' });
    }

    /**
     * Serve theme
     */
    static async theme(req, params, body, user) {
        let theme = user && user.theme ? user.theme : 'default';

        let path = Path.join(APP_ROOT, 'theme', theme + '.css');
        let content = await HashBrown.Service.FileService.read(path);

        return new HttpResponse(content, 200, { 'Content-Type': 'text/css' });
    }

    /**
     * Browser update screen
     */
    static async updateBrowser(req, params, body, user) {
        return this.render(
            'error',
            {
                message: 'Your browser is out-of-date. Please upgrade to a more recent version.'
            },
            400
        );
    }

    /**
     * Readme
     */
    static async readme(req, params, body, user) {
        let markdown = await HashBrown.Service.FileService.read(Path.join(APP_ROOT, 'README.md'));
        let html = HashBrown.Service.MarkdownService.toHtml(markdown.toString('utf8'));

        return new HttpResponse(html, 200, { 'Content-Type': 'text/html' });
    }
    
    /**
     * First time setup
     */
    static async setup(req, params, body, user) {
        let users = await HashBrown.Service.UserService.getAllUsers();
        
        if(users && users.length > 0) { 
            return res.status(400).render('error', { message: 'Cannot create first admin, users already exist. If you lost your credentials, please assign the admin using CLI.' });
        }

        return this.render('setup', { step: params.step });
    }

    /**
     * Dashboard
     */
    static async dashboard(req, params, body, user) {
        user.clearSensitiveData();
        
        let themes = await HashBrown.Service.AppService.getThemes();

        let uptime = {};

        uptime['seconds'] = OS.uptime();
        uptime['days'] = Math.floor(uptime['seconds'] / (60*60*24));
        uptime['hours'] = Math.floor(uptime['seconds'] / (60*60)) - uptime['days'] * 24;
        uptime['minutes'] = Math.floor(uptime['seconds'] % (60*60) / 60);

        return this.render('dashboard', {
            tab: req.params.tab,
            os: OS,
            user: user,
            app: require(Path.join(APP_ROOT, 'package.json')),
            uptime: uptime,
            themes: themes
        });
    }

    /**
     * Test
     */
    static async test(req, params, body, user) {
        user.clearSensitiveData();
            
        return this.render('test', {
            user: user,
            tab: params.tab
        });
    }

    /**
     * Demo
     */
    static async demo(req, params, body, user) {
        return this.render('demo', { title: 'Demo | HashBrown CMS' });
    }

    /**
     * Environment
     */
    static async environment(req, params, body, user) {
        user.clearSensitiveData();

        let themes = await HashBrown.Service.AppService.getThemes();
        
        return this.render('environment', {
            title: project.settings.info.name,
            currentProject: project.id,
            currentProjectName: project.settings.info.name,
            currentProjectSettings: project.settings,
            currentEnvironment: req.params.environment,
            user: user,
            themes: themes
        });
    }
}

module.exports = ViewController;
