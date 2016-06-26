(function() {

  let helpers = [];

  let partials = [
    "header",
    "footer"
  ];

  let deps = [];

  // js
  for (let i in helpers) {
    deps.push(`helpers/${helpers[i]}`);
  }

  // plain text, using text plugin
  for (let i in partials) {
    deps.push(`text!partials/${partials[i].partial}`);
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


  require(['H', 'text!templates/home.template'], function(H, src){
    let template =H.compile(src);
    let context = {};

    document.body.innerHTML += template(context);

  });

})();
