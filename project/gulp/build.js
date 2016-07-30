'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function() {
  del('./dist');
});

gulp.task('build', function() {
  runSequence('clean',
    ['styles:build', 'libs:css', 'scripts:build', 'libs:js']);
});
