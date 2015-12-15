'use strict';

let pathToRegexp = require('path-to-regexp');

let routes = [];

class Router {
    static route(path, controller) {
        routes[path] = {
            controller: controller
        }
    }

    static go(url) {
        location.hash = url;
    }
        
    static goToBaseDir() {
        let url = this.url || '/';
        let base = new String(url).substring(0, url.lastIndexOf('/'));
        
        this.go(base);
    }

    static init() {
        // Get the url
        let url = location.hash.slice(1) || '/';
        let trimmed = url.substring(0, url.indexOf('?'));
       
        if(trimmed) {
            url = trimmed;
        }
        // Look for route
        let context = {};
        let route;

        // Exact match
        if(routes[url]) {
            path = routes[url];

        // Use path to regexp
        } else {
            for(let path in routes) {
                let keys = [];
                let re = pathToRegexp(path, keys);
                let values = re.exec(url);
                
                // A match was found
                if(re.test(url)) {
                    // Set the route
                    route = routes[path];

                    // Add context variables (first result (0) is the entire path,
                    // so assign that manually and start the counter at 1 instead)
                    route.url = url; 
                    let counter = 1;

                    for(let key of keys) {
                        route[key.name] = values[counter];
                        counter++;
                    }
                    break;
                }
            }

        }

        if(route) {
            route.controller();
        }
    }
}

window.addEventListener('hashchange', Router.init); 
window.Router = Router;
