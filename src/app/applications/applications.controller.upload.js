(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.applications' )
        .controller( 'ApplicationsUploadController', applicationsUploadController );

    // Declare the controller functions then.
    // Specify the injection to prevent errors on minification.
    applicationsUploadController.$inject = [ 'Restangular', '$scope', 'rAppTemplates' ];
    
    // Then comes the function...
    function applicationsUploadController( Restangular, $scope, rAppTemplates ) {
    	
    	// Fields
    	$scope.resetUploadForm = resetUploadForm;
    	
    	// Initial actions
    	initializeSearch();
    	
    	// Function definitions
        function initializeSearch() {
        	$( '#Finder' ).parent().hide();
        }
        
        function resetUploadForm() {
        	$( '.fileinput' ).fileinput('clear');
        	$( '#upload-result-details' ).hide();
        }
    }
})();
