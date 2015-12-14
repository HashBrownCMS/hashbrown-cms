'use strict';

let pathToRegexp = require('path-to-regexp');

class Router {
    static route(path, controller) {
        this.routes = this.routes || [];

        this.routes[path] = {
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
        this.routes = this.routes || [];

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
        if(this.routes[url]) {
            path = this.routes[url];

        // Use path to regexp
        } else {
            for(let path in this.routes) {
                let keys = [];
                let re = pathToRegexp(path, keys);
                let values = re.exec(url);
                
                // A match was found
                if(re.test(url)) {
                    // Set the route
                    route = this.routes[path];

                    // Add context variables (first result is the entire path)
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

window.Router = Router;
window.addEventListener('hashchange', window.Router.init); 

