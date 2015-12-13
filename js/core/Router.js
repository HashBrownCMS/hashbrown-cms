class Router {
    constructor() {
        this.routes = {};
        this.url = '/';
    }

    route(path, controller, args) {
        let route = this.routes[path] = {
            controller: controller,
        };

        if(args) {
            for(let k in args) {
                route[k] = args[k];
            }
        }
    }

    go(url) {
        location.hash = url;
    }
        
    goToBaseDir() {
        let url = this.url || '/';
        let base = new String(url).substring(0, url.lastIndexOf('/'));
        
        this.go(base);
    }

    init() {
        if(this.route && this.route.onExit && !this.route.onExit()) {
            return false;
        }

        let url = location.hash.slice(1) || '/';
        let trimmed = url.substring(0, url.indexOf('?'));
       
        if(trimmed) {
            url = trimmed;
        }

        let route = this.routes[url];

        if(!route) {
            for(let k in Router.routes) {
                let regex = '^' + k + '$';
                let pattern = new RegExp(regex);
             
                if(pattern.test(url)) {
                    route = Router.routes[k];
                    break;
                }
            }            
        }

        this.path = url.split('/');
        this.args = {};
        this.url = url;
        this.route = route;

        if(!this.path[0] && this.path.length > 0) {
            Router.path.splice(0, 1);
        }

        for(let i = 0; i < this.path.length - 1; i += 2) {
            this.args[this.path[i]] = this.path[i+1];
        }

        if(route && route.controller) {
            if(route.clear) {
                ViewHelper.clear();
            }
            
            route.controller();

        } else {
            console.log('Invalid route: ' + this.url);
        
        }
    }
}

window.addEventListener('hashchange', Router.init); 
$(document).ready(Router.init);

window.Router = Router;
