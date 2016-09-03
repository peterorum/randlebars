'use strict';

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var config = require('./config');

var $ = require('gulp-load-plugins')({
  lazy: true
});

var templates = [
  path.join(config.paths.src, 'pages/**/*.hbs')
];


// gulp.task('pages:build', ['pages:templates']);
