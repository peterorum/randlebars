(function($, window) {

  $(document).ready(function() {

    window.RandlebarsApp.setWord();

    $('#word-get').on('click', function() {
      window.RandlebarsApp.setWord();
      $(this).blur();
    });
  });

})(jQuery, window);
