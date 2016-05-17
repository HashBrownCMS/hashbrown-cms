var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');

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
    return browserify('./src/client/js/client.js')
        .on('error', function(err) {
            console.log(err);
            this.emit('end');
        })
        .bundle()
        .pipe(plumber())
        .pipe(source('client.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(babel({
                presets: [ 'es2015' ]
            }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js/'));
});

/**
 * Watch native code
 */
gulp.task('watch', function() {
    gulp.watch('./src/client/js/**/*.js', [ 'js' ]);
    gulp.watch('./src/client/sass/**/*.scss', [ 'sass' ]);
});

// ----------
// Default tasks
// ----------
gulp.task('default', [ 'sass', 'js', 'watch' ]);
