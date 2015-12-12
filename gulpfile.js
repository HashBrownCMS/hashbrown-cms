var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');

gulp.task('sass', function() {
    gulp.src('./sass/main.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
    
    gulp.src('./sass/views/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./public/css/views'));
});


gulp.task('js', function() {
    gulp.src('./js/client.js')
        .pipe(plumber())
        .pipe(browserify())
        .pipe(babel({
            presets: [ 'es2015' ]
        }))
        .pipe(gulp.dest('./public/js'));

    gulp.src('./js/views/*.js')
        .pipe(plumber())
        .pipe(browserify())
        .pipe(babel({
            presets: [ 'es2015' ]
        }))
        .pipe(gulp.dest('./public/js/views'));

});

gulp.task('watch', function() {
    gulp.watch('./js/**/*.js', [ 'js' ]);
    gulp.watch('./sass/**/*.scss', [ 'sass' ]);
});

gulp.task('default', [ 'sass', 'js', 'watch' ]);
