<img src="https://cdn.rawgit.com/Putaitu/hashbrown-cms/master/public/svg/logo.svg" width="128"/>

# HashBrown CMS

## Purpose
Endomon aims to be a CMS for managing the content of multiple sites/apps.

## Why?
"Modern" CMS'es that aim to be flexible and open source are living in the past. It still takes one CMS per site, they're not geared to manage app content unless a developer makes an API, and almost all of them have spiraled into a hell of unmaintained plugins, corrupting the structure of the data they manage.

In some cases there is XML, JSON and an MSSQL database serialising and deserialising content between eachother, using logic I could only describe as "spaghetti code", which on top of everything else is poorly documented too, if at all.

Endomon does what these CMS'es did when they started, which is learning from mistakes made by other systems of the same type. The main difference is that Endomon will have a solid core, geared towards the future trends of content management, like cloud storage and interconnected apps.

It's really just another CMS, but with a clean slate, without all the patches, unmaintained junk and caveats of the currently popular systems.

## Core principles
### Tiny footprint
Unlike most CMS'es, Endomon does not require a lot of resources to run. Instead of user sessions, it uses tokens. Instead of monitoring cronjobs for cache generation, it uses event triggers. Most importantly, instead of .NET, it uses node.js.

### Connects to anywhere
Using a backend system called "connections", developers can create publishing logic connecting the CMS to other endpoints. A bundled example of such a connection is the GitHub pages connection, rendering published content as YAML front matter and fetching liquid templates from the connected repo.

### Multilingual
A core mechanic of all content properties is that they can be configured to be multilingual using a single boolean value. This doesn't even need to be taken into account when making new field editors, the content editor handles it before field editors are rendered.

### Pluggable
Only a solid core using node.js and MongoDB in the backend is set in stone, everything that happens on the front-end and after the editor clicks "publish" can be overridden using plugins.

