(function () {
    'use strict';

    angular
    	.module( 'roboconf.application.templates' )
    	.directive( 'rbcfZipUpload', rbcfZipUpload );
    
    /* @ngInject */
    function rbcfZipUpload() {
    	return {
    		restrict: 'E',
    		templateUrl: 'templates/application.templates/html-upload-directive.html',
    		controller: rbcfZipUpload_controller
    	};
    }
    
    rbcfZipUpload_controller.$inject = [ 'rprefs', '$scope' ];
    function rbcfZipUpload_controller( rprefs, $scope ) {
    	$scope.restUrl = rprefs.getUrl() + '/applications/templates';
    }
})();
