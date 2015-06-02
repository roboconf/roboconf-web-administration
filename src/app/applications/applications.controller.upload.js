(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('ApplicationsUploadController', applicationsUploadController);

  applicationsUploadController.$inject = ['$scope', 'rAppTemplates'];
  function applicationsUploadController($scope, rAppTemplates) {

    // Fields
    $scope.resetUploadForm = resetUploadForm;

    // Function definitions
    function resetUploadForm() {
      $('.fileinput').fileinput('clear');
      $('#upload-result-details').hide();
    }
  }
})();
