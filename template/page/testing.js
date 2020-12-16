'use strict';

module.exports = (_, model) => `

<!DOCTYPE html>
<html>
    ${require('./inc/head')(_, model)}

    <body class="page page--dashboard">
        <header class="page--dashboard__header">
            <a class="page--dashboard__header__tab ${model.tab === 'frontend' ? 'active': ''}" href="frontend">Frontend</a>

            ${model.context.user.isAdmin ? ` 
                <a class="page--dashboard__header__tab ${model.tab === 'backend' ? 'active': ''}" href="backend">Backend</a>
            `: ''}

            <div class="page--dashboard__header__actions">
                ${model.context.user.isAdmin && model.tab === 'backend' ? `
                    <button class="page--dashboard__backend-test__run widget widget--button">Run tests</button>
                ` : ''}

                ${model.tab === 'frontend' ? `
                    <button class="page--dashboard__frontend-test__reset widget widget--button">Reset tests</button>
                ` : ''}
            </div>
        </header>

        <main class="page--dashboard__body">
            <div class="page--dashboard__body__container">
                ${model.tab === 'frontend' ? `
                    <div class="page--dashboard__frontend-test">
                        ${require('./inc/ui-checklist')(_, model)}
                    </div>
                ` : ''}

                ${model.context.user.isAdmin && model.tab === 'backend' ? `
                    <div class="page--dashboard__backend-test">
                        <pre class="page--dashboard__backend-test__messages">Press the "run tests" button to start.</pre>
                    </div>
                ` : ''}
            </div>
        </main>

        ${require('./inc/scripts')(_, model)}
        
        <script>
            window.HashBrown = {};
            HashBrown.Client = {
                context: ${JSON.stringify(model.context)},
                themes: ${JSON.stringify(model.themes)}
            };
        </script>
        
        <script src="${model.context.config.system.rootUrl}/js/service.js"></script>
        <script src="${model.context.config.system.rootUrl}/js/entity.js"></script>
        
        <script src="${model.context.config.system.rootUrl}/js/test.js"></script>
    </body>
</html> 

`
