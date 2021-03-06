'use strict';

var gulp = require('gulp');
var config = require('./config');
var runSequence = require('run-sequence');
var del = require('del');
var path = require('path');

var $ = require('gulp-load-plugins')({
  lazy: true
});

gulp.task('clean:dist', function() {
  return del(config.paths.dist);
});

gulp.task('build:optimize:scripts', function() {

    var jsFilter = $.filter(config.paths.dev + '**/*.js', { restore: true });
    var cssFilter = $.filter(config.paths.dev + '**/*.css', { restore: true });

    var customScripts = /.*scripts-.*\.js$/;

  return gulp
    .src(path.join(config.paths.dev, 'index.html'))
    .pipe($.plumber())
    .pipe($.useref({searchPath: [config.paths.dev, config.paths.src, config.paths.libs] }))
    // js
    .pipe(jsFilter)
    .pipe($.rev())
    .pipe($.sourcemaps.init())
    // only transpile or minify custom js
    .pipe($.if(customScripts, $.babel({
      presets: ['es2015']
    })))
    .pipe($.if(customScripts, $.uglify()))
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    // css
    .pipe(cssFilter)
    .pipe($.rev())
    .pipe($.cleanCss())
    .pipe(cssFilter.restore)
    // write
    .pipe(gulp.dest(config.paths.dist));
});

gulp.task('build:optimize:html', function() {

  return gulp
    .src(path.join(config.paths.dev, '*.html'))
    .pipe($.plumber())
    .pipe($.useref({searchPath: [config.paths.dev, config.paths.src, config.paths.libs] }))
    .pipe($.debug())
    .pipe($.if(/.*[js|css]$/, $.rev()))
    .pipe($.if('*.html', $.htmlmin(config.htmlmin)))
    .pipe($.revReplace())
    .pipe($.if(/.*\.html$/, gulp.dest(config.paths.dist)))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.paths.dist));
});

gulp.task('build:assets', function() {

  return gulp
    .src([path.join(config.paths.dev, 'images/*.*')])
    .pipe(gulp.dest(path.join(config.paths.dist, 'images')));
});

gulp.task('build:dev', function(done) {
  return runSequence('clean:dev',
    ['styles:build', 'images:build', 'libs:css', 'libs:js'],
    'scripts:build',
    done);
});

gulp.task('build:dist', function() {

  return runSequence('clean:dist',
    'build:dev',
    ['build:optimize:html', 'build:optimize:scripts', 'build:assets']);
});

// bump minor version on each build
gulp.task('bump', function() {

  return gulp
    .src([path.join(config.paths.root, 'package.json')])
    .pipe($.bump())
    .pipe(gulp.dest(config.paths.root));
});

gulp.task('build', ['build:dist', 'bump']);
