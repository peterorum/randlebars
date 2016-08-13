(function($) {

  $(document).ready(function() {

    renderPage();

  });

  function renderPage() {

    // render whole page with initial data

    // todo - move data to individual pages

    let page = $('#content').data('page');

    if (page) {
      let word = window.RandlebarsApp.getWord();

      var html = window.randlebars.templates[page]({
        word: word
      });

      $('#content')
        .empty()
        .html(html);

      $('#word').fadeIn();
    }
  }

})(jQuery);
