// This file is in charge of the build process:
// Running tests, checking code quality, minifying the code, etc.

'use strict';

// Include gulp
var gulp = require('gulp');

// Include some of our plug-ins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var inject = require('gulp-inject');
var copy = require('gulp-copy');
var merge = require('merge-stream');
var cssmin = require('gulp-cssmin');
var exists = require('path-exists').sync;
var less = require('gulp-less');
var gutil = require('gulp-util');
var Set = require('collections/set');

// Fix for Bootstrap, that does not embed all the dist files...
var allMainBowerFiles = require('main-bower-files')({
  'overrides': {
    'bootstrap': {
      'main': [
               'dist/fonts/*',
               'dist/css/*',
               'js/dropdown.js']
    }
  }
});


/*
 * QUALITY tasks.
 */
gulp.task('lint', function() {
  var jshint = require('gulp-jshint');
  var gjslint = require('gulp-gjslint');

  // 80 characters per line is too restrictive!
  var lintOptions = {flags: ['--nojsdoc', '--max_line_length 120']};

  return gulp.src([ './src/app/**/*.js', './tests/**/*.js' ])
    .pipe( jshint())
    .pipe( jshint.reporter('default'))
    .pipe( gjslint(lintOptions))
    .pipe( gjslint.reporter('console'));
});


/*
 * Tasks for UNIT tests.
 */
