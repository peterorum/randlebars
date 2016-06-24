'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var ngHtml2Js = require("gulp-ng-html2js");

var $ = require('gulp-load-plugins')();

var src = [
    path.join(conf.paths.js.src, '/**/*.js'),
    '!' + path.join(conf.paths.js.src, '/**/*.spec.js'),
    '!' + path.join(conf.paths.js.src, '/style-guide/**/*.js')
];

var templates = [
    path.join(conf.paths.js.src, '/**/*.template.html')
];

// must already be minified
// after change, run gulp build

var libs = [
    path.join(conf.paths.js.libs, 'angular/angular.min.js'),
    path.join(conf.paths.js.libs, 'lodash/dist/lodash.min.js'),
    path.join(conf.paths.js.libs, 'lodash/dist/lodash.fp.min.js')
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

// convert all angular html templates to js

gulp.task('scripts:templates', function() {

    return gulp.src(templates)
        .pipe($.debug({
            title: 'templates:'
        }))
        .pipe(ngHtml2Js({
            moduleName: "mochular.main",
            prefix: ""
        }))
        .pipe($.concat('templates.js'))
        .pipe(gulp.dest(conf.paths.js.dest));
});

// join all js, converting form es6

gulp.task('scripts:js', function() {

    return gulp.src(src.concat('!' + path.join(conf.paths.js.src, '/**/*.spec.js')))
        .pipe($.concat('scripts.js'))
        .pipe(gulp.dest(conf.paths.js.dest));
});

// join all specific library js (must already be minimized)
// doesn't change often, so not in watch. just gulp build

gulp.task('libs:js', function() {

    return gulp.src(libs)
        .pipe($.concat('libs.min.js'))
        .pipe(gulp.dest(conf.paths.js.dest));
});

// build minified js

function minify() {

    return gulp.src([ path.join(conf.paths.js.dest, '/**/*.js'), '!' + path.join(conf.paths.js.dest, '/**/*.min.js') ])
        .pipe($.concat('scripts.js'))
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: [ 'es2015' ]
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

gulp.task('scripts:lint', [ 'scripts:lint:eslint', 'scripts:lint:jscs' ]);

// only run manually, not with watch
gulp.task('scripts:fix', [ 'scripts:lint:jscs:fix' ]);

// wait for js to build before minifying
gulp.task('scripts:build', [ 'scripts:js', 'scripts:templates' ], function() {
    return minify();
});
