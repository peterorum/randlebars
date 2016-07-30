'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  lazy: true
});

// watch js source
gulp.task('watch:js', function() {
  $.watch([path.join(conf.paths.js.src, '/**/*.js')], $.batch(function(events, done) {
    gulp.start(['scripts:lint', 'scripts:build'], done);
  }));
});

gulp.task('watch:handlebars:templates', function() {
  $.watch([path.join(conf.paths.js.src, '/pages/**/*.hbs')], $.batch(function(events, done) {
    gulp.start(['scripts:handlebars:templates'], done);
  }));
});

gulp.task('watch:handlebars:partials', function() {
  $.watch([path.join(conf.paths.js.src, '/components/**/*.hbs')], $.batch(function(events, done) {
    gulp.start(['scripts:handlebars:partials'], done);
  }));
});


gulp.task('watch:pages', function() {
  $.watch([path.join(conf.paths.js.src, '/pages/**/*.html')], $.batch(function(events, done) {
    gulp.start(['styles:pages'], done);
  }));
});

gulp.task('watch:css', function() {
  $.watch(path.join(conf.paths.css.src, '/**/*.scss'), $.batch(function(events, done) {
    gulp.start(['styles:lint', 'styles:build'], done);
  }));
});

gulp.task('watch', ['watch:js', 'watch:handlebars:templates', 'watch:handlebars:partials', 'watch:css', 'watch:pages']);
