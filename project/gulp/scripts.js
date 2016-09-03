'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');
var args = require('yargs').argv;
var del = require('del');
var fs = require('fs');
var handlebars = require('handlebars');
var runSequence = require('run-sequence');

var $ = require('gulp-load-plugins')({
  lazy: true
});

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
  path.join(config.paths.libs, 'jquery/dist/jquery.min.js'),
  path.join(config.paths.libs, 'handlebars/handlebars.runtime.min.js')
];

// expected as individual modules
var separateLibs = [];

// eslint

gulp.task('scripts:lint:eslint', function() {

  return gulp.src(config.jsSrc())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

// jscs

gulp.task('scripts:lint:jscs', function() {

  return gulp.src(config.jsSrc())
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.jscs.reporter('fail'));
});

// jscs, including fixes back to src
// do not run when watching as it causes infinite loop

gulp.task('scripts:lint:jscs:fix', function() {

  return gulp.src(config.jsSrc())
    .pipe($.jscs({
      fix: true
    }))
    .pipe(gulp.dest(config.paths.js.src));
});

// compile client-side partials
gulp.task('handlebars:partials', function() {
  return gulp.src(handlebarsPartials)
    // name begins with _
    .pipe($.filter( file => /^_/.test(path.basename(file.path))))
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
          return JSON.stringify(path.basename(fileName, '.js').replace(/^_/, ''));
        }
      }
    }))
    .pipe($.concat('partials.js'))
    .pipe(gulp.dest(path.join(config.paths.dev, 'js')));
});

// compile handlebars templates to html server-side
// make an html page for each template, rendering its handlebars into <!-- inset:content -->

gulp.task('handlebars:compile:templates', function() {

  var templateHtml = fs.readFileSync(path.join(config.paths.src, 'pages/page.html'), 'utf8');

  // wire-up the bower dependencies

  var wiredep = require('wiredep').stream;
  var wiredepOptions = config.getWiredepDefaultOptions();

  return gulp.src(handlebarsTemplates)
    .pipe($.tap(function(file) {

      // init with whole page template
      let contents = templateHtml;

      // render handlebars to html
      var data = {};
      var options = {
      };

      var template = handlebars.compile(file._contents.toString(), options);
      var html = template(data);

      // insert html, replacing <!-- insert:html -->
      contents = contents.replace(/<!--\s?insert\s?:\s?html\s?-->/gi, html);

      file.contents = new Buffer(contents);
    }))
    .pipe($.rename({
      extname: '.html'
    }))
    // wiredep bower
    .pipe(wiredep(wiredepOptions))
    // inject custom css
    .pipe($.inject(gulp.src([path.join(config.paths.dev, 'css/*.css')], {
      read: false
    }), config.inject))
    // handlebars templates & partials
    .pipe($.inject(gulp.src([path.join(config.paths.dev, 'js/templates.js'), path.join(config.paths.dev, 'js/partials.js')], {
      read: false
    }), config.injectHandlebars))
    // inject custom js (apps, components, pages)
    .pipe($.inject(gulp.src(config.jsSrc(), {
      read: false
    }), config.injectJsLocal))
    .pipe(gulp.dest(config.paths.dev));
});

// register each server-side partial for compilation process
gulp.task('handlebars:compile:registerPartials', function() {
  return gulp.src(handlebarsPartials)
    .pipe($.if(args.verbose, $.debug({
      title: 'register partial'
    })))
  .pipe($.tap(file => {
      let filename = path.basename(file.path, '.hbs').replace(/^_/, '');
      handlebars.registerPartial(filename, file._contents.toString());
  }))
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

gulp.task('handlebars:build', ['handlebars:compile']);

gulp.task('handlebars:compile', function(done) {

  return runSequence(['handlebars:partials', 'handlebars:compile:registerPartials'],
    'handlebars:compile:templates',
    done);
});

gulp.task('scripts:build', ['handlebars:build']);

