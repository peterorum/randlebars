(function($) {

  $(document).ready(function() {

    renderPage();

  });

  function renderPage() {

    let word = window.RandlebarsApp.getWord();

    var html = Handlebars.templates.home({
      word: word
    });

    $('#content').html(html);

    // use .one so it's removed on click, as it is recreated

    $(document).one('click', '#word-get', function() {

      let that = this;

      let el = $('#word');
      el.fadeOut();
      $(that).animateCss('bounce');

      el.promise().done(function() {
        renderPage();
      });

    });

  }

})(jQuery);
