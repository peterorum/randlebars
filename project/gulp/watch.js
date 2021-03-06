'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');

var bs = require('browser-sync');
var browserSync = bs.has('dev-server') ? bs.get('dev-server') : bs.create('dev-server');

gulp.task('watch:files', [], () => {
  // css is injected without reload in styles.js
  gulp.watch(path.join(config.paths.src, '**/*.scss'), ['styles:lint', 'styles:css']);

  // separate tasks to force page reload
  gulp.watch([path.join(config.paths.src, '**/*.js')], ['watch:js']);
  gulp.watch([path.join(config.paths.src, 'pages/**/*')], ['watch:handlebars:templates']);
  gulp.watch([path.join(config.paths.src, 'components/**/*.hbs')], ['watch:handlebars:partials']);
});

gulp.task('watch:js', ['scripts:lint'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('watch:handlebars:templates', ['handlebars:compile'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('watch:handlebars:partials', ['handlebars:compile', 'handlebars:partials'], function(done) {
  browserSync.reload();
  done();
});

// --------- start server & watch

gulp.task('watch', ['watch:files'], function() {

  browserSync.init({
    server: true,
    startPath: config.paths.dev,
    port: 3000
  });

  console.log('For tests, run gulp watch:test');
});

gulp.task('serve:dist', ['build:dist'], function(done) {

  browserSync.init({
    server: true,
    startPath: config.paths.dist,
    port: 3001
  });

  done();
});
