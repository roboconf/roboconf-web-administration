// This file is in charge of the build process:
// Running tests, checking code quality, minifying the code, etc.

// Include gulp
var gulp = require('gulp'); 

// Include our Plug-ins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var taskListing = require('gulp-task-listing');
var gutil = require('gulp-util');
var del = require('del');
var karma = require('gulp-karma');
var inject = require('gulp-inject');
var copy = require('gulp-copy');
var watch = require('gulp-watch');
var webserver = require('gulp-webserver');
var merge = require('merge-stream');
var mainBowerFiles = require('main-bower-files');
var cssmin = require('gulp-cssmin');
var minifyHTML = require('gulp-minify-html');

var bowerMain = require('bower-main');
var gulpIgnore = require('gulp-ignore');
var changed = require('gulp-changed');
var exists = require('path-exists').sync;


/*
 * HELP tasks.
 */
gulp.task( 'help', taskListing );
gulp.task( 'default', ['help']);


/*
 * QUALITY tasks.
 */
gulp.task('lint', function() {
	gutil.log( 'Analyzing source with JSHint.' );
	
    return gulp.src( './src/app/**/*.js' )
        .pipe( jshint())
        .pipe( jshint.reporter('default'));
});


/*
 * Tasks for UNIT tests.
 */
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


/*
 * DEV tasks.
 * These tasks are used to build a dev directory with the right scripts
 * and CSS files. There should be used in development mode. Their output is used
 * to build the final distribution.
 * 
 * Tasks workflow:
 * 
 * 1. clean-dev
 * 2. build-dev
 * 3. inject-dev
 */

// Clean all the output directories
gulp.task('clean-dev', function( cb ) {
	del([
	     './target/dev/js',
	     './target/dev/css',
	     './target/dev/templates',
	     './target/dev/img',
	     './target/dev/index.html'
	], cb);
});

// Shortcut for all the DEV tasks
gulp.task('build-dev', [ 'clean-dev' ], buildDevDirectory )
gulp.task('inject-dev', [ 'build-dev' ], injectScriptsInDev )

// These tasks do not aims at being invoked manually
gulp.task('build-watch-dev', buildDevDirectory )
gulp.task('inject-watch-dev', [ 'build-watch-dev' ], injectScriptsInDev )

// Watch the files and update the DEV directory
gulp.task('watch-dev', [ 'inject-dev' ], function () {
		
	// Run a web server
	gulp.src('./target/dev').pipe( webserver());
	
    // Watch changes in our SRC directory and update the DEV one
	gulp.watch( 'src/**/*', [ 'inject-watch-dev' ]);
});


// DEV functions
function injectScriptsInDev() {
	
	var bowerSources = gulp.src( mainBowerFiles());
	var roboconfSources = gulp.src([
	                                './target/dev/js/**/*.module.js',
	                                './target/dev/js/**/*.js', 
	                                './target/dev/css/**/*.css'], {read: false});

	return gulp.src('./target/dev/index.html')
			.pipe( inject( bowerSources, {name: 'bower', relative: true}))
			.pipe( inject( roboconfSources, {name: 'roboconf', relative: true}))
			.pipe( gulp.dest('./target/dev'));
}


function buildDevDirectory() {

	var html = gulp.src( './src/index.html' ).pipe( gulp.dest( './target/dev/' ));
	var favicon = gulp.src( './src/favicon.ico' )
				.pipe( changed( './target/dev/' ))
				.pipe( gulp.dest( './target/dev/' ));
	
	var css = gulp.src([ './src/roboconf.css' ])
				.pipe( changed( './target/dev/css' ))
				.pipe( copy('./target/dev/css', {'prefix': 1}));
	
	
	var js = gulp.src([ './src/app/**/*.js' ])
				.pipe( changed( './target/dev/js' ))
				.pipe( copy('./target/dev/js', {'prefix': 2}));
	
	var tpl = gulp.src([ './src/app/**/*.html' ])
				.pipe( changed( './target/dev/templates' ))
				.pipe( copy('./target/dev/templates', {'prefix': 2}));
	
	var img = gulp.src([ './src/img/*' ])
				.pipe( changed( './target/dev/img' ))
				.pipe( copy('./target/dev/img', {'prefix': 2}));

	return merge( html, favicon, js, tpl, img, css );
}


/*
 * DIST tasks.
 * These tasks create a "target/dist" directory that contain
 * minified resources and all the required Bower dependencies.
 * 
 * Therefore, it builds what should be embedded in the Roboconf distribution.
 */
gulp.task('clean-dist', function(done) {
	gutil.log('Cleaning: ' + gutil.colors.blue( "target/dist" ));
    del( "target/dist", done );
});

gulp.task('prepare-dist', [ 'clean-dist', 'lint', 'unit-tests' ], function() {
    
	var html = gulp.src( './src/index.html' ).pipe( gulp.dest( './target/dist/' ));
    var favicon = gulp.src( './src/favicon.ico' ).pipe( gulp.dest( './target/dist/' ));
    var css = gulp.src([ './src/roboconf.css' ]).pipe( cssmin()).pipe( rename( 'roboconf.min.css' )).pipe( gulp.dest( './target/dist/' ));
	var tpl = gulp.src([ './src/app/**/*.html' ]).pipe( copy('./target/dist/templates', {'prefix': 2}));
	var img = gulp.src([ './src/img/*' ]).pipe( copy('./target/dist/img', {'prefix': 2}));
	
	var minifyJs = gulp.src(['./src/app/**/*.module.js', './src/app/**/*.js'])
    				.pipe( concat('roboconf.min.js'))
    				.pipe( uglify())
    				.pipe( gulp.dest('target/dist'));
	
	return merge( html, favicon, tpl, img, css, minifyJs );
});

gulp.task('dist', [ 'prepare-dist' ], function() {

	// Copy minified resources (Bower)
	gulp.src( bowerMain( 'js', 'min.js' ).minified, {base: './target/dev/dependencies'})
			.pipe( gulp.dest( './target/dist/lib' ));
	
	gulp.src( bowerMain( 'css', 'min.css' ).minified, {base: './target/dev/dependencies'})
			.pipe( gulp.dest( './target/dist/lib' ));
	
	// Copy non-minified resources (Bower)
	// Notice we filter these resources to distinguish which one are minified.
	var otherBowerSources = gulp.src( mainBowerFiles(), {base: './target/dev/dependencies'})
			.pipe( gulpIgnore.include( keepNonMinified ))
			.pipe( gulp.dest( './target/dist/lib' ));
	
	// List our own resources
	var roboconfSources = gulp.src([
	                        './target/dist/roboconf.min.js',
	                        './target/dist/roboconf.min.css'], {read: false});

	// And inject...
	gulp.src('./target/dist/index.html')
			.pipe( inject( otherBowerSources, {name: 'bower', ignorePath: 'target/dist/', addRootSlash: false}))           
			.pipe( inject( roboconfSources, {name: 'roboconf', relative: true}))
			.pipe( minifyHTML())
			.pipe( gulp.dest('./target/dist'));
});

gulp.task('watch-dist', [ 'dist' ], function () {
	// Run a web server
	gulp.src('./target/dist').pipe( webserver());
});


// DIST functions
function keepNonMinified( file ) {
	
	var keep = true;
	if( file.path.match( '\.js$' )) {
		var minPath = file.path.replace( '.js', '.min.js' );
		keep = ! exists( minPath );
		
	} else if( file.path.match( '\.css$' )) {
		var minPath = file.path.replace( '.css', '.min.css' );
		keep = ! exists( minPath );
	}
	
	// gutil.log( file.path + ' => ' + keep );
	return keep;
}
