'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var glob = require('glob');
var eventstream = require('event-stream');

class PluginWatcher {
    /**
     * Register Gulp tasks
     */
    static register() {
        /**
         * Compile SASS
         */
        gulp.task('sass', function() {
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
         * Compile JS
         */
        gulp.task('js', function() {
            glob(appRoot + '/plugins/*/client/js/client.js', function(err, files) {
                if(err) {
                    done(err);
                }

                return browserify(files)
                    .bundle()
                    .pipe(source('client.js'))
                    .pipe(buffer())
                    .pipe(sourcemaps.init({loadMaps: true}))
                        .pipe(babel({
                            presets: [ 'es2015' ]
                        }))
                    .pipe(concat('plugins.js'))
                    .pipe(gulp.dest(appRoot + '/public/js/'));
            });

        });
        
        // ----------
        // Default tasks
        // ----------
        gulp.task('default', [ 'sass', 'js' ]);
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
