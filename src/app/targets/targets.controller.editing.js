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
    $scope.targetAlias = $scope.targetId;
    $scope.targetProperties = '';
    $scope.targetPropertiesBackup = '';

    $scope.referencing = [];
    $scope.using = [];
    $scope.editable = false;

    // Functions declaration
    $scope.setEditable = setEditable;

    // Functions
    rClient.findTarget($scope.targetId).then(function(bean) {
      $scope.targetAlias = bean.name ? bean.name : 'no name';
      $scope.responseStatus = 0;
      
      var txtArea = $('#target-properties').get(0);
      $scope.editor = CodeMirror.fromTextArea(txtArea, {
        mode: 'properties',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true
      });

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    rClient.findTargetProperties($scope.targetId).then(function(props) {
      $scope.targetPropertiesBackup = props.s;
      $scope.targetProperties = props.s;
      $scope.editor.setValue(props.s);
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
  }
})();
