'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');

var bs = require('browser-sync');
// var browserSync = bs.has('dev-server') ? bs.get('dev-server') : bs.create('dev-server');
var browserSync =  bs.get('dev-server');;

gulp.task('watch', [], () => {
  browserSync.init({
    server: true,
    startPath: '.tmp/',
    port: 3000
  });

  // force page reload
  gulp.watch([path.join(config.paths.src, '**/*.js')], ['scripts:lint', browserSync.reload]);
  gulp.watch([path.join(config.paths.src, 'pages/**/*.hbs')], ['handlebars:templates', browserSync.reload]);
  gulp.watch([path.join(config.paths.src, 'components/**/*.hbs')], ['handlebars:partials', browserSync.reload]);
  gulp.watch([path.join(config.paths.src, 'pages/**/*.html')], ['pages:templates', browserSync.reload]);

  // css is injected without reload in styles.js
  gulp.watch(path.join(config.paths.src, '**/*.scss'),['styles:lint', 'styles:css']);
});

