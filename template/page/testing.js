'use strict';

module.exports = (_, model) => `

<!DOCTYPE html>
<html>
    ${require('./inc/head')(_, model)}

    <body class="page page--dashboard">
        <header class="page--dashboard__header">
            <a href="${model.context.config.system.rootUrl}" title="${_.t('Go to dashboard')}" class="page--dashboard__header__logo">
                <svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="m256 0c-141.82 0-256 113.67-256 254.86v2.2826c0 141.19 114.17 254.86 256 254.86 141.82 0 256-113.67 256-254.86v-2.2826c0-141.19-114.18-254.86-256-254.86zm0 50.086c44.832 0 86.327 14.363 120.15 38.722a33.391 33.391 0 0 1 45.114 1.9076 33.391 33.391 0 0 1 1.913 45.111c24.369 33.828 38.736 75.332 38.736 120.17 0 44.84-14.368 86.34-38.736 120.17a33.391 33.391 0 0 1 -1.913 45.106 33.391 33.391 0 0 1 -45.108 1.913c-33.825 24.361-75.323 38.725-120.16 38.725-44.841 0-86.343-14.368-120.17-38.736a33.391 33.391 0 0 1 -45.119 -1.9022 33.391 33.391 0 0 1 -1.9022 -45.125c-24.359-33.823-38.72-75.317-38.72-120.15 0-44.834 14.364-86.332 38.725-120.16a33.391 33.391 0 0 1 1.8967 -45.127 33.391 33.391 0 0 1 45.125 -1.8967c33.826-24.367 75.326-38.733 120.17-38.733zm0 11.13c-42.147 0-81.147 13.362-113.01 36.081a33.391 33.391 0 0 1 -5.0598 40.641 33.391 33.391 0 0 1 -40.649 5.0733c-22.709 31.857-36.065 70.851-36.065 112.99 0 42.139 13.357 81.134 36.068 112.99a33.391 33.391 0 0 1 40.647 5.0597 33.391 33.391 0 0 1 5.0679 40.654c31.859 22.715 70.856 36.076 113 36.076 42.139 0 81.136-13.357 112.99-36.068a33.391 33.391 0 0 1 5.0489 -40.663 33.391 33.391 0 0 1 40.674 -5.0597c22.711-31.857 36.068-70.852 36.068-112.99 0-42.147-13.362-81.149-36.081-113.01a33.391 33.391 0 0 1 -40.66 -5.0516 33.391 33.391 0 0 1 -5.0625 -40.663c-31.855-22.706-70.847-36.059-112.98-36.059zm38.945 72.804a19.48 19.48 0 0 1 14.155 33.44l-25.581 25.581 35.416 35.415 25.581-25.581a19.48 19.48 0 0 1 13.391 -5.8912 19.48 19.48 0 0 1 14.158 33.44l-25.581 25.581 25.584 25.584a19.48 19.48 0 1 1 -27.546 27.546l-25.584-25.584-35.413 35.413 25.584 25.584a19.48 19.48 0 1 1 -27.546 27.546l-25.584-25.584-25.579 25.579a19.48 19.48 0 1 1 -27.549 -27.549l25.579-25.579-35.416-35.415-25.579 25.579a19.48 19.48 0 1 1 -27.546 -27.546l25.579-25.579-25.571-25.57a19.48 19.48 0 0 1 13.568 -33.448 19.48 19.48 0 0 1 13.978 5.9021l25.571 25.57 35.413-35.413-25.571-25.57a19.48 19.48 0 0 1 13.568 -33.448 19.48 19.48 0 0 1 13.978 5.9021l25.571 25.57 25.581-25.581a19.48 19.48 0 0 1 13.391 -5.894zm-38.973 86.567-35.413 35.413l35.416 35.415 35.413-35.413z" stroke-width="1.3913"/>
                </svg>
                <h1>HashBrown</h1>
            </a>
            
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
