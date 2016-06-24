'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var src = [
    path.join(conf.paths.css.src, '../bower_components/bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss'),
    path.join(conf.paths.css.src, 'styles/common/**/*.scss'),
    path.join(conf.paths.css.src, 'components/**/*.scss')
];

var libs = [ path.join(conf.paths.css.src, '/styles/libs.scss') ];

// lint - error checking

gulp.task('styles:lint', function() {
    gulp.src(path.join(conf.paths.css.src, '/components/**/*.scss'))
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
        .pipe($.concat('styles.scss'))
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(gulp.dest(conf.paths.css.dest));
});

// build library
// doesn't change often, so not in watch. just gulp build

gulp.task('libs:css', function() {

    return gulp.src(libs)
        // .pipe($.debug())
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(gulp.dest(conf.paths.css.dest));
});

// copies bootstrap fonts
// gulp build

gulp.task('libs:fonts', function() {

    return gulp.src(path.join(conf.paths.css.libs, 'bootstrap-sass/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,woff2}'))
        .pipe(gulp.dest(path.join(conf.paths.css.fonts, 'bootstrap')));

});

// build minified css from css

function minify() {

    return gulp.src([path.join(conf.paths.css.dest, '/**/*.css'), '!' + path.join(conf.paths.css.dest, '/**/*.min.css')])
        .pipe($.debug())
        .pipe($.sourcemaps.init())
        .pipe($.cleanCss({}))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(conf.paths.css.dest));
};

gulp.task('styles:minify', function() {

    return minify();

});

// wait for css to build before minifying
gulp.task('styles:build', ['styles:css'], function(){
    return minify();
});
