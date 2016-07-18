<img src="https://cdn.rawgit.com/Putaitu/hashbrown-cms/master/public/svg/logo.svg" width="128"/>

# HashBrown CMS
A free and open-source CMS built with Node.js and MongoDB

## Made for developers and users alike
Two painful problems have until now persisted in the world of content management systems:
- If it has a rock-solid backend, it's dreadful to use
- If it's pretty and easy to use, the backend is a house of cards

HashBrown is built from the ground up to tackle this problem by applying industry-standard UI design principles and a modularised separation-of-concerns mentality in the backend. As such, it tackles complex scenarios easily, responds well to user interactions and even looks good doing it.

## Who should use HashBrown?
If any of these points sound interesting, HashBrown might be for you.

### Remote management
This is where HashBrown is very different from other CMS'es. Instead of hosting your site, taking up valuable server power caching and crunching numbers for every visitor, it connects to your site remotely, and updates a content cache on your site, only when changes are made to the site's content. This means you can build your site in whatever language and framework you like, you can even use a static site generator service like [GitHub Pages](http://github.com/pages) and host your content managed site for free.

### Multiple projects at once
One instance of HashBrown can manage the content of several sites/apps. How many it can manage is determined by the capacity of the server it's running on.

### Several environments for each project
Every project has it's own unlimited amount of environments. This is very useful if you want testing content separated from live content, or if your for any other reason want to branch your managed content into subsets.

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

