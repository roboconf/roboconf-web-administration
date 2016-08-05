(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationTemplateController', singleApplicationTemplateController);

  singleApplicationTemplateController.$inject = ['rClient', '$scope', '$routeParams', '$window', 'rUtils'];
  function singleApplicationTemplateController(rClient, $scope, $routeParams, $window, rUtils) {

    // Fields
    $scope.responseStatus = -1;
    $scope.appTplData = {
        name : '<strong>' + $routeParams.appName + '</strong>',
        qualifier : '<strong>' + $routeParams.tplQualifier + '</strong>'    		
    };

    $scope.deleteApplicationTemplate = deleteApplicationTemplate;
    $scope.findIconStyle = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;

    // Initial actions
    findApplicationTemplate($routeParams.tplName, $routeParams.tplQualifier);

    // Function definitions
    function findApplicationTemplate(appName, appQualifier) {

      rClient.listApplicationTemplates().then(function(templates) {
        $scope.responseStatus = 0;
        $scope.app = templates.filter(function(val, index, arr) {
          return val.name === appName && val.qualifier === appQualifier;
        }).pop();

        if (!$scope.app) {
          $scope.responseStatus = 404;
          $scope.app = {
            name: $routeParams.tplName,
            qualifier: $routeParams.tplQualifier
          };
        }

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function deleteApplicationTemplate() {
      rClient.deleteApplicationTemplate($routeParams.tplName, $routeParams.tplQualifier).then(function() {
        $window.location = '#/application-templates';
      });
    }
  }
})();
