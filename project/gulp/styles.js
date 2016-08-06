'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');

var $ = require('gulp-load-plugins')({
  lazy: true
});

var src = [
  path.join(config.paths.src, 'styles/variables/**/*.scss'),
  path.join(config.paths.src, 'styles/common/**/*.scss'),
  path.join(config.paths.src, 'components/**/*.scss')
];

var libs = [path.join(config.paths.src, '/styles/libs.scss')];

// lint - error checking

gulp.task('styles:lint', function() {
  gulp.src(path.join(config.paths.src, '/components/**/*.scss'))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
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
    .pipe(gulp.dest(path.join(config.paths.dev, 'css')));
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
    .pipe(gulp.dest(path.join(config.paths.dev, 'css')));
});

// copy images over

gulp.task('images:build', function() {

  return gulp.src([path.join(config.paths.src, 'images/**/*'), '!' + path.join(config.paths.src, 'images/**/*.psd')])
    .pipe($.imagemin())
    .pipe(gulp.dest(path.join(config.paths.dev, 'images')));
});

// build minified css from css

function minify() {

  return gulp.src([path.join(config.paths.dev, '/**/*.css'), '!' + path.join(config.paths.dev, '/**/*.min.css')])
    .pipe($.debug())
    .pipe($.sourcemaps.init())
    .pipe($.cleanCss({}))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.sourcemaps.write('maps'))
    .pipe(path.join(gulp.dest(config.paths.dev), 'css'));
};

gulp.task('styles:minify', function() {

  return minify();

});

gulp.task('styles:build', ['styles:lint', 'styles:css']);
