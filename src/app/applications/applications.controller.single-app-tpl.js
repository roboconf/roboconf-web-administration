(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationTemplateController', singleApplicationTemplateController);

  singleApplicationTemplateController.$inject = ['$scope', '$routeParams', 'rAppTemplates'];
  function singleApplicationTemplateController($scope, $routeParams, rAppTemplates) {

    // Fields
    $scope.invoked = false;
    $scope.error = false;
    $scope.app = findApplicationTemplate($routeParams.tplName, $routeParams.tplQualifier);

    // Function definitions
    function findApplicationTemplate(appName, appQualifier) {

      rAppTemplates.refreshTemplates().then(function() {
        $scope.invoked = true;
        $scope.error = rAppTemplates.gotErrors();
        $scope.app = rAppTemplates.getTemplates().filter(function(val, index, arr) {
          return val.name === appName && val.qualifier === appQualifier;
        }).pop();
      });
    }
  }
})();
