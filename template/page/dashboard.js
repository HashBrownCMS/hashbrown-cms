'use strict';

module.exports = (_, model) => `

<!DOCTYPE html>
<html>
    <head>
        ${_.include(require('./inc/head'))}
    </head>

    <body class="page page--dashboard">
        <header class="page--dashboard__header">
            <a class="page--dashboard__header__logo" target="_blank" href="http://hashbrown.rocks" title="Go to the HashBrown website">
                <img class="page--dashboard__header__logo__image" src="/svg/logo_pink.svg">
            </a>

            ${_.if(model.user.isAdmin, `
                <a class="page--dashboard__header__tab ${model.tab === 'projects' ? 'active' : ''}" href="/dashboard/projects">Projects</a>
                <a class="page--dashboard__header__tab ${model.tab === 'users' ? 'active' : ''}" href="/dashboard/users">Users</a>
                <a class="page--dashboard__header__tab ${model.tab === 'server' ? 'active' : ''}" href="/dashboard/server">Server</a>
            `)}
        </header>

        <main class="page--dashboard__body">
            <div class="page--dashboard__body__container">
                ${_.if(model.tab === 'projects', `
                    <div class="page--dashboard__projects">
                        <div class="page--dashboard__projects__list"></div>

                        ${_.if(model.user.isAdmin, `
                            <button class="page--dashboard__projects__add widget widget--button round fa fa-plus" title="Create project"></button>
                        `)}
                    </div>
                `)}
                
                ${_.if(model.user.isAdmin && model.tab === 'users', `
                    <div class="page--dashboard__users">
                        <div class="page--dashboard__users__list"></div>

                        <button class="page--dashboard__users__add widget widget--button round fa fa-plus" title="Add user"></button>
                    </div>
                `)}
                
                ${_.if(model.user.isAdmin && model.tab === 'server', `
                    <div class="page--dashboard__server">
                        <div class="page--dashboard__server__info">
                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Software</div>
                                <div class="widget widget--label">HashBrown v${model.app.version}</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Platform</div>
                                <div class="widget widget--label">${model.os.type()}</div> 
                            </div>

                            ${_.each(model.os.cpus(), (i, cpu) => `
                                <div class="widget-group">
                                    <div class="widget widget--label small secondary">CPU ${i + 1}</div>
                                    <div class="widget widget--label">${cpu.model}</div>
                                </div>
                            `)}

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Memory</div>
                                <div class="widget widget--label">${Math.round(model.os.freemem() / 1000000)}mb / ${Math.round(model.os.totalmem() / 1000000)}mb</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Load average</div>
                                <div class="widget widget--label">${Math.round(model.os.loadavg()[0] * 10000) / 10000}</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Uptime</div>
                                <div class="widget widget--label">${model.uptime.days}d ${model.uptime.hours}h ${model.uptime.minutes}m</div>
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        </main>

        ${_.include(require('./inc/scripts'))}

        <script>
            window.HashBrown = {};
            HashBrown.Context = {
                user: ${JSON.stringify(model.user)},
                view: "dashboard",
                themes: ${JSON.stringify(view.themes)}
            };
        </script>

        <script src="/js/common.js"></script>
        <script src="/js/service.js"></script>
        <script src="/js/entity.js"></script>
        <script src="/js/utilities.js"></script>
        <script src="/js/view.js"></script>
       
        <script src="/js/dashboard.js"></script>
    </body>
</html>

`
