// Configuration common to multiple tasks

'use strict';

var $ = require('gulp-load-plugins')({
  lazy: true
});

var _ = require('lodash');

exports.paths = {
  src: 'src/',
  dev: '.tmp/',
  prod: 'dist/',
  libs: 'bower_components/',

  css: {
    // src
    src: 'src/',
    libs: 'bower_components/',
    // dests
    dest: 'dist/css/',
    fonts: 'dist/fonts/',
    pages: 'dist/pages/',
    images: 'dist/images'
  },
  js: {
    src: 'src/',
    dest: 'dist/js/',
    libs: 'bower_components/'
  }
};

// options

exports.htmlmin = {
  collapseWhitespace: true,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  quoteCharacter: "'",
  removeComments: true
};

exports.inject = {
  ignorePath: '.tmp/',
  addRootSlash: false,
};

exports.injectCssLib = _.clone(exports.inject);
exports.injectCssLib.starttag = '<!-- inject:csslibs -->';

exports.injectJsLib = _.clone(exports.inject);
exports.injectJsLib.starttag = '<!-- inject:jslibs -->';

/**
 *  Common implementation for an error handler of a gulp plugin
 */
exports.errorHandler = function(title) {

  return function(err) {
    $.util.log($.util.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
