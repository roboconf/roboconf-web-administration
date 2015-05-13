(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.applications' )
        .controller( 'ApplicationsNewController', applicationsNewController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    applicationsNewController.$inject = [ 'Restangular', '$scope', 'rprefs' ];
    
    // Then comes the function
    function applicationsNewController( Restangular, $scope, rprefs ) {
    	
    	// Fields
    	$scope.appTemplates = [];
    	$scope.fromExisting = true;
    	$scope.restUrl = rprefs.getUrl() + '/applications/templates';
    	
    	// Customize the message in the "upload" directive
    	$scope.newApp = {};
    	$scope.newApp.msg = '<a href="">List the available templates</a>'
    							+ ' or <a href="" onClick="window.location.reload()">upload a new application template</a>.';
    	
    	// Function definitions
    	function listApplications() {
        	Restangular.all( 'applications' ).getList().then( function( applications ) {
        		$scope.apps = applications;
        		$scope.invoked = true;
        		$scope.error = false;
        		
        	}, function() {
        		$scope.invoked = true;
        		$scope.error = true;
        	});
        }
    }
})();
