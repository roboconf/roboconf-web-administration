(function() {
  'use strict';

  angular
  .module('roboconf.commands')
  .directive('rbcfCommandsHistory', rbcfCommandsHistory);

  function rbcfCommandsHistory() {
    return {
      restrict: 'E',
      templateUrl: 'templates/commands/html/_commands_history_directive.html',
      controller: rbcfCommandsHistoryDirectiveController
    };
  }

  rbcfCommandsHistoryDirectiveController.$inject =
    ['$scope', '$route', 'rClient', 'rUtils', '$routeParams', '$translate'];
  function rbcfCommandsHistoryDirectiveController($scope, $route, rClient, rUtils, $routeParams, $translate) {

    // Fields
    var itemsPerPage = 25;

    $scope.showAppColumn = $route.current.showAppName;
    $scope.responseStatus = -1;
    $scope.sortingCriteria = 'start';
    $scope.sortingOrder = 'desc';
    $scope.pageCount = 0;
    $scope.items = [];
    $scope.datePattern = '';

    $scope.pageNumber = 1;
    var pageNumber = parseInt($routeParams.pageNumber);
    if (!! pageNumber && pageNumber > 0) {
      $scope.pageNumber = pageNumber;
    }

    // Function declarations
    $scope.setCriteria = setCriteria;

    // Initial actions: find the history for the given application (if any)
    if ($routeParams.appName) {
      rClient.findApplication($routeParams.appName).then(function(app) {
        $scope.app = app;
        if (app.fake) {
          $scope.responseStatus = 404;
        } else {
          loadCommandsHistory($scope.sortingCriteria, $scope.sortingOrder);
        }
      });
    }

    // Otherwise, get the history directly
    else {
      loadCommandsHistory($scope.sortingCriteria, $scope.sortingOrder);
    }

    // Get the page count too
    rClient.getCommandsHistoryPageCount(itemsPerPage, $routeParams.appName).then(function(count) {
      $scope.pageCount = count;
    });

    // And find the date pattern
    $translate('COMMON_DATE_PATTERN').then(function(translatedValue) {
      $scope.datePattern = translatedValue;
    });


    // Functions
    function setCriteria(sortingCriteria) {
      if (sortingCriteria !== $scope.sortingCriteria) {
        loadCommandsHistory(sortingCriteria, $scope.sortingOrder);
      } else {
        var sortingOrder = $scope.sortingOrder === 'asc' ? 'desc' : 'asc';
        loadCommandsHistory($scope.sortingCriteria, sortingOrder);
      }
    }

    function loadCommandsHistory(sortingCriteria, sortingOrder) {

      rClient.loadCommandsHistory(
          $scope.pageNumber,
          itemsPerPage,
          sortingCriteria,
          sortingOrder,
          $routeParams.appName).then(function(items) {

        $scope.responseStatus = 0;
        $scope.sortingCriteria = sortingCriteria;
        $scope.sortingOrder = sortingOrder;
        $scope.items = items;

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }
  }
})();
