(function() {
  angular
    .module( "mochular.main" )
    .directive( "maLabel", [ labelFactory ] );

  function labelFactory() {
    let directive = {
      templateUrl: "components/label/label.template.html",
      restrict: "E",
      transclude: true,
      scope: {
        text: "@"
      },
      replace: true,
      link: link,
      controllerAs: 'vm',
      bindToController: true,
      controller: controller
    };

    function link( /*scope*/ ) {
      // scope.vm...
    }

    function controller() {

      // let vm = this;

    }

    return directive;
  }

})();


