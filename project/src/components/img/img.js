(function($) {

  // keep image centered while filling its containing div

  $( function() {

    $( window ).on( 'resize', resize );

    $( '.ma-img-centered' ).on( 'load', resize );

    setTimeout( resize, 0 );

    function resize() {
      $( '.ma-img-centered' ).each( function() {

        // make image large enogh to cover its container,
        // keeping its aspect ratio
        // and keepong its cenre visible.
        // container needs overflow hidden

        let $img = $( this );
        let $container = $img.parent();

        let w1 = $img.width();
        let h1 = $img.height();

        let w2 = $container.width();
        let h2 = $container.height();

        if (h1 && w1) {
          let imgAspect = h1 / w1;

          let w3 = w2;
          let h3 = w3 * imgAspect;

          if (h3 < h2) {
            h3 = h2;
            w3 = h3 / imgAspect;
          }

          $img.css( {
            'width': w3,
            'height': h3,
            'margin-top': -(h3 - h2) / 2,
            'margin-left': -(w3 - w2) / 2
          } );
        }

      } );
    }
  } );

}) (jQuery );
