// Karma configuration
// Generated on Mon May 04 2015 15:56:55 GMT+0200 (CEST)

module.exports = function(config) {
  var wiredep = require( 'wiredep' );
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [].concat(
            // Our client dependencies (Angular, etc)
            wiredep({devDependencies: true})['js'],
            
            // Our module definitions
            'src/app/**/*.module.js',
            
            // Our JS files
            'src/app/**/*.js',
            
            // Load our directives for tests pre-processing
            'src/app/**/*.html',
            
            // Load our unit tests in last
            'tests/unit/**/*.spec.js'
    ),


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // pre-process matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    	'src/app/**/*.js': ['coverage'],
    	'src/app/**/*.html': ['html2js']
    },
    
    
    // configure the reporter
    coverageReporter: {
      type: 'html',
      dir: 'target/coverage/'
    },
    

    // Strip the path's prefix for unit tests
    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/app/',
      prependPrefix: 'templates/'
    },
    

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
