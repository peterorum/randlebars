'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var src = [
  path.join(conf.paths.js.src, '/app/**/*.js'),
  path.join(conf.paths.js.src, '/components/**/*.js'),
  path.join(conf.paths.js.src, '/pages/**/*.js')
];

// compiled handlebars
var views = [
  path.join(conf.paths.js.views, '/*.js')
];

// must already be minified
// after change, run gulp build

var libs = [
  path.join(conf.paths.js.libs, 'handlebars/handlebars.runtime.min.js')
];

// expected as individual modules
var separateLibs = [];

// eslint

gulp.task('scripts:lint:eslint', function() {

  return gulp.src(src)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

// jscs

gulp.task('scripts:lint:jscs', function() {

  return gulp.src(src)
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.jscs.reporter('fail'));
});

// jscs, including fixes back to src
// do not run when watching as it causes infinite loop

gulp.task('scripts:lint:jscs:fix', function() {

  return gulp.src(src)
    .pipe($.jscs({
      fix: true
    }))
    .pipe(gulp.dest(path.join(conf.paths.js.src, '/')));
});

// join all js, converting from es6

gulp.task('scripts:js', function() {

  return gulp.src(views.concat(src))
    .pipe($.debug({
      title: 'scripts:js:'
    }))
    .pipe($.concat('scripts.js'))
    .pipe(gulp.dest(conf.paths.js.dest));
});

// join all specific library js (must already be minimized)
// doesn't change often, so not in watch. just gulp build

gulp.task('libs:js:min', function() {

  return gulp.src(libs)
    .pipe($.concat('libs.min.js'))
    .pipe(gulp.dest(conf.paths.js.dest));
});

// // modules that must be individual

gulp.task('libs:js:separate', function() {

  // do not run through babel

  return gulp.src(separateLibs)
    .pipe(gulp.dest(conf.paths.js.dest));
});

// build minified js

function minify() {

  return gulp.src([path.join(conf.paths.js.dest, '/partials.js'),
    path.join(conf.paths.js.dest, '/templates.js'),
    path.join(conf.paths.js.dest, '/scripts.js')])
    .pipe($.concat('scripts.js'))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.uglify())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.sourcemaps.write('maps'))
    .pipe(gulp.dest(conf.paths.js.dest));
}
;

gulp.task('scripts:minify', function() {

  return minify();
});

gulp.task('scripts:lint', ['scripts:lint:eslint', 'scripts:lint:jscs']);

// only run manually, not with watch
gulp.task('scripts:fix', ['scripts:lint:jscs:fix']);

gulp.task('libs:js', ['libs:js:min', 'libs:js:separate']);

// wait for js to build before minifying
gulp.task('scripts:build', ['scripts:js'], function() {
  return minify();
});

// re-minify after handlebars compilation
gulp.task('scripts:build:minify', [], function() {
  return minify();
});