gulp.task('test', function () {
  var karma = require('gulp-karma');

  gulp.src('./invalid-dir')
  .pipe(karma({
    configFile: 'karma.conf.js',
    action: 'run',
    showStack: true
  }))
  .on('error', function(err) {
    // Make sure failed tests cause gulp to exit non-zero
    console.log(err);
    this.emit('end'); // instead of erroring the stream, end it
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
 * 3. prepare-dev
 */

// Clean all the output directories
gulp.task('clean-dev', function( cb ) {
  del([
       './target/dev/js',
       './target/dev/css',
       './target/dev/templates',
       './target/dev/misc',
       './target/dev/img',
       './target/dev/index.html'
       ], cb);
});

// Shortcut for all the DEV tasks
gulp.task('build-dev', [ 'clean-dev' ], buildDevDirectory );
gulp.task('prepare-dev', [ 'build-dev' ], injectScriptsInDev );

// Watch the files and update the DEV directory
gulp.task('watch-dev', [ 'prepare-dev' ], function () {
  var watch = require('gulp-watch');
  var webserver = require('gulp-webserver');

  // Run a web server
  gulp.src('./target/dev').pipe( webserver());

  // Watch changes in our SRC directory and update the DEV one
  gulp.watch( 'src/**/*', [ 'prepare-watch-dev' ]);
});

// These tasks do not aim at being invoked manually
gulp.task('prepare-watch-dev', [ 'build-watch-dev' ], injectScriptsInDev );
gulp.task('build-watch-dev', buildDevDirectory );


// DEV functions
function injectScriptsInDev() {

  var bowerSources = gulp.src( allMainBowerFiles );
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

  var changed = require('gulp-changed');
  var html = gulp.src( './src/index.html' ).pipe( gulp.dest( './target/dev/' ));
  var favicon = gulp.src( './src/favicon.ico' )
    .pipe( changed( './target/dev/' ))
    .pipe( gulp.dest( './target/dev/' ));

  var css = gulp.src([ './src/roboconf.less' ])
    .pipe( less())
    .pipe( gulp.dest('./target/dev/css'))
    .pipe( changed( './target/dev/css' ))
    .pipe( copy('./target/dev/css', {'prefix': 1}));

  var js = gulp.src([ './src/app/**/*.js' ])
    .pipe( changed( './target/dev/js' ))
    .pipe( copy('./target/dev/js', {'prefix': 2}));

  var devJs = gulp.src([ './target/dev.config/**/*.js' ])
    .pipe( changed( './target/dev/js' ))
    .pipe( copy('./target/dev/js', {'prefix': 1}));

  var tpl = gulp.src([ './src/app/**/*.html' ])
    .pipe( changed( './target/dev/templates' ))
    .pipe( copy('./target/dev/templates', {'prefix': 2}));

  var misc = gulp.src([ './src/app/**/*.properties' ])
    .pipe( changed( './target/dev/misc' ))
    .pipe( copy('./target/dev/misc', {'prefix': 2}));

  var img = gulp.src([ './src/img/*' ])
    .pipe( changed( './target/dev/img' ))
    .pipe( copy('./target/dev/img', {'prefix': 2}));

  var i18n = gulp.src([ './src/i18n/*' ])
  .pipe( changed( './target/dev/i18n' ))
  .pipe( copy('./target/dev/i18n', {'prefix': 2}));

  return merge( html, favicon, js, devJs, tpl, img, css, misc, i18n );
}


/*
 * DIST tasks.
 * These tasks create a 'target/dist' directory that contain
 * minified resources and all the required Bower dependencies.
 *
 * Therefore, it builds what should be embedded in the Roboconf distribution.
 */
gulp.task('clean-dist', function(done) {
  console.log('Cleaning target/dist' );
  del( 'target/dist', done );
});

gulp.task('prepare-dist', [ 'clean-dist', 'lint', 'check_i18n', 'test' ], prepareDist);
gulp.task('dist', [ 'prepare-dist' ], completeDist);

gulp.task('watch-dist', [ 'dist' ], function () {
  var watch = require('gulp-watch');
  var webserver = require('gulp-webserver');
  gulp.src('./target/dist').pipe( webserver());
});


// DIST functions
function prepareDist() {

  var html = gulp.src( './src/index.html' ).pipe( gulp.dest( './target/dist/' ));
  var favicon = gulp.src( './src/favicon.ico' ).pipe( gulp.dest( './target/dist/' ));
  var css = gulp.src([ './src/roboconf.less' ]).pipe( less()).pipe( cssmin()).pipe( rename( 'roboconf.min.css' )).pipe( gulp.dest( './target/dist/' ));
  var tpl = gulp.src([ './src/app/**/*.html' ]).pipe( copy('./target/dist/templates', {'prefix': 2}));
  var img = gulp.src([ './src/img/*' ]).pipe( copy('./target/dist/img', {'prefix': 2}));
  var misc = gulp.src([ './src/app/**/*.properties' ]).pipe( copy('./target/dist/misc', {'prefix': 2}));
  var i18n = gulp.src([ './src/i18n/*' ]).pipe( copy('./target/dist/i18n', {'prefix': 2}));

  var minifyJs = gulp.src(['./src/app/**/*.module.js', './src/app/**/*.js'])
    .pipe( concat('roboconf.min.js'))
    .pipe( uglify())
    .pipe( gulp.dest('target/dist'));

  var devJs = gulp.src([ './target/dev.config/**/*.js' ])
    .pipe( copy('./target/dist', {'prefix': 2}));

  var flags = gulp.src( './target/dev/dependencies/flag-icon-css/flags/**' ).pipe( gulp.dest( './target/dist/lib/flag-icon-css/flags/' ));

  return merge( html, favicon, tpl, misc, img, css, minifyJs, devJs, i18n, flags );
}

function completeDist() {
  // Find Bower dependencies with minified versions when available
  var bowerWithMin = allMainBowerFiles.map( function(path, index, arr) {
    var newPath = path.replace(/.([^.]+)$/g, '.min.$1');
    return exists( newPath ) ? newPath : path;
  });

  var bowerSourcesWithMin = gulp.src( bowerWithMin, {base: './target/dev/dependencies'})
    .pipe( gulp.dest( './target/dist/lib' ));

  // List our own resources
  var roboconfSources = gulp.src([
    './target/dist/*.min.js',
    './target/dist/*.js',
    './target/dist/roboconf.min.css'], {read: false});

  var devJs = gulp.src(['./target/dist/'], {read: false});

  // And inject...
  return gulp.src('./target/dist/index.html')
    .pipe( inject( bowerSourcesWithMin, {name: 'bower', ignorePath: 'target/dist/', addRootSlash: false}))
    .pipe( inject( roboconfSources, {name: 'roboconf', relative: true}))
    .pipe( gulp.dest('./target/dist'));
}


/*
 * Production tasks.
 * Those we will run from Maven.
 */
gulp.task('no-dev-config', function () {

  if (exists('./target/dev.config')) {
    throw new gutil.PluginError({
      plugin: 'no-dev-config',
      message: 'The embed task cannot work as long as "target/dev.config" exists. Please, delete or rename this directory.'
    });
  }
});

gulp.task('prepare-embed', [ 'clean-dist', 'no-dev-config' ], prepareDist);
gulp.task('complete-embed', [ 'prepare-embed' ], completeDist);
gulp.task('embed', [ 'prepare-embed', 'complete-embed' ]);
gulp.task('clean', [ 'clean-dist', 'clean-dev' ]);


/*
 * i18n verifications.
 */
var qual = require('angular-translate-quality');
gulp.task('check_i18n', function() {

  var res = qual.validate({
    loc_i18n: './src/i18n/**/',
    loc_html: './src/app/**/'
  });

  if (! res) {
    throw new gutil.PluginError({
      plugin: 'check_i18n',
      message: 'Errors were found about internationalization.'
    });
  }
});
