(function() {
  'use strict';

  angular
  .module('roboconf.applications', ['ngCropper'])
  .controller('SingleApplicationController', singleApplicationController);

  singleApplicationController.$inject =
    ['rClient', '$scope', '$routeParams', '$window', '$timeout', 'rUtils', 'Cropper'];

  function singleApplicationController(rClient, $scope, $routeParams, $window, $timeout, rUtils, Cropper) {

    // Fields
    $scope.responseStatus = -1;
    $scope.showEvent = 'show';
    $scope.hideEvent = 'hide';
    $scope.showButton = false;

    $scope.cropper = {};
    $scope.cropperProxy = 'cropper.first';
    $scope.fileToCrop = '';
    $scope.cropImage = {};
    $scope.options = {
        maximize: true,
        aspectRatio: 1 / 1,
        crop: function(dataNew) {
          $scope.data = dataNew;
        }
    };
    $scope.appData = {
       name: '<strong>' + $routeParams.appName + '</strong>'
    };

    $scope.deleteApplication = deleteApplication;
    $scope.findIconStyle = findIconStyle;
    $scope.findIcon = rUtils.findIcon;
    $scope.uploadIcon = uploadIcon;
    $scope.selectFile = selectFile;
    $scope.onFile = onFile;
    $scope.cropImage = cropImage;

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

    function uploadIcon(appName) {
      $scope.cropImage(function() {
          var dataUrl = $scope.cropImage.dataUrl;
          var croppedBlob = Cropper.decode(dataUrl);
          var croppedImage = new File([croppedBlob], $scope.fileToCrop.name);
          var formObj = new FormData();

          formObj.append('file', croppedImage);
          rClient.uploadIcon(appName, formObj).then(function() {
            $window.location.reload(true);
          });
      });
    }

    function selectFile() {
      $('input[id=file-id]').click();
    }

    function onFile() {
      var input = $('#file-id')[0];
      $scope.fileToCrop = input.files[0];
      Cropper.encode($scope.fileToCrop).then(function(dataUrl) {
        $scope.dataUrl = dataUrl;
        $timeout(showCropper);
        $scope.showButton = true;
      });
    }

    function cropImage(callback) {
      if (!$scope.fileToCrop || !$scope.data) {
        return;
      }

      Cropper.crop($scope.fileToCrop, $scope.data).then(Cropper.encode).then(function(dataUrl) {
        $scope.filename = $scope.fileToCrop.name;
        $scope.cropImage.dataUrl = dataUrl;
        callback();
      });
    }

    function showCropper() {
      $scope.$broadcast($scope.showEvent);
    }

    function findIconStyle(app) {
      var style = 'cursor ' + rUtils.findRandomAvatar(app);
      return style.trim();
    }

  }
})();
