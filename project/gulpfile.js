'use strict';

var gulp = require('gulp');

// for recursive folder processing
var wrench = require('wrench');

// load all tasks from the local gulp folder
wrench.readdirSyncRecursive('./Gulp').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

// default task is to compile sass
gulp.task('default', [], function () {
  gulp.start('build');
});
