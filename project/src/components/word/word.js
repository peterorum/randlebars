(function($, window) {

  $(document).ready(function() {

    let el = $('#word');

    window.RandlebarsApp.setWord(el);
    el.fadeIn();

    $('#word-get').on('click', function() {

      el.fadeOut();

      el.promise().done(function() {
        window.RandlebarsApp.setWord(el);
        el.fadeIn();
      });

    });
  });

})(jQuery, window);
