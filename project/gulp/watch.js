'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');

gulp.task('watch:js', function() {
  gulp.watch([path.join(config.paths.js.src, '/**/*.js')], ['scripts:lint', 'scripts:build']);
});

gulp.task('watch:handlebars:templates', function() {
  gulp.watch([path.join(config.paths.js.src, '/pages/**/*.hbs')], ['scripts:watch:handlebars:templates']);
});

gulp.task('watch:handlebars:partials', function() {
  gulp.watch([path.join(config.paths.js.src, '/components/**/*.hbs')], ['scripts:watch:handlebars:partials']);
});

gulp.task('watch:pages', function() {
  gulp.watch([path.join(config.paths.js.src, '/pages/**/*.html')], ['styles:pages']);
});

gulp.task('watch:css', function() {
  gulp.watch(path.join(config.paths.css.src, '/**/*.scss'),['styles:lint', 'styles:build']);
});

gulp.task('watch', ['watch:js', 'watch:handlebars:templates', 'watch:handlebars:partials', 'watch:css', 'watch:pages']);
