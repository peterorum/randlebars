// Configuration common to multiple tasks

'use strict';

var $ = require('gulp-load-plugins')({
  lazy: true
});

exports.paths = {
  css: {
    // src
    src: 'src',
    libs: 'bower_components',
    // dests
    dest: 'dist/css',
    fonts: 'dist/fonts',
    pages: 'dist/pages',
    images: 'dist/images'
  },
  js: {
    src: 'src',
    dest: 'dist/js',
    libs: 'bower_components'
  }
};

/**
 *  Common implementation for an error handler of a gulp plugin
 */
exports.errorHandler = function(title) {

  return function(err) {
    $.util.log($.util.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
