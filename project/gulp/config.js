// Configuration common to multiple tasks

'use strict';

var $ = require('gulp-load-plugins')({
  lazy: true
});

var path = require('path');
var _ = require('lodash');

exports.paths = {
  src: 'src/',
  dev: '.tmp/',
  prod: 'dist/',
  root: './',
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

exports.jsSrc = function() {
  return [
    path.join(exports.paths.src, '/app/**/*.js'),
    path.join(exports.paths.src, '/components/**/*.js')
  ];
};

// karma

exports.karma = {
  files: [
  // libs
  exports.paths.dev + 'js/libs.js',
  // handlebars
  exports.paths.dev + 'js/templates.js',
  exports.paths.dev + 'js/partials.js',
  // src
  exports.paths.src + 'app/**/*.js',
  exports.paths.src + 'app/**/*.spec.js',
  exports.paths.src + 'components/**/*.js',
  exports.paths.src + 'components/**/*.spec.js'
  ],
  serverIntegrationSpecs: [],
  exclude: [],
  preprocessors: {
      'src/**/*.js': ['babel']
    }
}

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

// templates & partials
exports.injectHandlebars = _.clone(exports.inject);
exports.injectHandlebars.starttag = '<!-- inject:handlebars -->';

exports.injectJsLocal = _.clone(exports.inject);
exports.injectJsLocal.addPrefix = '..';


/**
 *  Common implementation for an error handler of a gulp plugin
 */
exports.errorHandler = function(title) {

  return function(err) {
    $.util.log($.util.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
