// Configuration common to multiple tasks

'use strict';

var gutil = require('gulp-util');

exports.paths = {
    css: {
        src: 'src',
        dest: 'dist/css',
        fonts: 'dist/fonts',
        libs: 'bower_components'
    },
    js: {
        src: 'src',
        dest: 'dist/js',
        libs: 'bower_components'
    }
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {

    return function(err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};
