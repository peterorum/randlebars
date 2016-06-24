(function() {
  "use strict";

  describe( "directive chart", function() {
    let $compile, $scope;

    beforeEach( function() {
      angular.mock.module( "mochular.main" );
    } );

    beforeEach( inject( function(_$compile_, $rootScope) {
      $compile = _$compile_;
      $scope = $rootScope.$new();
    } ) );

    function getMarkup() {
      return '<ma-chart"></ma-chart>';
    }

    it( "has a chart", function() {

      let element = angular.element( getMarkup() );
      element = $compile( element )( $scope );
      $scope.$digest();

      // console.log(element[0].outerHTML);

      expect( element.hasClass( "ma-chart" ) ).to.be.ok;
    } );
  } );

})();

