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
    $scope.cropImage = cropImage;
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
    $scope.filename = "";
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
      $scope.cropImage();
      //console.log($scope.cropImage.dataUrl);
      var dataUrl = $scope.cropImage.dataUrl;
      console.log(dataUrl);
      var croppedBlob = Cropper.decode(dataUrl);
      var croppedImage = new File([croppedBlob],$scope.filename);
      var formObj = new FormData();

      formObj.append("file", croppedImage);
      rClient.uploadIcon( appName, formObj ).then(function() {
    	  $window.location.reload(true);
      });
    }

    function selectFile( appName ) {
      $("input[id='file-id']").click();
    }

    function onFile() {
      var input = $('#file-id')[0];
      var blob = input.files[0]; 
      Cropper.encode((file = blob)).then(function(dataUrl) {
        $scope.dataUrl = dataUrl;
        $timeout(showCropper);
      });
    }

    function cropImage() {
      if (!file || !data) return;
      console.log("Bojjjjjj");
      Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
        $scope.filename = file.name;
        //$scope.cropImage.dataUrl = dataUrl;
        console.log(dataUrl);
        ($scope.cropImage || ($scope.cropImage = {})).dataUrl = dataUrl;
      });
    }

    function showCropper() { $scope.$broadcast($scope.showEvent); }
    function hideCropper() { $scope.$broadcast($scope.hideEvent); }
  }
})();
