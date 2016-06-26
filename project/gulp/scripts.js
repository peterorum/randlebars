'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var src = [
  path.join(conf.paths.js.src, '/components/**/*.js'),
  '!' + path.join(conf.paths.js.src, '/components/**/*.spec.js')
];

// must already be minified
// after change, run gulp build


var libs = [];

// expected as individual modules
var requireLibs = [
  path.join(conf.paths.js.libs, 'handlebars/handlebars.runtime.js'),
  path.join(conf.paths.js.libs, '../libs/js/require/require.js'),
  path.join(conf.paths.js.libs, '../libs/js/require/text.js'),
  path.join(conf.paths.js.src, 'modules/*.js'),
  path.join(conf.paths.js.src, '../main.js')
];

// eslint

gulp.task('scripts:lint:eslint', function() {

  return gulp.src(src)
    .pipe($.debug({
      title: 'files:'
    }))
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

  return gulp.src(src.concat('!' + path.join(conf.paths.js.src, '/**/*.spec.js')))
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

// modules that must be individual

gulp.task('libs:js:require', function() {

  return gulp.src(requireLibs)
    .pipe(gulp.dest(conf.paths.js.dest));
});

// build minified js

function minify() {

  return gulp.src([path.join(conf.paths.js.dest, '/scripts.js')])
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

gulp.task('libs:js', ['libs:js:min', 'libs:js:require']);

// wait for js to build before minifying
gulp.task('scripts:build', ['scripts:js'], function() {
  return minify();
});
