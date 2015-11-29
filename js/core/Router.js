var Router = {
    routes: {},
    url: '/',

    route: function(path, controller, args) {
        var route = Router.routes[path] = {
            controller: controller,
        };

        if(args) {
            for(var k in args) {
                route[k] = args[k];
            }
        }
    },

    go: function(url) {
        location.hash = url;
    },
        
    goToBaseDir: function() {
        var url = Router.url;
        var base = new String(url).substring(0, url.lastIndexOf('/'));
        
        Router.go(base);
    },

    init: function() {
        if(Router.route && Router.route.onExit && !Router.route.onExit()) {
            return false;
        }

        var url = location.hash.slice(1) || '/';
        var trimmed = url.substring(0, url.indexOf('?'));
       
        if(trimmed) {
            url = trimmed;
        }

        var route = Router.routes[url];

        if(!route) {
            for(var k in Router.routes) {
                var regex = '^' + k + '$';
                var pattern = new RegExp(regex);
             
                if(pattern.test(url)) {
                    route = Router.routes[k];
                    break;
                }
            }            
        }

        Router.path = url.split('/');
        Router.args = {};
        Router.url = url;
        Router.route = route;

        if(!Router.path[0] && Router.path.length > 0) {
            Router.path.splice(0, 1);
        }

        for(var i = 0; i < Router.path.length - 1; i += 2) {
            Router.args[Router.path[i]] = Router.path[i+1];
        }

        if(route && route.controller) {
            if(route.clear) {
                View.clear();
            }
            
            route.controller();

        } else {
            console.log('Invalid route: ' + Router.url);
        
        }
    }
}

window.addEventListener('hashchange', Router.init); 
$(document).ready(Router.init);

module.exports = Router;
