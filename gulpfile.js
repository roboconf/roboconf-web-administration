// This file is in charge of the build process:
// Running tests, checking code quality, minifying the code, etc.

// Include gulp
var gulp = require('gulp'); 

// Include Our Plug-ins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var taskListing = require('gulp-task-listing');
var gutil = require('gulp-util');
var del = require('del');
var karma = require('gulp-karma');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var copy = require('gulp-copy');
var watch = require('gulp-watch');
var webserver = require('gulp-webserver');

// Configuration
var minifyOnDev = false;

// List the available gulp tasks
gulp.task( 'help', taskListing );
gulp.task( 'default', ['help']);

// Lint Task
gulp.task('lint', function() {
	gutil.log( 'Analyzing source with JSHint.' );
	
    return gulp.src( './src/app/**/*.js' )
        .pipe( jshint())
        .pipe( jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	gutil.log( 'Minifying and concatenating JS scripts.' );
	
    return gulp.src('./src/app/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('target/distrib'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Clean all the output directories
gulp.task('clean', function(done) {
    
    gutil.log('Cleaning: ' + gutil.colors.blue( "target" ));
    del( "target", done );
});

// Run the unit tests
gulp.task('unit-tests', function () {
	gulp.src('./invalid-dir')
		.pipe(karma({
	      configFile: 'karma.conf.js',
	      action: 'run',
	      showStack: true
	    }))
	    .on('error', function(err) {
	      // Make sure failed tests cause gulp to exit non-zero
	      console.log(err);
	      this.emit('end'); //instead of erroring the stream, end it
	    })
});


//Execute all the tasks
gulp.task( 'all', [ 'clean', 'lint', 'unit-tests', 'scripts', 'inject-scripts-for-dev' ]);


/*
 * DEV tasks.
 * These tasks are used to build a dev directory with the right scripts
 * and CSS files. There should be used in development mode. Their output is used
 * to build the final distribution.
 */


// Clean all the output directories
gulp.task('clean-dev', function() {
  
  gutil.log('Cleaning: ' + gutil.colors.blue( "target/dev" ));
  del.sync([ 'target/dev/js', 'target/dev/css', 'target/dev/templates', 'target/dev/index.html' ]);
});

// Watch the files and update the DEV directory
gulp.task('watch-dev', function () {
	
	// Rebuild the DEV directory
	refreshDev();
	
	// Run a web server
	gulp.src('./target/dev')
    .pipe( webserver());
	
    // Watch changes in our SRC directory and update the DEV one
	watch([ 'src/**/*' ], refreshDev );
});

// Shortcut for all the DEV tasks
gulp.task('dev', refreshDev )


// DEV functions
function refreshDev() {
	buildDevDirectory();
	injectScriptsInDev();
}


function injectScriptsInDev() {
  // It is not necessary to read the files (will speed up things).
  // And load module definitions first!
  var sources = gulp.src([
                 './target/dev/js/**/*.module.js',
                 './target/dev/js/**/*.js', 
                 './target/dev/css/**/*.css'], {read: false});
  
  gulp.src('./target/dev/index.html')
    .pipe( wiredep())
    .pipe( inject( sources, {relative: true}))
    .pipe( gulp.dest('./target/dev'));
}


function buildDevDirectory() {
  
	gulp.src( './src/index.html' )
	.pipe( gulp.dest( './target/dev/' ));
	
	gulp.src([ './src/app/**/*.js' ])
    .pipe( copy('./target/dev/js', {'prefix': 2}));
	
	gulp.src([ './src/app/**/*.html' ])
    .pipe( copy('./target/dev/templates', {'prefix': 2}));
	
	gulp.src([ './src/img/*' ])
    .pipe( copy('./target/dev/img', {'prefix': 2}));
	
	gulp.src([ './src/**/*.css' ])
    .pipe( copy('./target/dev/css', {'prefix': 2}));
}
