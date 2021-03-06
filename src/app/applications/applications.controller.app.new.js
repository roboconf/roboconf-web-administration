(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('ApplicationsNewController', applicationsNewController);

  applicationsNewController.$inject = ['rClient', '$scope', 'rShare', '$window'];
  function applicationsNewController(rClient, $scope, rShare, $window) {

    // Fields
    $scope.appTemplates = [];
    $scope.fromExisting = true;
    $scope.app = {};
    $scope.errorMessage = '';
    $scope.responseStatus = -1;

    // Functions declaration
    $scope.showFromExisting = showFromExisting;
    $scope.showUpload = showUpload;
    $scope.createNewApplication = createNewApplication;
    $scope.formatTpl = formatTpl;
    $scope.completeCreation = completeCreation;

    // Initialize the list of templates
    rClient.listApplicationTemplates().then(function(templates) {
      $scope.appTemplates = templates;
    });

    // Update the description when the template changes
    $scope.$watch('app.tpl', function(newTpl, oldTpl) {
      if (newTpl && $scope.app) {
        if (! $scope.app.description || $scope.app.description === oldTpl.desc) {
          $scope.app.description = newTpl.desc;
        }
      }
    });

    // Functions
    function showFromExisting() {
      $scope.fromExisting = true;
      $('#upload-result-details').css('display', 'none');
    }

    function showUpload() {
      $scope.fromExisting = false;
    }

    function createNewApplication(app) {
      var newApp = {
        name: app.name,
        desc: app.description,
        tplName: app.tpl.name,
        tplVersion: app.tpl.version
      };

      rClient.newApplication(newApp).then(function(createdApp) {
        $window.location = '#/app/' + createdApp.name + '/overview';

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function formatTpl(tpl) {
      return tpl.name + ' - ' + tpl.version;
    }

    function completeCreation() {

      var last = rShare.eatLastItem();
      if (last) {
        $scope.appTemplates.push(last);
        $scope.app.tpl = last;
        showFromExisting();

        // Reset the upload form
        $('.fileinput').fileinput('clear');
        $('#upload-result-details').hide();
      }
    }
  }
})();
