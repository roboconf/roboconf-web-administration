(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationTemplateController', singleApplicationTemplateController);

  singleApplicationTemplateController.$inject = ['Restangular', '$scope', '$routeParams', 'rAppTemplates', '$window'];
  function singleApplicationTemplateController(Restangular, $scope, $routeParams, rAppTemplates, $window) {

    // Fields
    $scope.invoked = false;
    $scope.error = false;
    $scope.askToDelete = false;
    $scope.showRestError = false;

    $scope.deleteApplicationTemplate = deleteApplicationTemplate;
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

    function deleteApplicationTemplate() {
      Restangular.one('applications/templates/' + $routeParams.tplName + '/' + $routeParams.tplQualifier)
      .remove().then(function() {
        $window.location = '#/application-templates';
      }, function() {
        $scope.showRestError = true;
      }).finally (function() {
        $scope.askToDelete = false;
      });
    }
  }
})();
