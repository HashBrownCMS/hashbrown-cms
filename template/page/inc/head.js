'use strict';

module.exports = (_, model) => `

<title>${ model.title || 'HashBrown CMS' }</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width initial-scale=1">
<meta name="description" content="A free and open-source headless CMS">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">

<link href="/favicon.png" rel="icon" type="image/png">
<link href="/lib/normalize/normalize.css" rel="stylesheet">
<link href="/lib/font-awesome/css/font-awesome.min.css" rel="stylesheet">

<link href="/css/theme.css" rel="stylesheet" id="theme">
<link href="/css/style.css" rel="stylesheet">
`
