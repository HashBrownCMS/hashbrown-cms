var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');

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

gulp.task('watch', function() {
    gulp.watch('./src/client/js/**/*.js', [ 'js' ]);
    gulp.watch('./src/client/sass/**/*.scss', [ 'sass' ]);
});

gulp.task('default', [ 'sass', 'js', 'watch' ]);
