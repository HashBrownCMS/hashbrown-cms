var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('gulp-babel');
var glob = require('glob');
var concat = require('gulp-concat');
var eventstream = require('event-stream');

/**
 * Compile plugin SASS
 */
gulp.task('plugins-sass', function() {
    gulp.src('./plugins/*/client/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass({
            includePaths: [
               './node_modules/sass-material-colors/sass/'
            ]
        }))
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest('./public/css/'));
});

/**
 * Compile plugin JS
 */
gulp.task('plugins-js', function() {
    glob('./plugins/*/client/js/client.js', function(err, files) {
        if(err) {
            done(err);
        }

        return browserify(files)
            .bundle()
            .pipe(plumber())
            .pipe(source('client.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(babel({
                    presets: [ 'es2015' ]
                }))
            .pipe(concat('plugins.js'))
            .pipe(gulp.dest('./public/js/'));
    });

});

/**
 * Watch plugin code
 */
gulp.task('plugins-watch', function() {
    gulp.watch('./plugins/**/*.js', [ 'plugins-js' ]);
    gulp.watch('./src/common/**/*.js', [ 'plugins-js' ]);
    gulp.watch('./plugins/**/*.scss', [ 'plugins-sass' ]);
});

/**
 * Compile native SASS
 */
gulp.task('sass', function() {
    gulp.src('./src/client/sass/client.scss')
        .pipe(plumber())
        .pipe(sass({
            includePaths: [
                './node_modules/sass-material-colors/sass/'
            ]
        }))
        .pipe(gulp.dest('./public/css'));
});

/**
 * Compile native JS
 */
gulp.task('js', function() {
    return browserify({
        entries: './src/client/js/client.js'
    })
    .on('error', function(err) {
        console.log(err);
        this.emit('end');
    })
    .bundle()
    .pipe(source('client.js'))
    .pipe(buffer())
    .pipe(babel({
        presets: [ 'es2015' ]
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/'));
});

/**
 * Watch native code
 */
gulp.task('watch', function() {
    gulp.watch('./src/client/js/**/*.js', [ 'js' ]);
    gulp.watch('./src/common/**/*.js', [ 'js' ]);
    gulp.watch('./src/client/sass/**/*.scss', [ 'sass' ]);
});

// ----------
// Default tasks
// ----------
gulp.task('default', [
    'plugins-sass',
    'plugins-js',
    'plugins-watch',
    'sass',
    'js',
    'watch'
]);
