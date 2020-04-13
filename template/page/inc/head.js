'use strict';

module.exports = (_, model) => `

<title>${ model.title || 'HashBrown CMS' }</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width initial-scale=1">
<meta name="description" content="A free and open-source headless CMS">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">

<link href="${model.rootUrl}/favicon.png" rel="icon" type="image/png">
<link href="${model.rootUrl}/lib/normalize/normalize.css" rel="stylesheet">
<link href="${model.rootUrl}/lib/font-awesome/css/font-awesome.min.css" rel="stylesheet">

<link href="${model.rootUrl}/css/theme.css" rel="stylesheet" id="theme">
<link href="${model.rootUrl}/css/style.css" rel="stylesheet">
`
