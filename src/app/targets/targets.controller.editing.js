(function() {
  'use strict';

  angular
  .module('roboconf.targets')
  .controller('TargetEditingController', targetEditingController);

  targetEditingController.$inject = ['$scope', 'rClient', '$routeParams'];
  function targetEditingController($scope, rClient, $routeParams) {

    // Fields
    $scope.found = false;
    $scope.error = false;
    $scope.targetId = $routeParams.targetId;
    $scope.targetAlias = $scope.targetId;
    $scope.targetProperties = '';
    $scope.targetPropertiesBackup = '';
    
    $scope.referencing = [];
    $scope.using = [];
    $scope.editable = false;

    // Functions declaration
    $scope.setEditable = setEditable;

    // Initial actions
    var txtArea = $('#target-properties').get(0);
    var editor = CodeMirror.fromTextArea(txtArea, {
      mode: 'properties',
      lineNumbers: true,
      lineWrapping: true,
      readOnly: true
    });
    
    rClient.findTarget($scope.targetId).then(function(bean) {
      $scope.targetAlias = bean.name ? bean.name : 'no name';
      $scope.error = false;
      $scope.found = true;

    }, function() {
      $scope.error = true;

    }).finally(function() {
      $scope.invoked = true;
    });
    
    rClient.findTargetProperties($scope.targetId).then(function(props) {
      $scope.targetPropertiesBackup = props.s;
      $scope.targetProperties = props.s;
      editor.setValue(props.s);
    });
    
    // Functions
    function setEditable(editable) {
      $scope.editable = editable;
      editor.setOption('readOnly', ! editable);
      if (! editable) {
        $scope.targetProperties = $scope.targetPropertiesBackup;
        editor.setValue($scope.targetPropertiesBackup);
      }
    }
  }
})();
