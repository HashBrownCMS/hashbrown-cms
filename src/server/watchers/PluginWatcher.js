'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

class PluginWatcher {
    /**
     * Register Gulp tasks
     */
    static register() {
        /**
         * Compile SASS for plugins
         */
        gulp.task('sass-plugins', function() {
            gulp.src(appRoot + '/plugins/*/client/sass/**/*.scss')
                .pipe(plumber())
                .pipe(sass({
                    includePaths: [
                        appRoot + '/node_modules/sass-material-colors/sass/'
                    ]
                }))
                .pipe(concat('plugins.css'))
                .pipe(gulp.dest(appRoot + '/public/css/'));
        });

        /**
         * Compile JS for plugins
         */
        gulp.task('js-plugins', function() {
            gulp.src(appRoot + '/plugins/*/client/js/**/*.js')
                .pipe(plumber())
                .pipe(browserify({
                    paths: [
                        appRoot + '/node_modules/',
                        appRoot + '/'
                    ]
                }))
                .pipe(babel({
                    presets: [ 'es2015' ]
                }))
                .pipe(concat('plugins.js'))
                .pipe(gulp.dest(appRoot + '/public/js/'));
        });
        
        /**
         * Watch plugin code
         */
        gulp.task('watch-plugins', function() {
            gulp.watch(appRoot + '/plugins/*/client/js/**/*.js', [ 'js-plugins' ]);
            gulp.watch(appRoot + '/plugins/*/client/sass/**/*.scss', [ 'sass-plugins' ]);
        });
        
        // ----------
        // Default tasks
        // ----------
        gulp.task('default', [ 'sass-plugins', 'js-plugins', 'watch-plugins' ]);
    }

    /**
     * Starts the watcher logic
     */
    static init() {
        console.log('[PluginWatcher] Initialising plugin watcher');

        PluginWatcher.register();

        gulp.start('default');
    }
}

module.exports = PluginWatcher;
