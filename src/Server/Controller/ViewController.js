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
                handler: this.updateBrowser,
                user: true
            },
            '/readme': {
                handler: this.readme,
                user: true
            },
            '/demo': {
                handler: this.demo
            },
            '/setup': {
                handler: this.setup,
                methods: [ 'GET', 'POST' ]
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
     * Handles a request
     *
     * @param {HashBrown.Http.Request} request
     */
    static async handle(request) {
        checkParam(request, 'request', HashBrown.Http.Request, true);
      
        if(this.getUrl(request).pathname.indexOf('/setup') !== 0) {
            let users = await HashBrown.Entity.User.list();
            let context = await this.getContext(request);
            let url = Path.join(context.config.system.rootUrl, 'setup');

            if(!users || users.length < 1) {
                return new HashBrown.Http.Response(
                    `Redirecting to ${url}...`,
                    302,
                    {
                        'Location': url
                    }
                );
            }
        }

        return await super.handle(request);
    }
    
    /**
     * Handles an error
     *
     * @param {Error} error
     * @param {HashBrown.Entity.Context} context
     *
     * @return {HashBrown.Http.Response} Response
     */
    static error(error, context) {
        checkParam(error, 'error', Error, true);
        checkParam(context, 'context', HashBrown.Entity.Context, true);
       
        if(isNaN(error.code)) {
            error.code = 500;
        }

        debug.error(error, this);

        switch(error.code) {
            default:
                return this.render('error', { message: error.message, context: context }, error.code);
            
            case 401:
                return this.render('login', { message: error.message, context: context });
        }
    }

    /**
     * Renders a page
     *
     * @param {String} template
     * @param {Object} model
     * @param {Number} code
     *
     * @return {HashBrown.Http.Response} Rendered content
     */
    static render(template, model = {}, code = 200) {
        checkParam(template, 'template', String, true);
        checkParam(model, 'model', Object);
        checkParam(code, 'code', Number, true);

        let templatePath = Path.join(APP_ROOT, 'template', 'page', template);
        
        model = model || {};

        if(model.context && model.context.user) {
            model.context.user.password = {};
            model.context.user.tokens = [];
        }

        // Filter out sensitive config information
        if(model.context && model.context.config) {
            delete model.context.config.database;
        }

        let view = HashBrown.Entity.View.ViewBase.new({
            template: require(templatePath),
            model: model
        });
    
        return new HashBrown.Http.Response(view.render(), code, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
    }

    /**
     * Browser update screen
     */
    static async updateBrowser(request, params, body, query, context) {
        return this.render(
            'error',
            {
                message: 'Your browser is out-of-date. Please upgrade to a more recent version.',
                context: context
            },
            400
        );
    }

    /**
     * Readme
     */
    static async readme(request, params, body, query, context) {
        let markdown = await HashBrown.Service.FileService.read(Path.join(APP_ROOT, 'README.md'));
        let html = HashBrown.Service.MarkdownService.toHtml(markdown.toString('utf8'));

        html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>HashBrown</title>

                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width initial-scale=1">
                    <meta name="description" content="A free and open-source headless CMS">
                    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">

                    <link href="/cms/svg/favicon.svg" rel="icon" type="image/svg">

                    <style>
                        img {
                            width: 100%;
                        }
                        
                        body {
                            margin: 3rem auto;
                            max-width: 60rem;
                            line-height: 1.5;
                            color: #444;
                            padding: 0 1rem;
                        }
                        
                        h1, h2, h3 {
                            line-height: 1.2;
                        }
                    </style>
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `;

        return new HashBrown.Http.Response(html, 200, { 'Content-Type': 'text/html' });
    }
    
    /**
     * Login
     */
    static async login(request, params, body, query, context) {
        return this.render('login', { context: context });
    }
    
    /**
     * First time setup
     */
    static async setup(request, params, body, query, context) {
        let users = await HashBrown.Entity.User.list();
        
        if(users && users.length > 0) { 
            throw new HashBrown.Http.Exception('Cannot create first admin, users already exist. If you lost your credentials, please assign the admin using CLI.', 403);
        }

        if(request.method === 'POST') {
            let username = body.username || query.username;
            let password = body.password || query.password;
            
            let user = await HashBrown.Entity.User.create({ username: username, password: password, isAdmin: true });
            let token = await HashBrown.Entity.User.login(username, password);
            let url = Path.join(context.config.system.rootUrl, 'dashboard');

            return new HashBrown.Http.Response(
                `Redirecting to ${url}...`,
                302,
                {
                    'Location': url,
                    'Set-Cookie': `token=${token}; path=/;`
                }
            );

        } else {
            return this.render('setup', { context: context });
        
        }
    }

    /**
     * Dashboard
     */
    static async dashboard(request, params, body, query, context) {
        let themes = await HashBrown.Service.AppService.getThemes();
        let plugins = await HashBrown.Service.PluginService.getPlugins();

        let uptime = {};

        uptime['seconds'] = OS.uptime();
        uptime['days'] = Math.floor(uptime['seconds'] / (60*60*24));
        uptime['hours'] = Math.floor(uptime['seconds'] / (60*60)) - uptime['days'] * 24;
        uptime['minutes'] = Math.floor(uptime['seconds'] % (60*60) / 60);

        return this.render('dashboard', {
            tab: params.tab,
            os: OS,
            context: context,
            app: require(Path.join(APP_ROOT, 'package.json')),
            uptime: uptime,
            themes: themes,
            plugins: plugins
        });
    }

    /**
     * Environment
     */
    static async environment(request, params, body, query, context) {
        let themes = await HashBrown.Service.AppService.getThemes();
       
        return this.render('environment', {
            title: context.project.getName(),
            context: context,
            themes: themes
        });
    }
}

module.exports = ViewController;
