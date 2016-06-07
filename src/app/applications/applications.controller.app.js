(function() {
  'use strict';

  angular
  .module('roboconf.applications',['ngCropper'])
  .controller('SingleApplicationController', singleApplicationController);

  singleApplicationController.$inject = ['rClient', '$scope', '$routeParams', '$window', '$timeout', 'rUtils', 'Cropper'];
  function singleApplicationController(rClient, $scope, $routeParams, $window, $timeout, rUtils, Cropper) {

    // Fields
    $scope.responseStatus = -1;

    $scope.deleteApplication = deleteApplication;
    $scope.findAvatar = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;
    $scope.uploadIcon = uploadIcon;
    $scope.selectFile = selectFile;
    $scope.onFile = onFile;
    $scope.preview = preview;
    $scope.cropper = {};
    $scope.cropperProxy = 'cropper.first';
    $scope.showEvent = 'show';
    $scope.hideEvent = 'hide';
    $scope.options = {
        maximize: true,
        aspectRatio: 2 / 1,
        crop: function(dataNew) {
          data = dataNew;
        }
    };
    $scope.formD = '';
    var file, data;

    // Initial actions
    findApplication($routeParams.appName);

    // Function definitions
    function findApplication(appName) {

      rClient.listApplications().then(function(applications) {
        $scope.responseStatus = 0;
        $scope.app = applications.filter(function(val, index, arr) {
          return val.name === appName;
        }).pop();

        if (!$scope.app) {
          $scope.responseStatus = 404;
          $scope.app = {
            name: $routeParams.appName
          };
        }

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function deleteApplication() {
      rClient.deleteApplication($routeParams.appName).then(function() {
          $window.location = '#/';
      });
    }

    function uploadIcon( appName ) {
      //var formObj = $('#upload-icon-form')[0];
      //var formObj = $('#toto')[0];
      var content = $scope.formD;
      var b = new Blob([content], { type: "image/jpg"});
      console.log(content);
      var formObj = new FormData();
      formObj.append("file", b);
      console.log(formObj);
      //console.log(formObj1);
      rClient.uploadIcon( appName, formObj ).then(function() {
    	  $window.location.reload(true);
      });
    }

    function selectFile( appName ) {
      $("input[id='file-id']").click();
    }

    function onFile() {
      console.log("bonjour!!!!!");
      var input = $('#file-id')[0];
      var blob = input.files[0]; 
      console.log(blob);
      Cropper.encode((file = blob)).then(function(dataUrl) {
        $scope.dataUrl = dataUrl;
        $timeout(showCropper);  // wait for $digest to set image's src
      });
    }

    function preview() {
      if (!file || !data) return;
      Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
        console.log("data-url = "+dataUrl);
        console.log(typeof(data));
        $scope.formD = dataUrl;
        ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
      });
    }

    function showCropper() { $scope.$broadcast($scope.showEvent); }
    function hideCropper() { $scope.$broadcast($scope.hideEvent); }
  }
})();
