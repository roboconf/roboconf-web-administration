(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.applications' )
        .controller( 'ApplicationsNewController', applicationsNewController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    applicationsNewController.$inject = [ 'Restangular', '$scope', 'rAppTemplates', '$timeout' ];
    
    // Then comes the function
    function applicationsNewController( Restangular, $scope, rAppTemplates, $timeout ) {
    	
    	// Fields
    	$scope.appTemplates = [];
    	$scope.newAppTemplate = {};
    	$scope.fromExisting = true;
    	$scope.app = {};
    	$scope.errorMessage = '';
    	
    	// Functions declaration
    	$scope.showFromExisting = showFromExisting;
    	$scope.showUpload = showUpload;
    	$scope.createNewApplication = createNewApplication;
    	$scope.formatTpl = formatTpl;
    	
    	// Initialize the list of templates
    	rAppTemplates.refreshTemplates().then( function() {
    		$scope.appTemplates = rAppTemplates.getTemplates();
    	});
    	
    	// Functions
    	function showFromExisting() {
        	$scope.fromExisting = true;
        	$( '#upload-result-details' ).css( 'display', 'none' );
        }
        
        function showUpload() {
        	$scope.fromExisting = false;
        }
        
        function createNewApplication( app ) {
        	var newApp = {
        		name: app.name,
        		desc: app.description,
        		tpl: {
        			name: app.tpl.name,
        			qualifier: app.tpl.qualifier
        		}
        	};
        	
        	Restangular.one( 'applications' ).post( '', newApp ).then( function() {
        		window.location = '#/application/' + app.name;
        		
        	}, function( response ) {
        		$scope.errorMessage = 'An error occured. ' + response.data.reason;
        		$timeout( resetErrorMessage, 6000 );
        	});
        }
        
        function formatTpl( tpl ) {
        	return tpl.name + ' - ' + tpl.qualifier;
        }
        
        function resetErrorMessage() {
        	$scope.errorMessage = '';
        }
    }
})();
