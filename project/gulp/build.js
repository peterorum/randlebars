'use strict';

var gulp = require('gulp');

gulp.task('build', ['styles:build', 'styles:pages', 'libs:css', 'scripts:build', 'libs:js']);

