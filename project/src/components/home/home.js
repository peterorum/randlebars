(function($) {

  $(document).ready(function() {

    renderPage();

  });

  function renderPage() {

    // render whole page with initial data

    let word = window.RandlebarsApp.getWord();

    var html = Handlebars.templates.home({
      word: word
    });

    $('#content')
      .empty()
      .html(html);

    $('#word').fadeIn();
  }
})(jQuery);
