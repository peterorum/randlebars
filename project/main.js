(function() {

  require.config({
    shim: {
      "handlebars": {
        "exports": "Handlebars",
      }
    },
  });

  require(['views/home', 'views/partials'], function(home) {

    $(document).ready(function() {

      let html = home({}, {helpers: {}});

      $('#content').html(html);

      // init word
      $('#word-get').trigger('click');
    });

  });

})();
