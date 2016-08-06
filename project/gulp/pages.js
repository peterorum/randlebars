'use strict';

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var config = require('./config');

var $ = require('gulp-load-plugins')({
  lazy: true
});

var templates = [
  path.join(config.paths.src, 'pages/**/*.hbs')
];

// make an html page from template name
gulp.task('pages:templates', function() {

  // inject file name into template, replacing <!-- insert:filename -->

  var templateHtml = fs.readFileSync(path.join(config.paths.src, 'pages/page.html'), 'utf8');


  return gulp.src(templates, {
    read: false
  })
    .pipe($.tap(function(file) {
      let filename = path.basename(file.path, '.hbs');

      let contents = templateHtml;

      // insert filename, replacing <!-- insert:filename -->
      contents = contents.replace(/<!--\s?insert\s?:\s?filename\s?-->/gi, filename);

      file.contents = new Buffer(contents);
    }))
    .pipe($.rename({
      extname: '.html'
    }))
    .pipe($.inject(gulp.src(path.join(config.paths.dev, 'css/libs.css'), {
      read: false
    }), config.injectCssLib))
    .pipe($.inject(gulp.src([path.join(config.paths.dev, 'css/*.css'), '!' + path.join(config.paths.dev, 'css/libs.css')], {
      read: false
    }), config.inject))
    .pipe($.inject(gulp.src(path.join(config.paths.dev, 'js/libs.js'), {
      read: false
    }), config.injectJsLib))
    // handlebats templates & partials
    .pipe($.inject(gulp.src([path.join(config.paths.dev, 'js/templates.js'), path.join(config.paths.dev, 'js/partials.js')], {
      read: false
    }), config.injectHandlebars))
    // actual source (apps, components, pages)
    .pipe($.inject(gulp.src([path.join(config.paths.src, '**/*.js')], {
      read: false
    }), config.injectJsLocal))
    .pipe(gulp.dest(config.paths.dev));
});

gulp.task('pages:build', [ 'pages:templates']);
