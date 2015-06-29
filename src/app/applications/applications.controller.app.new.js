(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('ApplicationsNewController', applicationsNewController);

  applicationsNewController.$inject = ['rClient', '$scope', '$timeout', 'rShare', '$window'];
  function applicationsNewController(rClient, $scope, $timeout, rShare, $window) {

    // Fields
    $scope.appTemplates = [];
    $scope.fromExisting = true;
    $scope.app = {};
    $scope.errorMessage = '';

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
        tplQualifier: app.tpl.qualifier
      };

      rClient.newApplication(newApp).then(function() {
        $window.location = '#/app/' + newApp.name + '/details';

      }, function(response) {
        $scope.errorMessage = 'An error occured. ' + response.data.reason;
        $timeout(resetErrorMessage, 6000);
      });
    }

    function formatTpl(tpl) {
      return tpl.name + ' - ' + tpl.qualifier;
    }

    function resetErrorMessage() {
      $scope.errorMessage = '';
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
