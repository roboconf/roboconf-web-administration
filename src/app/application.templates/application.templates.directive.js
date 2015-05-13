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
    		scope: {
    			uc: "=uc"
    		}
    	};
    }
})();
