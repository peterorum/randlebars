(function() {

  // set up handlebars config with require.js

  let helpers = [];

  let partials = [
    "header",
    "footer",
    "main"
  ];

  let deps = [];

  // js
  for (let i in helpers) {
    deps.push(`dist/js/helpers/${helpers[i]}`);
  }

  // plain text, using text plugin
  for (let i in partials) {
    deps.push(`text!partials/${partials[i]}.partial`);
  }

  require.config({
    shim: {
      "handlebars": {
        "exports": "Handlebars",
        "deps": deps
      }
    },
    config: {
      "H": {
        "helpers": helpers,
        "partials": partials
      }
    }
  });

  require(['H', 'text!templates/home.template'], function(H, src) {

    $(document).ready(function() {

      let template = H.compile(src);
      let context = {};

      $('#content').html(template(context));

      // init word
      $('#word-get').trigger('click');
    });

  });

})();
