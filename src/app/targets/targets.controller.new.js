(function() {
  'use strict';

  angular
  .module('roboconf.targets')
  .controller('TargetsNewController', targetsNewController);

  targetsNewController.$inject = ['$scope', 'rClient', '$http', '$window'];
  function targetsNewController($scope, rClient, $http, $window) {

    // Fields
    $scope.responseStatus = 0;
    $scope.tpl = '';
    $scope.mode = 'upload';

    // Function declarations
    $scope.selectTpl = selectTpl;
    $scope.setMode = setMode;
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

    function setMode(mode) {
      $scope.mode = mode;
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
      if (! $scope.editor) {
        $scope.editor = CodeMirror.fromTextArea(txtArea, {
          mode: 'properties',
          lineNumbers: true,
          lineWrapping: true
        });
      }

      $scope.editor.setValue(content);
      $scope.mode = 'editor';

      setTimeout(function() {
        $scope.editor.refresh();
      }, 1);
    }
  }
})();
