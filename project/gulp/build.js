'use strict';

var gulp = require('gulp');
var config = require('./config');
var runSequence = require('run-sequence');
var del = require('del');
var path = require('path');

var $ = require('gulp-load-plugins')({
  lazy: true
});

gulp.task('clean:prod', function() {
  return del(config.paths.prod);
});

gulp.task('build:optimized', function() {

  return gulp
    .src(path.join(config.paths.dev, 'pages/**/*.html'))
    .pipe($.plumber())
    // .pipe($.useref({searchPath: config.paths.dev}))
    .pipe($.useref({searchPath: [path.join(config.paths.dev, 'css'), path.join(config.paths.dev, 'js')]}))
    .pipe($.if('*.css', $.cleanCss()))
    .pipe($.if('**/scripts.js', $.babel({
      presets: ['es2015']
    })))
    .pipe($.if('**/scripts.js', $.uglify()))
    .pipe($.if('*.html', $.htmlmin(config.htmlmin)))
    // // Take inventory of the file names for future rev numbers
    // .pipe($.rev())
    // // Apply the concat and file replacement with useref
    // // Replace the file names in the html with rev numbers
    // .pipe($.revReplace())
    .pipe(gulp.dest(config.paths.prod));
});

gulp.task('build:assets', function() {

  return gulp
    .src([path.join(config.paths.dev, 'images/*.*')])
    .pipe(gulp.dest(path.join(config.paths.prod, 'images')));
});


gulp.task('build:dev', function(done) {
  runSequence('clean:dev',
    ['styles:build', 'images:build', 'libs:css', 'scripts:build', 'libs:js'],
    ['pages:build'],
    done);
});

gulp.task('build:prod', function(done) {

  runSequence('clean:prod',
    'build:dev',
    'build:optimized',
    'build:assets',
    done);
});
