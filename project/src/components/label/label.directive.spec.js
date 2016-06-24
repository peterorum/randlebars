(function() {
  "use strict";

  describe( "simple test", function() {

    beforeEach( function() {} );

    it( "will pass", function() {
      let x = 2;

      expect( x ).to.equal( 2 );
    } );
  } );

  describe( "directive label", function() {
    let $compile, $scope;

    beforeEach( function() {
      angular.mock.module( "mochular.main" );
    } );

    beforeEach( inject( function(_$compile_, $rootScope) {
      $compile = _$compile_;
      $scope = $rootScope.$new();
    } ) );

    function getMarkup() {
      return '<ma-label text="hello test"></ma-label>';
    }

    it( "has a label", function() {

      let element = angular.element( getMarkup() );
      element = $compile( element )( $scope );
      $scope.$digest();

      // console.log(element[0].outerHTML);

      expect( element.hasClass( "ma-label" ) ).to.be.ok;
    } );
  } );

})();

