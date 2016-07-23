(function($) {

  $(document).ready(function() {

    $(document).on('click', '#word-get', function() {

      let that = this;

      // hide existing word & bounce button
      let el = $('#word');
      el.fadeOut();
      $(that).animateCss('bounce');

      // when word hidden, set new one & fade in
      el.promise().done(function() {
        renderWord();

        // new #word element, not el, as it's replaced
        $('#word').fadeIn();
      });

    });

  });

  function renderWord() {

    // get word & use partial to render
    let word = window.RandlebarsApp.getWord();

    var html = Handlebars.partials.word({
      word: word
    });

    $('#word').replaceWith(html);

  }

})(jQuery);
