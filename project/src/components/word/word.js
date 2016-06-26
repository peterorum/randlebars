(function($, window) {

  $(document).ready(function() {

    $(document).on('click', '#word-get', function() {
      let that = this;

      let el = $('#word');

      el.fadeOut();
      $(that).animateCss('bounce');

      el.promise().done(function() {
        el.text(window.RandlebarsApp.getWord());
        el.fadeIn();

      });

    });
  });

})(jQuery, window);
