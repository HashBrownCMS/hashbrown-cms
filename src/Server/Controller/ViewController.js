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
            '/setup': {
                redirect: '/setup/1'
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
     * @param {Error} error
     *
     * @return {HttpResponse} Response
     */
    static error(error) {
        checkParam(error, 'error', Error, true);
        
        switch(error.code) {
            default:
                return super.error(error);
            
            case 401:
                let users = await HashBrown.Entity.User.list();

                if(!users || users.length < 1) {
                    return new HttpResponse('Redirecting to setup...', 302, { 'Location': '/setup' });
                }

                return this.render('login', { message: error.message });
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
    static render(template, model = {}, code = 200) {
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
     * Browser update screen
     */
    static async updateBrowser(request, params, body, query, user) {
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
    static async readme(request, params, body, query, user) {
        let markdown = await HashBrown.Service.FileService.read(Path.join(APP_ROOT, 'README.md'));
        let html = HashBrown.Service.MarkdownService.toHtml(markdown.toString('utf8'));

        return new HttpResponse(html, 200, { 'Content-Type': 'text/html' });
    }
    
    /**
     * Login
     */
    static async login(request, params, body, query, user) {
        return this.render('login');
    }
    
    /**
     * First time setup
     */
    static async setup(request, params, body, query, user) {
        let users = await HashBrown.Entity.User.list();
        
        if(users && users.length > 0) { 
            return new HttpResponse('Cannot create first admin, users already exist. If you lost your credentials, please assign the admin using CLI.', 403);
        }

        return this.render('setup', { step: params.step || 1 });
    }

    /**
     * Dashboard
     */
    static async dashboard(request, params, body, query, user) {
        let themes = await HashBrown.Service.AppService.getThemes();

        let uptime = {};

        uptime['seconds'] = OS.uptime();
        uptime['days'] = Math.floor(uptime['seconds'] / (60*60*24));
        uptime['hours'] = Math.floor(uptime['seconds'] / (60*60)) - uptime['days'] * 24;
        uptime['minutes'] = Math.floor(uptime['seconds'] % (60*60) / 60);

        return this.render('dashboard', {
            tab: params.tab,
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
    static async test(request, params, body, query, user) {
        return this.render('test', {
            user: user,
            tab: params.tab
        });
    }

    /**
     * Demo
     */
    static async demo(request, params, body, query, user) {
        return this.render('demo', { title: 'Demo | HashBrown CMS' });
    }

    /**
     * Environment
     */
    static async environment(request, params, body, query, user) {
        let project = await HashBrown.Entity.Project.get(params.project);

        if(!project) {
            return new HttpResponse('Not found', 404);
        }
        
        let themes = await HashBrown.Service.AppService.getThemes();
        
        return this.render('environment', {
            title: project.settings.info.name,
            currentProject: project.id,
            currentProjectName: project.settings.info.name,
            currentProjectSettings: project.settings,
            currentEnvironment: params.environment,
            user: user,
            themes: themes
        });
    }
}

module.exports = ViewController;
