(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationTemplateController', singleApplicationTemplateController);

  singleApplicationTemplateController.$inject = ['rClient', '$scope', '$routeParams', '$window', 'rUtils'];
  function singleApplicationTemplateController(rClient, $scope, $routeParams, $window, rUtils) {

    // Fields
    $scope.responseStatus = -1;
    $scope.deleteApplicationTemplate = deleteApplicationTemplate;
    $scope.findIconStyle = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;

    // Initial actions
    findApplicationTemplate($routeParams.tplName, $routeParams.tplVersion);

    // Function definitions
    function findApplicationTemplate(appName, appVersion) {

      rClient.listApplicationTemplates().then(function(templates) {
        $scope.responseStatus = 0;
        $scope.app = templates.filter(function(val, index, arr) {
          return val.name === appName && val.version === appVersion;
        }).pop();

        if (!$scope.app) {
          $scope.responseStatus = 404;
          $scope.app = {
            name: $routeParams.tplName,
            version: $routeParams.tplVersion
          };
        }

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function deleteApplicationTemplate() {
      rClient.deleteApplicationTemplate($routeParams.tplName, $routeParams.tplVersion).then(function() {
        $window.location = '#/application-templates';
      });
    }
  }
})();
