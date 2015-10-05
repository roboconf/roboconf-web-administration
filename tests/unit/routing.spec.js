'use strict';

describe('Routing', function() {

  it('should map routes to controllers', function() {
    module('roboconf');

    inject(function($route) {

      // Applications listings
      expect($route.routes['/applications'].controller).to.equal('ApplicationsListingController');
      expect($route.routes['/application-templates'].controller).to.equal('ApplicationsListingController');
      expect($route.routes['/'].controller).to.equal('ApplicationsListingController');

      // Application creations
      expect($route.routes['/applications/new'].controller).to.equal('ApplicationsNewController');
      expect($route.routes['/application-templates/new'].controller).to.equal('ApplicationsUploadController');

      // Single applications
      expect($route.routes['/app/:appName/overview'].controller).to.equal('SingleApplicationController');
      expect($route.routes['/tpl/:tplName/:tplQualifier/overview'].controller)
      .to.equal('SingleApplicationTemplateController');

      // Preferences
      expect($route.routes['/preferences'].controller).to.equal('PreferencesController');

      // Instances
      expect($route.routes['/app/:appName/instances'].controller).to.equal('InstancesListingController');
      expect($route.routes['/app/:appName/instances/new'].controller).to.equal('InstancesNewController');
    });
  });
});
