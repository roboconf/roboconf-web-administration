(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('ApplicationsUploadController', applicationsUploadController);

  applicationsUploadController.$inject = ['$scope'];
  function applicationsUploadController($scope) {

    // Fields
    $scope.restpath = '/applications/templates';
    $scope.resetUploadForm = resetUploadForm;

    // Function definitions
    function resetUploadForm() {
      $('.fileinput').fileinput('clear');
      $('#upload-result-details').hide();
    }
  }
})();
