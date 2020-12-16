'use strict';

module.exports = (_, model) => `

<script src="${model.context.config.system.rootUrl}/js/browser-check.js"></script>
<script src="${model.context.config.system.rootUrl}/js/utilities.js"></script>

`
