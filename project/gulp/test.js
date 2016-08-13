'use strict';

var gulp = require('gulp');
var config = require('./config');

function startTests(isSingleRun, done) {
  var karma = require('karma').Server;
  var excludeFiles = [];

  // integration tests that hit backend
  var serverSpecs = config.karma.serverIntegrationSpecs;

  excludeFiles = serverSpecs;

  karma.start({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: !!isSingleRun,
    autoWatch: !isSingleRun,
    exclude: excludeFiles,
  }, karmaDone)



  function karmaDone(karmaResult) {
    console.log('tests done');

    if (karmaResult === 1) {
      //fail
      done('karma test: fail with code ' + karmaResult);
    } else {
      // success
      done();
    }
  }

}

// single run
gulp.task('test', [/* 'build:dev' */], function(done) {

  startTests(true, done); // single run

});

// watch

gulp.task('watch:test', function(done) {

  startTests(false, done); // not single run

});

