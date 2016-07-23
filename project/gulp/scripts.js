'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var handlebars = require('handlebars');

var $ = require('gulp-load-plugins')();

var src = [
  path.join(conf.paths.js.src, '/app/**/*.js'),
  path.join(conf.paths.js.src, '/components/**/*.js'),
  path.join(conf.paths.js.src, '/pages/**/*.js')
];

// handlebars

// pages
var handlebarsTemplates = [
  path.join(conf.paths.js.src, 'pages/**/*.hbs')
];

// components
var handlebarsPartials = [
  path.join(conf.paths.js.src, 'components/**/*.hbs')
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

// handlebars templates
gulp.task('scripts:handlebars:templates', function() {
  return gulp.src(handlebarsTemplates)
    .pipe($.debug({
      title: 'templates'
    }))
    .pipe($.handlebars({
      handlebars: handlebars
    }))
    .pipe($.wrap('Handlebars.template(<%= contents %>)'))
    .pipe($.declare({
      namespace: 'soh.templates',
      root: "window",
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest(conf.paths.js.dest));
});

gulp.task('scripts:handlebars:partials', function() {
  return gulp.src(handlebarsPartials)
    .pipe($.debug({
      title: 'partial'
    }))
    .pipe($.handlebars({
      handlebars: handlebars
    }))
    .pipe($.wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
      imports: {
        processPartialName: function(fileName) {
          return JSON.stringify(path.basename(fileName, '.js'));
        }
      }
    }))
    .pipe($.concat('partials.js'))
    .pipe(gulp.dest(conf.paths.js.dest));
});

// join all js, converting from es6

gulp.task('scripts:js', function() {

  return gulp.src(src)
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

gulp.task('scripts:handlebars', ['scripts:handlebars:templates', 'scripts:handlebars:partials']);

// wait for js to build before minifying

// watches
gulp.task('scripts:watch:handlebars', ['scripts:handlebars'], function() {
  return minify();
});


// wait for js to build before minifying
gulp.task('scripts:build', ['scripts:handlebars', 'scripts:js'], function() {
  return minify();
});

// re-minify after handlebars compilation
gulp.task('scripts:build:minify', [], function() {
  return minify();
});
