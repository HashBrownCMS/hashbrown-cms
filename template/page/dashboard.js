'use strict';

module.exports = (_, model) => `

<!DOCTYPE html>
<html>
    <head>
        ${_.include(require('./inc/head'))}
    </head>

    <body class="page page--dashboard">
        <header class="page--dashboard__header">
            ${model.context.user.isAdmin ? `
                <a class="page--dashboard__header__tab ${model.tab === 'projects' ? 'active' : ''}" href="/dashboard/projects">Projects</a>
                <a class="page--dashboard__header__tab ${model.tab === 'users' ? 'active' : ''}" href="/dashboard/users">Users</a>
                <a class="page--dashboard__header__tab ${model.tab === 'server' ? 'active' : ''}" href="/dashboard/server">Server</a>
            `: ''}
        </header>

        <main class="page--dashboard__body">
            <div class="page--dashboard__body__container">
                ${model.tab === 'projects' ? `
                    <div class="page--dashboard__projects">
                        <div class="page--dashboard__projects__list">
                        
                            ${model.context.user.isAdmin ? `
                                <button class="page--dashboard__projects__add widget widget--button dashed embedded expanded"><span class="fa fa-plus"></span>Add project</button>
                            ` : ''}
                        </div>
                    </div>

                ` : model.context.user.isAdmin && model.tab === 'users' ? `
                    <div class="page--dashboard__users">
                        <div class="page--dashboard__users__list">
                            <button class="page--dashboard__users__add widget widget--button dashed embedded expanded"><span class="fa fa-plus"></span>Add user</button>
                        </div>
                    </div>

                ` : model.context.user.isAdmin && model.tab === 'server' ? `
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

                ` : `
                    <div class="widget widget--message fixed fixed--top warn">
                        You are not permitted to view this page
                    </div>

                `}
            </div>
        </main>

        ${_.include(require('./inc/scripts'))}

        <script>
            window.HashBrown = {};
            HashBrown.Client = {
                rootUrl: "${model.rootUrl}",
                context: ${JSON.stringify(model.context)},
                view: "dashboard",
                themes: ${JSON.stringify(model.themes)}
            };
        </script>

        <script src="${model.rootUrl}/js/service.js"></script>
        <script src="${model.rootUrl}/js/entity.js"></script>
       
        <script src="${model.rootUrl}/js/dashboard.js"></script>
    </body>
</html>

`
