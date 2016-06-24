// Karma configuration
// Generated on Fri Mar 18 2016 11:46:47 GMT+1100 (AEDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [

      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',

      'src/app/app.module.js',

      'src/components/**/*.js',

      'src/components/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // do not include library files
    preprocessors: {
      'src/**/*.js': ['babel']
    },

    // must install this in a folder above source
    // npm install --save-dev babel-preset-es2015
    babelPreprocessor: {
        options: {
            presets: ['es2015'],
            sourceMap: 'inline'
        },
        filename: function(file) {
            return file.originalPath.replace(/\.js$/, '.es5.js');
        },
        sourceFileName: function(file) {
            return file.originalPath;
        }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
