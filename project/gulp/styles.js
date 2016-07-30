'use strict';

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var config = require('./config');

var $ = require('gulp-load-plugins')({
  lazy: true
});

var src = [
  path.join(config.paths.css.src, 'styles/variables/**/*.scss'),
  path.join(config.paths.css.src, 'styles/common/**/*.scss'),
  path.join(config.paths.css.src, 'components/**/*.scss')
];

var templates = [
  path.join(config.paths.css.src, 'pages/**/*.hbs')
];

var libs = [path.join(config.paths.css.src, '/styles/libs.scss')];

// lint - error checking

gulp.task('styles:lint', function() {
  gulp.src(path.join(config.paths.css.src, '/components/**/*.scss'))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
});

// make an html page from template name
gulp.task('styles:pages', function() {

  // inject file name into template, replacing <!-- insert:filename -->

  var templateHtml = fs.readFileSync(path.join(config.paths.css.src, 'pages/page.html'), 'utf8');

  var injectOptions = {
    ignorePath: 'dist/',
    addPrefix: '..',
    addRootSlash: false,
  };

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
    .pipe($.inject(gulp.src(path.join(config.paths.css.dest, '*.min.css'), {
      read: false
    }), injectOptions))
    .pipe($.inject(gulp.src(path.join(config.paths.js.dest, '*.min.js'), {
      read: false
    }), injectOptions))
    .pipe(gulp.dest(config.paths.css.pages));
});

// build css from sass (except libs)

var sassOptions = {
  style: 'expanded'
};

gulp.task('styles:css', function() {

  return gulp.src(src)
    // .pipe($.debug())
    .pipe($.plumber({
      errorHandler: config.errorHandler('styles:css')
    }))
    .pipe($.concat('styles.scss'))
    .pipe($.sass(sassOptions))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', '> 5%']
    }))
    .pipe(gulp.dest(config.paths.css.dest));
});

// build library
// doesn't change often, so not in watch. just gulp build

gulp.task('libs:css', function() {

  return gulp.src(libs)
    // .pipe($.debug())
    .pipe($.plumber({
      errorHandler: config.errorHandler('libs:css')
    }))
    .pipe($.sass(sassOptions))
    .pipe($.autoprefixer())
    .pipe(gulp.dest(config.paths.css.dest));
});

// build minified css from css

function minify() {

  return gulp.src([path.join(config.paths.css.dest, '/**/*.css'), '!' + path.join(config.paths.css.dest, '/**/*.min.css')])
    .pipe($.debug())
    .pipe($.sourcemaps.init())
    .pipe($.cleanCss({}))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.sourcemaps.write('maps'))
    .pipe(gulp.dest(config.paths.css.dest));
}
;

gulp.task('styles:minify', function() {

  return minify();

});

// wait for css to build before minifying
gulp.task('styles:build', ['styles:css', 'styles:pages'], function() {
  return minify();
});
