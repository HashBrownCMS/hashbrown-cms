'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    ${require('./inc/head')(_, view)}

    <body class="page page--dashboard">
        <header class="page--dashboard__header">
            <a class="page--dashboard__header__logo" target="_blank" href="http://hashbrown.rocks" title="Go to the HashBrown website">
                <img class="page--dashboard__header__logo__image" src="/svg/logo_pink.svg">
            </a>

            <a class="page--dashboard__header__tab ${view.tab === 'frontend' ? 'active': ''}" href="frontend">Frontend</a>

            ${_.if(view.user.isAdmin, `
                <a class="page--dashboard__header__tab ${view.tab === 'backend' ? 'active': ''}" href="backend">Backend</a>
            `)}

            <div class="page--dashboard__header__actions">
                ${_.if(view.user.isAdmin && view.tab === 'backend', `
                    <button class="page--dashboard__backend-test__run widget widget--button low">Run tests</button>
                `)}

                ${_.if(view.tab === 'frontend', `
                    <button class="page--dashboard__frontend-test__reset widget widget--button low">Reset tests</button>
                `)}
            </div>
        </header>

        <main class="page--dashboard__body">
            <div class="page--dashboard__body__container">
                ${_.if(view.tab === 'frontend', `
                    <div class="page--dashboard__frontend-test">
                        ${require('./inc/ui-checklist')(_, view)}
                    </div>
                `)}

                ${_.if(view.user.isAdmin && view.tab === 'backend', `
                    <div class="page--dashboard__backend-test">
                        <pre class="page--dashboard__backend-test__messages"></pre>
                    </div>
                `)}
            </div>
        </main>

        ${require('./inc/scripts')(_, view)}
        
        <script src="/js/common.js"></script>
        <script src="/js/service.js"></script>
        <script src="/js/entity.js"></script>
        <script src="/js/utilities.js"></script>
        
        <script src="/js/test.js"></script>

    </body>
</html> 

`
