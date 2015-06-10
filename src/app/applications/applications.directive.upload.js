(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .directive('rbcfZipUpload', rbcfZipUpload);

  function rbcfZipUpload() {
    return {
      restrict: 'E',
      templateUrl: 'templates/applications/_upload-directive.html',
      controller: rbcfZipUploadController
    };
  }

  rbcfZipUploadController.$inject = ['rPrefs', '$scope', 'rShare'];
  function rbcfZipUploadController(rPrefs, $scope, rShare) {

    // Fields and functions
    $scope.restUrl = rPrefs.getUrl() + '/applications/templates';
    $scope.uploadZip = uploadZip;
    $scope.progress = 0;

    // Functions
    function uploadZip() {

      // Prepare the data to submit
      var formObj = $('#new-app-form')[0];
      var formData = new FormData(formObj);

      // Create an ajax request
      $.ajax({
        // This is to follow upload progression
        xhr: function() {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener('progress', uploadListener, false);
          return xhr;
        },

        // Other properties
        url: $scope.restUrl,
        type: 'POST',
        data: formData,
        mimeType: 'multipart/form-data',
        contentType: false,
        cache: false,
        processData: false,

        // Callbacks on success or failure
        success: onSuccessfulUpload,
        error: onFailingUpload
      });
    }

    function uploadListener(evt) {
      if (evt.lengthComputable) {
        var percentage = Math.round((evt.loaded * 100) / evt.total);
        $scope.progress = percentage;
        // $apply() is required. Otherwise, no update is performed in the UI.
        $scope.$apply();
      }
    }

    function onSuccessfulUpload(data, textStatus, jqXHR) {
      var content = 'The application was succesfully uploaded.';
      $('#upload-result').html(content);
      $('#upload-result-details').fadeIn();

      // Store the newly uploaded template for other controllers.
      rShare.feedLastItem(angular.fromJson(data));
    }

    function onFailingUpload(jqXHR, textStatus, errorThrown) {

      // Reset the stored template.
      rShare.eatLastItem(null);

      var details;
      if (jqXHR.responseText) {
        details = angular.fromJson(jqXHR.responseText);
      }

      var content = 'The upload failed. The server is either offline or your settings are incorrect.';
      if (details && details.reason) {
        content += '<br />Reason: ' + details.reason.toLowerCase();
      }

      $('#upload-result').html(content);
    }
  }
})();
