(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationTemplateController', singleApplicationTemplateController);

  singleApplicationTemplateController.$inject = ['rClient', '$scope', '$routeParams', '$window', 'rUtils'];
  function singleApplicationTemplateController(rClient, $scope, $routeParams, $window, rUtils) {

    // Fields
    $scope.invoked = false;
    $scope.error = false;
    $scope.showRestError = false;
    $scope.showApps = true;
    $scope.found = true;

    $scope.deleteApplicationTemplate = deleteApplicationTemplate;
    $scope.findAvatar = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;

    // Initial actions
    findApplicationTemplate($routeParams.tplName, $routeParams.tplQualifier);

    // Function definitions
    function findApplicationTemplate(appName, appQualifier) {

      rClient.listApplicationTemplates().then(function(templates) {
        $scope.error = false;
        $scope.app = templates.filter(function(val, index, arr) {
          return val.name === appName && val.qualifier === appQualifier;
        }).pop();

        if (!$scope.app) {
          $scope.found = false;
          $scope.app = {
            name: $routeParams.tplName,
            qualifier: $routeParams.tplQualifier
          };
        }

      }, function() {
        $scope.error = true;

      }).finally(function() {
        $scope.invoked = true;
      });
    }

    function deleteApplicationTemplate() {
      rClient.deleteApplicationTemplate($routeParams.tplName, $routeParams.tplQualifier).then(function() {
        $window.location = '#/application-templates';

      }, function() {
        $scope.showRestError = true;
      });
    }
  }
})();
