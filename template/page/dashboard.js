'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page page--dashboard">
        <header class="page--dashboard__header">
            <a class="page--dashboard__header__logo" target="_blank" href="http://hashbrown.rocks" title="Go to the HashBrown website">
                <img class="page--dashboard__header__logo__image" src="/svg/logo_pink.svg">
            </a>

            ${_.if(view.user.isAdmin, `
                <a class="page--dashboard__header__tab ${view.tab === 'projects' ? 'active' : ''}" href="/dashboard/projects">Projects</a>
                <a class="page--dashboard__header__tab ${view.tab === 'users' ? 'active' : ''}" href="/dashboard/users">Users</a>
                <a class="page--dashboard__header__tab ${view.tab === 'server' ? 'active' : ''}" href="/dashboard/server">Server</a>
            `)}

            <div class="page--dashboard__header__actions">
                <form action="/api/user/logout" method="POST">
                    <button class="widget widget--button condensed low fa fa-sign-out" type="submit" title="Log out"></button>
                </form>
            </div>
        </header>

        <main class="page--dashboard__body">
            <div class="page--dashboard__body__container">
                ${_.if(view.tab === 'projects', `
                    <div class="page--dashboard__projects">
                        <div class="page--dashboard__projects__welcome">
                            <p>Welcome to the HashBrown dashboard.<br>Below you will find a list of active projects on this server.</p>
                            <p>To author content, you can click the environment buttons to get started.</p>

                            ${_.if(view.user.isAdmin, `
                                <p>You're an admin, so you can use the various project menus ( <span class="fa fa-ellipsis-v"></span> and <span class="fa fa-plus"></span> ) to manage backups and create/delete environments and projects.</p>
                            `)}

                            <p>If you feel completely lost, check out the <a href="http://hashbrown.rocks/guides" target="_blank">guides</a></p>
                        </div>

                        <div class="page--dashboard__projects__list">
                            <div class="widget widget--spinner embedded no-background">
                                <div class="widget--spinner__inner">
                                    <div class="widget--spinner__image fa fa-refresh"></div>
                                </div>
                            </div>
                        </div>

                        ${_.if(view.user.isAdmin, `
                            <button class="page--dashboard__projects__add widget widget--button round right fa fa-plus" title="Create project"></button>
                        `)}
                    </div>
                `)}
                
                ${_.if(view.user.isAdmin && view.tab === 'users', `
                    <div class="page--dashboard__users">
                        <div class="page--dashboard__users__list"></div>

                        <button class="page--dashboard__users__add widget widget--button round fa fa-plus right" title="Add user"></button>
                    </div>
                `)}
                
                ${_.if(view.user.isAdmin && view.tab === 'server', `
                    <div class="page--dashboard__server">
                        <div class="page--dashboard__server__info">
                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Software</div>
                                <div class="widget widget--label">HashBrown v${view.app.version}</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Platform</div>
                                <div class="widget widget--label">${view.os.type()}</div> 
                            </div>

                            ${_.each(view.os.cpus(), (i, cpu) => `
                                <div class="widget-group">
                                    <div class="widget widget--label small secondary">CPU ${i + 1}</div>
                                    <div class="widget widget--label">${cpu.model}</div>
                                </div>
                            `)}

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Memory</div>
                                <div class="widget widget--label">${Math.round(view.os.freemem() / 1000000)}mb / ${Math.round(view.os.totalmem() / 1000000)}mb</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Load average</div>
                                <div class="widget widget--label">${Math.round(view.os.loadavg()[0] * 10000) / 10000}</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">Uptime</div>
                                <div class="widget widget--label">${view.uptime.days}d ${view.uptime.hours}h ${view.uptime.minutes}m</div>
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        </main>

        ${require('./inc/scripts')(_, view)}

        <script>
            window.HashBrown = {};
            HashBrown.Context = {
                user: ${JSON.stringify(view.user)},
                view: "dashboard"
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
