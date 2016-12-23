(function() {
  'use strict';

  angular
  .module('roboconf.web-extensions')
  .controller('WebExtensionsListingController', webExtensionsListingController);

  webExtensionsListingController.$inject = ['$scope', '$routeParams', '$http', '$sce', 'rClient', 'rPrefs'];
  function webExtensionsListingController($scope, $routeParams, $http, $sce, rClient, rPrefs) {

    // Fields
    $scope.extensions = [];
    $scope.name = $routeParams.ext;
    $scope.selectedExtension = null;
    $scope.embeddedContent = '';

    // Initial actions
    rClient.getPreferences('web.extensions').then(function(prefs) {

      $scope.responseStatus = 0;
      if (prefs.length > 0 && !! prefs[0].value) {
        prefs[0].value.split(',').forEach(function(ext) {

          var lastSegment = ext.trim().replace(/.*\/([^/]+)/, '$1');
          var obj = {
            name: lastSegment.charAt(0).toUpperCase() + lastSegment.substring(1),
            url: ext.trim()
          };

          $scope.extensions.push(obj);
          if ($routeParams.ext && $routeParams.ext.toLowerCase() === obj.name.toLowerCase()) {
            $scope.selectedExtension = obj;
            getEmbeddedContent(obj);
          }
        });
      }

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    // Functions
    function getEmbeddedContent(ext) {

      var urlSegments = rPrefs.getUrl().split('/');
      var fullUrl = urlSegments[0] + '//' + urlSegments[2] + ext.url;
      $http.get(fullUrl).then(function(response) {
        $scope.embeddedContent = $sce.trustAsHtml(response.data);
      });
    }
  }
})();
