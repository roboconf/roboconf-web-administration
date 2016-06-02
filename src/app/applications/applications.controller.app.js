(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationController', singleApplicationController);

  singleApplicationController.$inject = ['rClient', '$scope', '$routeParams', '$window', 'rUtils'];
  function singleApplicationController(rClient, $scope, $routeParams, $window, rUtils) {

    // Fields
    $scope.responseStatus = -1;

    $scope.deleteApplication = deleteApplication;
    $scope.findAvatar = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;
    $scope.uploadIcon = uploadIcon;
    $scope.selectFile = selectFile;
    $scope.readURL = readURL;
    $scope.showDiv = false;
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

    function uploadIcon( appName ) {
      var formObj = $('#upload-icon-form')[0];
      //var formObj = $('#test-form')[0];
      console.log(formObj);
      //console.log(formObj1);
      rClient.uploadIcon( appName, formObj ).then(function() {
    	  $window.location.reload(true);
      });
    }

    function selectFile( appName ) {
      $("input[id='file-id']").click();
     /* setTimeout(function() {
    	  $scope.uploadIcon( appName )
      }, 3000);*/
    }
    function readURL( ) {

	   console.log("Bonjour le monde cruel");
	   var input = $('#file-id')[0];
       if (input.files && input.files[0]) {
         var reader = new FileReader();
         console.log(input.files[0]);
         reader.onload = function (e) {
            $('#my-img')
                  .attr('src', e.target.result);
                  //.width(150)
                  //.height(200);
            console.log($scope.showDiv);
            $scope.showDiv = true;
        	$scope.$apply();
         };
         reader.readAsDataURL(input.files[0]);
       }
       
       //$scope.cropImage();
       var image = document.getElementById('my-img');
       var cropper = new Cropper(image, {
         aspectRatio: 16 / 9,
         crop: function(e) {
          console.log(e.detail.x);
          console.log(e.detail.y);
          console.log(e.detail.width);
          console.log(e.detail.height);
          console.log(e.detail.rotate);
          console.log(e.detail.scaleX);
          console.log(e.detail.scaleY);
         }
       });
//       $scope.imgStatus = 1;
//       console.log($scope.imgStatus);
//       var divImg = document.getElementById("div-img").outerHTML;
//       var myWindow = window.open('', '', 'width=400,height=200');
//       var doc = myWindow.document;
//       doc.open();
//       doc.write(divImg);
//       doc.close();
       
    }
    
    function cropImage() {
        var image = document.getElementById('my-img');
        var cropper = new Cropper(image, {
          aspectRatio: 16 / 9,
          crop: function(e) {
           console.log(e.detail.x);
           console.log(e.detail.y);
           console.log(e.detail.width);
           console.log(e.detail.height);
           console.log(e.detail.rotate);
           console.log(e.detail.scaleX);
           console.log(e.detail.scaleY);
          }
        });
        //$('#test-form').hide();
       
    }
  }
})();
