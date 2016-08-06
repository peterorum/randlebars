'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');

gulp.task('watch:css', function() {
  gulp.watch(path.join(config.paths.src, '**/*.scss'),['styles:lint', 'styles:css']);
});

gulp.task('watch:js', function() {
  gulp.watch([path.join(config.paths.src, '**/*.js')], ['scripts:lint']);
});

gulp.task('watch:handlebars:templates', function() {
  gulp.watch([path.join(config.paths.src, 'pages/**/*.hbs')], ['handlebars:templates']);
});

gulp.task('watch:handlebars:partials', function() {
  gulp.watch([path.join(config.paths.src, 'components/**/*.hbs')], ['handlebars:partials']);
});

gulp.task('watch:pages', function() {
  gulp.watch([path.join(config.paths.src, 'pages/**/*.html')], ['pages:templates']);
});

gulp.task('watch', ['watch:js', 'watch:handlebars:templates', 'watch:handlebars:partials', 'watch:css', 'watch:pages']);
