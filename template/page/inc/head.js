'use strict';

module.exports = (_, model) => `

<title>${ model.title || 'HashBrown CMS' }</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width initial-scale=1">
<meta name="description" content="A free and open-source headless CMS">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">

<style>
    @font-face {
        font-family: 'NunitoSans';
        font-weight: 400;
        src: url('${model.context.config.system.rootUrl}/fonts/NunitoSans/NunitoSans-Regular.ttf');
    }

    @font-face {
        font-family: 'NunitoSans';
        font-weight: 700;
        src: url('${model.context.config.system.rootUrl}/fonts/NunitoSans/NunitoSans-Bold.ttf');
    }

    @font-face {
        font-family: 'NunitoSans';
        font-weight: 100;
        src: url('${model.context.config.system.rootUrl}/fonts/NunitoSans/NunitoSans-ExtraLight.ttf');
    }
</style>

<link href="${model.context.config.system.rootUrl}/svg/favicon.svg" rel="icon" type="image/svg">
<link href="${model.context.config.system.rootUrl}/lib/normalize/normalize.css" rel="stylesheet">
<link href="${model.context.config.system.rootUrl}/lib/font-awesome/css/font-awesome.min.css" rel="stylesheet">

<link href="${model.context.config.system.rootUrl}/css/theme.css" rel="stylesheet" id="theme">
<link href="${model.context.config.system.rootUrl}/css/style.css" rel="stylesheet">
`
