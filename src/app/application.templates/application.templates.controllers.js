(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.application.templates' )
        .controller( 'ApplicationTemplatesController', applicationTemplatesController );

    // Declare the controller functions then.
    // Specify the injection to prevent errors on minification.
    applicationTemplatesController.$inject = [ 'Restangular', '$scope', 'rprefs' ];
    
    // Then comes the function...
    function applicationTemplatesController( Restangular, $scope, rprefs ) {
    	
    	// Fields
    	$scope.appTemplates = [];
    	$scope.invoked = false;
    	$scope.error = false;
    	$scope.restUrl = rprefs.getUrl() + '/applications/templates';
    	
    	// Customize the message in the "upload" directive
    	$scope.templates = {};
    	$scope.templates.msg = 'You can <a href="#/appplication-templates">list the deployed applications</a>'
    							+ ' or <a href="#/application-templates/new" onClick="window.location.reload()">upload a new application</a>.';
    	
    	// Initial actions
    	listApplicationTemplates();
    	
    	// Function definitions
        function deleteAppTemplate( name, qualifier ) {
    		Restangular.one( 'applications/templates/' + name + '/' + qualifier ).remove().then( function() {
    			listApplicationTemplates();
        	});
        }
        
        function listApplicationTemplates() {
        	Restangular.all( 'applications/templates' ).getList().then( function( appTemplates ) {
        		$scope.appTemplates = appTemplates;
        		$scope.invoked = true;
        		$scope.error = false;
        		
        	}, function() {
        		$scope.invoked = true;
        		$scope.error = true;
        	});
        }
    }
})();
