'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');

var bs = require('browser-sync');
var browserSync = bs.has('dev-server') ? bs.get('dev-server') : bs.create('dev-server');

gulp.task('watch', [], () => {
  // separate tasks to force page reload
  gulp.watch([path.join(config.paths.src, '**/*.js')], ['watch:js']);
  gulp.watch([path.join(config.paths.src, 'pages/**/*.hbs')], ['watch:handlebars:templates']);
  gulp.watch([path.join(config.paths.src, 'components/**/*.hbs')], ['watch:handlebars:partials']);
  gulp.watch([path.join(config.paths.src, 'pages/**/*.html')], ['watch:pages:templates']);

  // css is injected without reload in styles.js
  gulp.watch(path.join(config.paths.src, '**/*.scss'),['styles:lint', 'styles:css']);
});

gulp.task('watch:js', ['scripts:lint'], function(done){
  browserSync.reload();
  done();
});

gulp.task('watch:handlebars:templates', ['handlebars:templates'], function(done){
  browserSync.reload();
  done();
});

gulp.task('watch:handlebars:partials', ['handlebars:partials'], function(done){
  browserSync.reload();
  done();
});

gulp.task('watch:pages:templates', ['pages:templates'], function(done){
  browserSync.reload();
  done();
});

// start server

gulp.task('serve', ['watch'], function(){

  browserSync.instance = browserSync.init({
    server: true,
    startPath: '.tmp/',
    port: 3000
  });

});
