(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$('.navbar-content').html(
    _.div({class: 'navbar navbar-default'},
        _.div({class: 'container'}, [
            _.ul({class: 'nav navbar-nav'},
                _.li({class: 'navbar-btn'},
                    _.div({class: 'btn-group'}, [
                        _.a({class: 'btn btn-default', href: '/repos/'}, [
                            _.span({class: 'glyphicon glyphicon-arrow-left'}),
                            ' Repos'
                        ]),
                        _.a({class: 'btn btn-default', href: '/repos/' + params.repo + '/deployment/'}, [
                            _.span({class: 'glyphicon glyphicon-user'}),
                            ' Deployment'
                        ]),
                        _.a({class: 'btn btn-default', href: '/repos/' + params.repo + '/contributors/'}, [
                            _.span({class: 'glyphicon glyphicon-user'}),
                            ' Contributors'
                        ]),
                        _.a({class: 'btn btn-default', href: '/repos/' + params.repo + '/issues/'}, [
                            _.span({class: 'glyphicon glyphicon-th-list'}),
                            ' Issues'
                        ]),
                        _.a({class: 'btn btn-default', href: '/repos/' + params.repo + '/settings/'}, [
                            _.span({class: 'glyphicon glyphicon-cog'}),
                            ' Settings'
                        ])
                    ])
                )
            ),
            _.ul({class: 'nav navbar-nav navbar-right'},
                _.li({class: 'navbar-btn'},
                    _.div({class: 'input-group'}, [
                        _.span({class: 'input-group-addon'},
                            'git'
                        ),
                        _.input({class: 'form-control', type: 'text', value: 'https://github.com'})
                    ])
                )
            )
        ])
    )
);

},{}]},{},[1])