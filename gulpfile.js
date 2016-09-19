var gulp = require('gulp');                         // Base gulp package

// JavaScript dependencies
var babelify = require('babelify');                 // Used to convert ES6 & JSX to ES5
var browserify = require('browserify');             // Providers "require" support, CommonJS
var notify = require('gulp-notify');                // Provides notification to both the console and Growel
var sourcemaps = require('gulp-sourcemaps');        // Provide external sourcemap files
var gutil = require('gulp-util');                   // Provides gulp utilities, including logging and beep
var chalk = require('chalk');                       // Allows for colouring for logging
var source = require('vinyl-source-stream');        // Vinyl stream support
var buffer = require('vinyl-buffer');               // ~
var watchify = require('watchify');                 // Watchify for source changes
var merge = require('utils-merge');                 // Object merge tool
var duration = require('gulp-duration');            // Time aspects of your gulp process

// SASS dependencies
var sass = require('gulp-sass');

/**
 * Config
 */
var config = {
    js: {
        src: [
            './src/client/js/client.js',
            './src/client/js/views/editors/index.js',
            './plugins/github-pages/client/js/client.js',
            './plugins/hashbrown-driver/client/js/client.js'
        ],
        watch: [ './plugins/**/*.js', './src/client/js/**/*.js', './node_modules/exomon/*.js' ],
        outputDir: './public/js/'
    },
    sass: {
        src: [
            './src/client/sass/client.scss',
            './plugins/github-pages/client/sass/client.scss',
            './plugins/hashbrown-driver/client/sass/client.scss'
        ]
    }
};

/**
 * Error reporting
 */
function mapError(err) {
    if(err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
            + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
            + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
            + ': ' + chalk.blue(err.description));
    } else {
        // Browserify error
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }
}

/**
 * Build JavaScript for environment
 */
gulp.task('js', function() {
    function bundle(bundler) {
        var bundleTimer = duration('Javascript bundle time');

        bundler
        .bundle()
        .on('error', mapError)                      // Map error reporting
        .pipe(source('client.js'))                  // Set source name
        .pipe(buffer())                             // Convert to gulp pipeline
        .pipe(sourcemaps.init({loadMaps: true}))    // Extract the inline sourcemaps
        .pipe(sourcemaps.write('./maps'))           // Set folder for sourcemaps to output to
        .pipe(gulp.dest(config.js.outputDir))       // Set the output folder
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>',
        }))                                         // Output the file being created
        .pipe(bundleTimer);                         // Output time timing of the file creation
    }
    
    
    var args = merge(                               // Merge in default watchify args with browserify arguments
        watchify.args,
        {
            debug: true,
            entries: config.js.src
        }
    );

    var bundler = browserify(args)                  // Browserify
        .plugin(watchify)                           // Watchify to watch source file changes
        .transform(babelify, {                      // Babel transforms
            presets: ['es2015-node5']
        });

    bundle(bundler);                                // Run the bundle the first time (required for Watchify to kick in)

    bundler.on('update', function() {
        bundle(bundler);                           // Re-run bundle on source updates
    });
});

/**
 * Build JavaScript for dashboard
 */
gulp.task('js-dashboard', function() {
    function bundle(bundler) {
        var bundleTimer = duration('Javascript bundle time');

        bundler
        .bundle()
        .on('error', mapError)                      // Map error reporting
        .pipe(source('dashboard.js'))               // Set source name
        .pipe(buffer())                             // Convert to gulp pipeline
        .pipe(sourcemaps.init({loadMaps: true}))    // Extract the inline sourcemaps
        .pipe(sourcemaps.write('./maps'))           // Set folder for sourcemaps to output to
        .pipe(gulp.dest(config.js.outputDir))       // Set the output folder
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>',
        }))                                         // Output the file being created
        .pipe(bundleTimer);                         // Output time timing of the file creation
    }
    
    
    var args = merge(                               // Merge in default watchify args with browserify arguments
        watchify.args,
        {
            debug: true,
            entries: [ './src/client/js/dashboard.js' ]
        }
    );

    var bundler = browserify(args)                  // Browserify
        .plugin(watchify)                           // Watchify to watch source file changes
        .transform(babelify, {                      // Babel transforms
            presets: ['es2015-node5']
        });

    bundle(bundler);                                // Run the bundle the first time (required for Watchify to kick in)

    bundler.on('update', function() {
        bundle(bundler);                           // Re-run bundle on source updates
    });
});

/**
 * Build SASS
 */
gulp.task('sass', function() {
    function compile() {
        gulp.src(config.sass.src)
        .pipe(sass({
            includePaths: [
                './node_modules/sass-material-colors/sass/'
            ]
        }).on('error', mapError))
        .pipe(sourcemaps.init({loadMaps: true}))    // Extract the inline sourcemaps
        .pipe(sourcemaps.write('./maps'))           // Set folder for sourcemaps to output to
        .pipe(gulp.dest('./public/css'))
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>',
        }));                                        // Output the file being created
    }

    gulp.watch('./src/client/sass/**/*.scss', compile);

    compile();                                      // Run the compilation first
});

/**
 * Gulp tasks
 */
gulp.task('default', [
    'sass',
    'js'
]);

gulp.task('dashboard', [
    'sass',
    'js-dashboard'
]);
