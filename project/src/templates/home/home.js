(function($, window, document) {

  $(document).ready(function() {

    var html = Handlebars.templates.home();

    $('#content').html(html);

    // init word

    setTimeout(function() {
      $('#word-get').trigger('click');
    }, 0);
  });

})(jQuery, window, document);
