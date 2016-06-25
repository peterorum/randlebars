'use strict';

var gulp = require('gulp');

gulp.task('build', ['styles:build', 'libs:css', 'scripts:build', 'libs:js']);

