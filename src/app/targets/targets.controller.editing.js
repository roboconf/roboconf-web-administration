(function() {
  'use strict';

  angular
  .module('roboconf.targets')
  .controller('TargetEditingController', targetEditingController);

  targetEditingController.$inject = ['$scope', 'rClient', '$routeParams'];
  function targetEditingController($scope, rClient, $routeParams) {

    // Fields
    $scope.responseStatus = -1;

    $scope.targetId = $routeParams.targetId;
    $scope.targetProperties = '';
    $scope.targetPropertiesBackup = '';

    $scope.referencing = [];
    $scope.using = [];
    $scope.editable = false;

    // Functions declaration
    $scope.setEditable = setEditable;
    $scope.save = save;

    // Functions
    rClient.findTarget($scope.targetId).then(function(bean) {
      $scope.target = bean;
      $scope.responseStatus = 0;

      var txtArea = $('#target-properties').get(0);
      $scope.editor = CodeMirror.fromTextArea(txtArea, {
        mode: 'properties',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true
      });

      setTimeout(function() {
        $scope.editor.refresh();
      }, 1);

      findTargetProperties();

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    // Functions
    function setEditable(editable) {

      $scope.editable = editable;
      $scope.editor.setOption('readOnly', ! editable);

      if (! editable) {
        $scope.targetProperties = $scope.targetPropertiesBackup;
        $scope.editor.setValue($scope.targetPropertiesBackup);
      }
    }

    function findTargetProperties() {

      rClient.findTargetProperties($scope.targetId).then(function(props) {
        $scope.targetPropertiesBackup = props.s;
        $scope.targetProperties = props.s;
        if ($scope.editor) {
          $scope.editor.setValue(props.s);
        }
      });
    }

    function save() {
      rClient.updateTarget($scope.targetId, $scope.editor.getValue()).then(function() {
        $scope.targetPropertiesBackup = $scope.editor.getValue();
        setEditable(false);

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }
  }
})();
