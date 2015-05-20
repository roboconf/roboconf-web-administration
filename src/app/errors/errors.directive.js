(function () {
    'use strict';

    angular
    	.module( 'roboconf.errors' )
    	.directive( 'rbcfErrorMessage', rbcfErrorMessage );
    
    /* @ngInject */
    function rbcfErrorMessage() {
    	return {
    		restrict: 'E',
    		templateUrl: 'templates/errors/error-message.html'
    	};
    }
})();
