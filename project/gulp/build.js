'use strict';

var gulp = require('gulp');
var config = require('./config');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean:prod', function() {
  return del(config.paths.prod);
});

gulp.task('build:prod', function(done) {
  runSequence('clean:prod',
    ['styles:build', 'styles:images', 'libs:css', 'scripts:build', 'libs:js'],
    ['styles:pages'],
    done);
});

gulp.task('build:dev', function(done) {
  runSequence('clean:dev',
    ['styles:build', 'images:build', 'libs:css', 'scripts:build', 'libs:js'],
    ['pages:build'],
    done);
});

