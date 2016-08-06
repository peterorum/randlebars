'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');
var args = require('yargs').argv;
var del = require('del');

var handlebars = require('handlebars');

var $ = require('gulp-load-plugins')({
  lazy: true
});

var src = [
  path.join(config.paths.src, '/app/**/*.js'),
  path.join(config.paths.src, '/components/**/*.js'),
  path.join(config.paths.src, '/pages/**/*.js')
];

// handlebars

// pages
var handlebarsTemplates = [
  path.join(config.paths.src, 'pages/**/*.hbs')
];

// components
var handlebarsPartials = [
  path.join(config.paths.src, 'components/**/*.hbs')
];


// must already be minified
// after change, run gulp build

var libs = [
  path.join(config.paths.libs, 'handlebars/handlebars.runtime.min.js')
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
    .pipe(gulp.dest(config.paths.js.src));
});

// handlebars templates
gulp.task('handlebars:templates', function() {
  return gulp.src(handlebarsTemplates)
    // .pipe($.if(args.verbose, $.debug({
    //   title: 'templates'
    // })))
    .pipe($.handlebars({
      handlebars: handlebars
    }))
    .pipe($.wrap('Handlebars.template(<%= contents %>)'))
    .pipe($.declare({
      namespace: 'randlebars.templates',
      root: "window",
      noRedeclare: true, // avoid duplicate declarations
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest(path.join(config.paths.dev, 'js')));
});

gulp.task('handlebars:partials', function() {
  return gulp.src(handlebarsPartials)
    .pipe($.if(args.verbose, $.debug({
      title: 'partial'
    })))
    .pipe($.htmlmin(config.htmlmin))
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
    .pipe(gulp.dest(path.join(config.paths.dev, 'js')));
});

// join all js

gulp.task('scripts:js', function() {

  // skip babel as it's slow
  // means only developing in chrome

  return gulp.src(src)
    .pipe($.if(args.verbose, $.debug({
      title: 'scripts:js:'
    })))
    .pipe($.concat('scripts.js'))
    .pipe(gulp.dest(path.join(config.paths.dev, 'js')));
});

// join all specific library js (must already be minimized)
// doesn't change often, so not in watch. just gulp build

gulp.task('libs:js', function() {

  return gulp.src(libs)
    .pipe($.concat('libs.js'))
    .pipe(gulp.dest(path.join(config.paths.dev, 'js')));
});

// // modules that must be individual

gulp.task('libs:js:separate', function() {

  // do not run through babel

  return gulp.src(separateLibs)
    .pipe(gulp.dest(config.paths.dev));
});

gulp.task('clean:dev', function() {
  return del(config.paths.dev);
});

// build minified js

function minify() {

  return gulp.src([path.join(config.paths.dev, 'js//partials.js'),
    path.join(config.paths.dev, 'js/templates.js'),
    path.join(config.paths.dev, 'js/scripts.js')])
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
    .pipe(gulp.dest(config.paths.dev));
};

gulp.task('scripts:minify', function() {

  return minify();
});

gulp.task('scripts:lint', ['scripts:lint:eslint', 'scripts:lint:jscs']);

// only run manually, not with watch
gulp.task('scripts:fix', ['scripts:lint:jscs:fix']);

gulp.task('libs:js:build', ['libs:js', 'libs:js:separate']);

gulp.task('handlebars:build', ['handlebars:templates', 'handlebars:partials']);

gulp.task('scripts:build', ['scripts:js', 'handlebars:build']);
