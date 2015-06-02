(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .service('rAppTemplates', rAppTemplates);

  rAppTemplates.$inject = ['Restangular'];
  function rAppTemplates(Restangular) {

    // Fields
    var appTemplates = [];
    var error = false;

    var service = {
        getTemplates: getTemplates,
        refreshTemplates: refreshTemplates,
        gotErrors: gotErrors
    };

    return service;

    // Functions
    function gotErrors() {
      return error;
    }

    function getTemplates() {
      return appTemplates;
    }

    function refreshTemplates() {

      return Restangular.all('applications/templates').getList()
      .then(function(_appTemplates) {
        appTemplates = _appTemplates;
        error = false;

      }, function() {
        appTemplates = [];
        error = true;
      });
    }
  }
}());
