'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

// watch js source
gulp.task('watch:js', function () {
    $.watch([path.join(conf.paths.js.src, '/**/*.js')], $.batch(function (events, done) {
        gulp.start(['scripts:lint', 'scripts:build'], done);
    }));
});

gulp.task('watch:handlebars', function () {
    $.watch([path.join(conf.paths.js.src, '../index.hbs'), path.join(conf.paths.js.src, '/**/*.hbs')], $.batch(function (events, done) {
        gulp.start(['scripts:watch:handlebars'], done);
    }));
});

gulp.task('watch:css', function () {
    $.watch(path.join(conf.paths.css.src, '/**/*.scss'), $.batch(function (events, done) {
        gulp.start(['styles:lint', 'styles:build'], done);
    }));
});

gulp.task('watch', ['watch:js', 'watch:handlebars', 'watch:css']);
