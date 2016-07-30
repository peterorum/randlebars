# randlebars
Basic handlebars setup with mocha, chai, es6/babel, gulp, sass, eslint, jscs, sass-lint, bower, browser-sync.

Basic structure for a front-end project using gulp, handlebars, jquery, es6 & mocha/chai for tests.
Karma is used as the browser test runner, with mocha as the framework

Handlebars templates & partials are compiled as part of the build.

## Installation
1. Clone the project.
2. In the project folder, run `npm install` and `bower install`.
3. Install browserSync `npm install -g browser-sync`
4. In the project folder, run `gulp build` to create the minifed css & js in the dist folder.
5. Run `npm run serve` to view the test page & use browserSync on localhost:3000.
6. `gulp watch` can be run to monitor changes.
6. Run `gulp build` whenever you change the library componets. Or the script `./rebuild`.
7. Run `npm test` for a one-off test run, or `npm run test:watch` to monitor (no tests are currently implemented).


