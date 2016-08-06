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
    .src(path.join(config.paths.dev, '*.html'))
    .pipe($.plumber())
    .pipe($.useref({searchPath: config.paths.dev}))
    .pipe($.if(/.*[js|css]$/, $.sourcemaps.init()))
    .pipe($.if('*.css', $.cleanCss()))
    // do not compile or minify libraries
    .pipe($.if('**/scripts.min.js', $.babel({
      presets: ['es2015']
    })))
    .pipe($.if('**/scripts.min.js', $.uglify()))
    .pipe($.if(/.*[js|css]$/, $.sourcemaps.write('maps')))
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
