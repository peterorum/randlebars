'use strict';

var gulp = require('gulp');
var fs = require('fs');

// load all tasks from the local gulp folder
fs.readdirSync('./gulp').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

gulp.task('default', ['build'], function() {
});
