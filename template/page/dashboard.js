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
                <a class="page--dashboard__header__tab ${model.tab === 'projects' ? 'active' : ''}" href="${model.context.config.system.rootUrl}/dashboard/projects">${_.t('Projects')}</a>
                <a class="page--dashboard__header__tab ${model.tab === 'users' ? 'active' : ''}" href="${model.context.config.system.rootUrl}/dashboard/users">${_.t('Users')}</a>
                <a class="page--dashboard__header__tab ${model.tab === 'server' ? 'active' : ''}" href="${model.context.config.system.rootUrl}/dashboard/server">${_.t('Server')}</a>
            `: ''}
        </header>

        <main class="page--dashboard__body">
            <div class="page--dashboard__body__container">
                ${model.tab === 'projects' ? `
                    <div class="page--dashboard__projects">
                        <div class="page--dashboard__projects__list ${model.context.config.system.isSingleProject ? 'single' : 'widget-grid'}">
                        
                            ${model.context.user.isAdmin && !model.context.config.system.isSingleProject ? `
                                <button class="page--dashboard__projects__add widget widget--button dashed embedded expanded"><span class="fa fa-plus"></span>${_.t('Add project')}</button>
                            ` : ''}
                        </div>
                    </div>

                ` : model.context.user.isAdmin && model.tab === 'users' ? `
                    <div class="page--dashboard__users">
                        <div class="page--dashboard__users__list widget-grid">
                            <button class="page--dashboard__users__add widget widget--button dashed embedded expanded"><span class="fa fa-plus"></span>${_.t('Add user')}</button>
                        </div>
                    </div>

                ` : model.context.user.isAdmin && model.tab === 'server' ? `
                    <div class="page--dashboard__server">
                        <div class="page--dashboard__server__info">
                            <div class="widget-group">
                                <div class="widget widget--label small secondary">${_.t('Software')}</div>
                                <div class="widget widget--label">HashBrown v${model.app.version}</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">${_.t('Platform')}</div>
                                <div class="widget widget--label">${model.os.type()}</div> 
                            </div>

                            ${_.each(model.os.cpus(), (i, cpu) => `
                                <div class="widget-group">
                                    <div class="widget widget--label small secondary">${_.t('CPU')} ${i + 1}</div>
                                    <div class="widget widget--label">${cpu.model}</div>
                                </div>
                            `)}

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">${_.t('Memory')}</div>
                                <div class="widget widget--label">${Math.round(model.os.freemem() / 1000000)}mb / ${Math.round(model.os.totalmem() / 1000000)}mb</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">${_.t('Load average')}</div>
                                <div class="widget widget--label">${Math.round(model.os.loadavg()[0] * 10000) / 10000}</div>
                            </div>

                            <div class="widget-group">
                                <div class="widget widget--label small secondary">${_.t('Uptime')}</div>
                                <div class="widget widget--label">${model.uptime.days}d ${model.uptime.hours}h ${model.uptime.minutes}m</div>
                            </div>
                        </div>
                    </div>

                ` : `
                    <div class="widget widget--message fixed fixed--top warn">
                        ${_.t('You are not permitted to view this page')}
                    </div>

                `}
            </div>
        </main>

        ${_.include(require('./inc/scripts'))}

        <script>
            window.HashBrown = {};
            HashBrown.Client = {
                context: ${JSON.stringify(model.context)},
                view: "dashboard",
                themes: ${JSON.stringify(model.themes)}
            };
        </script>

        <script src="${model.context.config.system.rootUrl}/js/service.js"></script>
        <script src="${model.context.config.system.rootUrl}/js/entity.js"></script>
       
        <script src="${model.context.config.system.rootUrl}/js/dashboard.js"></script>
    </body>
</html>

`
