(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .directive('rbcfZipUpload', rbcfZipUpload);

  function rbcfZipUpload() {
    return {
      restrict: 'E',
      templateUrl: 'templates/utils/html/_upload-directive.html',
      controller: rbcfZipUploadController
    };
  }

  rbcfZipUploadController.$inject = ['rPrefs', '$scope', 'rShare', '$attrs'];
  function rbcfZipUploadController(rPrefs, $scope, rShare, $attrs) {

    // Fields and functions
    $scope.restUrl = rPrefs.getUrl() + $attrs.restpath;
    $scope.uploadZip = uploadZip;
    $scope.reset = reset;

    // Initialize everything
    reset();

    // Functions
    function reset() {
      $scope.progress = 0;
      $scope.reason = '';

      $('#upload-result-details').hide();
      $('#upload-result-ok').hide();
      $('.upload-result-ko').hide();
    }

    function uploadZip() {

      // Prepare the data to submit
      var formObj = $('#new-upload-form')[0];
      var formData = new FormData(formObj);

      // Create an ajax request
      $.ajax({
        // This is to follow upload progression
        xhr: function() {
          var xhr = new window.XMLHttpRequest();
          xhr.withCredentials = true;
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
      $('#upload-result-ok').show();
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

      $('.upload-result-ko').show();
      if (details && details.reason) {
        // Only case in the web console where we display messages
        // received from the server. We must force the refreshment.
        $scope.reason = details.reason;
        $scope.$apply();
      }
    }
  }
})();
