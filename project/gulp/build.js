'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function() {
  return del('./dist');
});

gulp.task('build', function(done) {
  runSequence('clean',
    ['styles:build', 'styles:images', 'libs:css', 'scripts:build', 'libs:js'],
    ['styles:pages'],
    done);
});

