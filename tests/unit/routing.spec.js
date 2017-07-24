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
      expect($route.routes['/tpl/:tplName/:tplVersion/overview'].controller)
      .to.equal('SingleApplicationTemplateController');

      // Application deletions
      expect($route.routes['/app/:appName/delete'].controller).to.equal('SingleApplicationController');
      expect($route.routes['/tpl/:tplName/:tplVersion/delete'].controller)
      .to.equal('SingleApplicationTemplateController');

      // Template associations
      expect($route.routes['/tpl/:tplName/:tplVersion/applications'].controller)
      .to.equal('SingleApplicationTemplateController');

      // Commands
      expect($route.routes['/app/:appName/commands'].controller).to.equal('CommandsListingController');
      expect($route.routes['/history/commands/:pageNumber?'].controller).to.equal('CommandsHistoryController');
      expect($route.routes['/app/:appName/commands/history/:pageNumber?'].controller)
            .to.equal('CommandsHistoryController');

      // Scheduling
      expect($route.routes['/scheduler'].controller).to.equal('ScheduleListingController');
      expect($route.routes['/scheduler/new'].controller).to.equal('ScheduleUpdateController');
      expect($route.routes['/scheduler/new/:appName'].controller).to.equal('ScheduleUpdateController');
      expect($route.routes['/scheduler/job/:jobId'].controller).to.equal('ScheduleUpdateController');
      expect($route.routes['/scheduler/job/:jobId/delete'].controller).to.equal('ScheduleUpdateController');
      expect($route.routes['/app/:appName/jobs'].controller).to.equal('ScheduleListingController');

      // Targets
      expect($route.routes['/targets'].controller).to.equal('TargetsListingController');
      expect($route.routes['/targets/new'].controller).to.equal('TargetsNewController');
      expect($route.routes['/target/:targetId'].controller).to.equal('TargetEditingController');
      expect($route.routes['/target/:targetId/properties'].controller).to.equal('TargetEditingController');
      expect($route.routes['/target/:targetId/usage'].controller).to.equal('TargetSingleController');
      expect($route.routes['/target/:targetId/delete'].controller).to.equal('TargetSingleController');

      // Application Bindings
      expect($route.routes['/app/:appName/application-bindings'].controller).to.equal('ApplicationBindingsController');

      // Application Targets
      expect($route.routes['/app/:appName/targets'].controller).to.equal('ApplicationTargetsController');

      // Preferences
      expect($route.routes['/preferences'].controller).to.equal('PreferencesController');

      // Instances
      expect($route.routes['/app/:appName/instances'].controller).to.equal('InstancesListingController');
      expect($route.routes['/app/:appName/instances/new'].controller).to.equal('InstancesNewController');

      // Web extensions
      expect($route.routes['/web-extensions'].controller).to.equal('WebExtensionsListingController');
      expect($route.routes['/web-extensions/:ext*'].controller).to.equal('WebExtensionsListingController');

      // Login
      expect($route.routes['/login'].controller).to.equal('LoginController');
    });
  });
});
