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

      // Application deletions
      expect($route.routes['/app/:appName/delete'].controller).to.equal('SingleApplicationController');
      expect($route.routes['/tpl/:tplName/:tplQualifier/delete'].controller)
      .to.equal('SingleApplicationTemplateController');

      // Template associations
      expect($route.routes['/tpl/:tplName/:tplQualifier/applications'].controller)
      .to.equal('SingleApplicationTemplateController');

      // Targets
      expect($route.routes['/targets'].controller).to.equal('TargetsListingController');
      expect($route.routes['/target/:targetId/overview'].controller).to.equal('TargetSingleController');
      expect($route.routes['/target/:targetId/properties'].controller).to.equal('TargetEditingController');
      expect($route.routes['/target/:targetId/usage'].controller).to.equal('TargetSingleController');
      expect($route.routes['/target/:targetId/delete'].controller).to.equal('TargetSingleController');

      // Application Bindings
      expect($route.routes['/app/:appName/application-bindings'].controller).to.equal('ApplicationBindingsController');

      // Preferences
      expect($route.routes['/preferences'].controller).to.equal('PreferencesController');

      // Instances
      expect($route.routes['/app/:appName/instances'].controller).to.equal('InstancesListingController');
      expect($route.routes['/app/:appName/instances/new'].controller).to.equal('InstancesNewController');
    });
  });
});
