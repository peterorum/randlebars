(function($) {

  $(document).ready(function() {

    renderPage();

  });

  function renderPage() {

    // render whole page with initial data

    let page = $('#content').data('page');

    let word = window.RandlebarsApp.getWord();

    var html = window.randlebars.templates[page]({
      word: word
    });

    $('#content')
      .empty()
      .html(html);

    $('#word').fadeIn();
  }
})(jQuery);
