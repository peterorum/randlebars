# randlebars
Basic handlebars setup with mocha, chai, es6/babel, gulp, sass, eslint, jscs, sass-lint, bower, browser-sync.

Basic structure for a front-end project using gulp, handlebars, jquery, es6 & mocha/chai for tests.
Karma is used as the browser test runner, with mocha as the framework

Handlebars templates & partials are compiled as part of the build.

## Installation
1. Clone the project.
2. In the project folder, run `npm install` and `bower install`.
3. Run `gulp build` to create the project output files (transpiling sass, es6, handlebars)
6. Run `gulp watch` to monitor for changes.
6. Run `gulp watch:test` to run tests on file changes.
5. The watch task starts browsersync on localhost:3000.
6. The dev build tasks write their output to a new .tmp folder within the project.
4. To create the minified distributable code in the `dist` folder, run `gulp build`.
6. Also run `gulp build` whenever you change the library components or images, as they are not updated by the regular `watch` task.


