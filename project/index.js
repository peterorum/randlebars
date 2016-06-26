(function() {

  // keep as es5

  require.config({
    shim: {
      "handlebars": {
        "exports": "Handlebars",
      }
    },
  });

  require(['../views/templates', '../views/partials'], function(home) {

    $(document).ready(function() {

      var html = home({}, {helpers: {}});

      $('#content').html(html);

      // init word
      $('#word-get').trigger('click');
    });

  });

})();
