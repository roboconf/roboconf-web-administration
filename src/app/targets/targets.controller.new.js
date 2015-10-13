(function() {
  'use strict';

  angular
  .module('roboconf.targets')
  .controller('TargetsNewController', targetsNewController);

  targetsNewController.$inject = ['$scope', 'rClient', '$http', '$window'];
  function targetsNewController($scope, rClient, $http, $window) {

    // Fields
    $scope.responseStatus = 0;
    $scope.showEditor = false;
    $scope.tpl = '';

    // Function declarations
    $scope.selectTpl = selectTpl;
    $scope.save = save;

    // Functions
    function selectTpl() {

      if ($scope.tpl === 'Blank') {
        showEditor('');

      } else {
        var tpl = $scope.tpl.toLowerCase().replace(/ /g, '-') + '.properties';
        $http({ method: 'GET', url: 'misc/targets/tpl/' + tpl }).then(function(response) {
          showEditor(response.data);
        });
      }
    }

    function save() {
      rClient.newTarget($scope.editor.getValue()).then(function(id) {
        $window.location = '#/target/' + id + '/properties';

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function showEditor(content) {

      var txtArea = $('#target-properties').get(0);
      $scope.editor = CodeMirror.fromTextArea(txtArea, {
        mode: 'properties',
        lineNumbers: true,
        lineWrapping: true
      });

      $scope.editor.setValue(content);
      $scope.showEditor = true;

      setTimeout(function() {
        $scope.editor.refresh();
      }, 1);
    }
  }
})();
