(function() {
  "use strict";

  describe( "simple test", function() {

    // checks hooking up karma without the app

    beforeEach( function() {} );

    it( "will pass", function() {
      let x = 2;

      expect( x ).to.equal( 2 );
    } );
  } );

  describe( "word test", function() {

    beforeEach( function() {} );

    it( "gets word", function() {

      let word = window.RandlebarsApp.getWord();

      expect( word.length ).to.be.gt(0);
    } );

  } );

})();

