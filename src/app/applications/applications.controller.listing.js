(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('ApplicationsListingController', applicationsListingController);

  applicationsListingController.$inject = ['$scope', 'rUtils', '$route', 'rClient', 'rWebSocket'];
  function applicationsListingController($scope, rUtils, $route, rClient, rWebSocket) {

    // Fields
    $scope.isTpl = $route.current.tpl;
    $scope.invoked = false;
    $scope.error = false;
    $scope.apps = [];
    $scope.searchFilter = '';
    $scope.searchVisible = true;

    // For the APP and TPL directives
    $scope.showLinks = true;

    // Functions declaration
    $scope.findIconStyle = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;
    $scope.deleteApplication = deleteApplication;

    // Initial actions
    listApplications();

    // Manage the web socket
    var webSocket = rWebSocket.newWebSocket();
    webSocket.onmessage = onWebSocketMessage;
    $scope.$on('$routeChangeStart', function(event) {
      webSocket.close();
    });

    // Function definitions
    function listApplications() {

      var fct = $scope.isTpl ? rClient.listApplicationTemplates : rClient.listApplications;
      fct().then(function(applications) {
        $scope.apps = applications;
        $scope.error = false;

      }, function() {
        $scope.error = true;

      }).finally(function() {
        $scope.invoked = true;
      });
    }

    function deleteApplication(appOrTpl) {

      var promise = $scope.isTpl ?
        rClient.deleteApplicationTemplate(appOrTpl.name, appOrTpl.qualifier) :
        rClient.deleteApplication(appOrTpl.name);

      promise.then(function() {
        // nothing, the web socket will handle the update

      }, function() {
        console.log('Application ' + appOrTpl.name + ' could not be deleted.');
      });
    }

    function onWebSocketMessage(event) {

      if (event.data) {
        var obj = JSON.parse(event.data);
        var eventType = obj.event;

        if ($scope.isTpl && obj.tpl) {
          obj = obj.tpl;
        } else if (! $scope.isTp && obj.app) {
          obj = obj.app;
        } else {
          obj = null;
        }

        if (obj && ! obj.inst) {

          // Deletion
          if (eventType === 'DELETED') {
            var index = $scope.apps.findIndex(function(val) {
              return val.name === obj.name;
            });

            if (index >= 0) {
              $scope.apps.splice(index, 1);
            }
          }

          // Creation
          else if (eventType === 'CREATED') {
            $scope.apps.push(obj);
          }

          // When doing demos with several web browsers, the view is updated
          // only in the foreground browser. To force the refresh every time,
          // even in background, we must force the refreshment.
          $scope.$apply();
        }
      }
    }
  }
})();
