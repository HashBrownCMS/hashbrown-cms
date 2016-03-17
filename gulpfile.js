var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

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
    gulp.src('./src/client/js/client.js')
        .pipe(plumber())
        .pipe(browserify({
            paths: [
                './node_modules/',
                './'
            ]
        }))
        .pipe(babel({
            presets: [ 'es2015' ]
        }))
        .pipe(gulp.dest('./public/js'));
});

/**
 * Compile SASS for plugins
 */
gulp.task('sass-plugins', function() {
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
 * Compile JS for plugins
 */
gulp.task('js-plugins', function() {
    gulp.src('./plugins/*/client/js/**/*.js')
        .pipe(plumber())
        .pipe(browserify({
            paths: [
                './node_modules/',
                './'
            ]
        }))
        .pipe(babel({
            presets: [ 'es2015' ]
        }))
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
    // Watch native code
    gulp.watch('./src/client/js/**/*.js', [ 'js' ]);
    gulp.watch('./src/client/sass/**/*.scss', [ 'sass' ]);
    
    // Watch plugin code
    gulp.watch('./plugins/*/client/js/**/*.js', [ 'js-plugins' ]);
    gulp.watch('./plugins/*/client/sass/**/*.scss', [ 'sass-plugins' ]);
});

gulp.task('default', [ 'sass', 'js', 'sass-plugins', 'js-plugins', 'watch' ]);
