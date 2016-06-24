'use strict';

var gulp = require('gulp');

gulp.task('build', ['styles:build', 'libs:css', 'libs:fonts', 'scripts:build', 'libs:js']);

