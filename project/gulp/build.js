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


gulp.task('build:optimize:css', function() {

  return gulp
    .src(path.join(config.paths.dev, 'index.html'))
    .pipe($.plumber())
    .pipe($.useref({searchPath: config.paths.dev }))
    .pipe($.filter(config.paths.dev + '**/*.css'))
    .pipe($.rev())
    .pipe($.sourcemaps.init())
    .pipe($.cleanCss())
    .pipe($.sourcemaps.write('maps'))
    .pipe(gulp.dest(config.paths.prod));
});

gulp.task('build:optimize:js', function() {

  return gulp
    .src(path.join(config.paths.dev, 'index.html'))
    .pipe($.plumber())
    .pipe($.useref({searchPath: [config.paths.dev, config.paths.src] }))
    .pipe($.filter(config.paths.dev + '**/*.js'))
    .pipe($.rev())
    .pipe($.sourcemaps.init())
    // only transpile or minify custom js
    .pipe($.if(/.*scripts-.*\.js$/, $.babel({
      presets: ['es2015']
    })))
    .pipe($.if(/.*scripts-.*\.js$/, $.uglify()))
    .pipe($.sourcemaps.write('maps'))
    .pipe(gulp.dest(config.paths.prod));
});

gulp.task('build:optimize:html', function() {

  return gulp
    .src(path.join(config.paths.dev, '*.html'))
    .pipe($.plumber())
    .pipe($.useref({searchPath: [config.paths.dev, config.paths.src] }))
    .pipe($.if(/.*[js|css]$/, $.rev()))
    .pipe($.if('*.html', $.htmlmin(config.htmlmin)))
    .pipe($.revReplace())
    .pipe($.if(/.*\.html$/, gulp.dest(config.paths.prod)));
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
    ['build:optimize:html', 'build:optimize:js', 'build:optimize:css', 'build:assets'],
    done);
});

gulp.task('build', ['build:prod']);
