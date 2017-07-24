(function() {
  'use strict';

  angular
  .module('roboconf.commands')
  .controller('CommandsHistoryController', commandsHistoryController);

  commandsHistoryController.$inject = ['$scope'];
  function commandsHistoryController($scope) {

    /*
     * We could have put these functions in the directive's
     * controller, but that would have made unit tests more complex.
     */

    // Function declarations
    $scope.findClass = findClass;
    $scope.findPageLink = findPageLink;


    // Functions
    function findPageLink(jump) {

      var page = $scope.pageNumber * 1 + jump;
      var link = '#/';
      link += !! $scope.app ? 'app/' + $scope.app.name + '/commands/history' : 'history/commands';
      link += '/' + page;
      return link;
    }

    function findClass(sortingCriteria) {
      var res = sortingCriteria === $scope.sortingCriteria ? 'sortable-selected' : 'sortable';
      res += $scope.sortingOrder === 'asc' ? '-up' : '';
      return res;
    }
  }
})();
