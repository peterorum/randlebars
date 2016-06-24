'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('watch:js', function () {
    $.watch(path.join(conf.paths.js.src, '/**/*.js'), $.batch(function (events, done) {
        gulp.start(['scripts:lint', 'scripts:build'], done);
    }));
});

gulp.task('watch:css', function () {
    $.watch(path.join(conf.paths.css.src, '/**/*.scss'), $.batch(function (events, done) {
        gulp.start(['styles:lint', 'styles:build'], done);
    }));
});

gulp.task('watch', ['watch:js', 'watch:css']);
