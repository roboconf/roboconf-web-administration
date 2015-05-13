(function () {
    'use strict';

    angular.module( 'roboconf' ).run( configureRun );

    configureRun.$inject = [ 'Restangular', 'rprefs' ];
    function configureRun( Restangular, rprefs ) {
    	Restangular.setBaseUrl( rprefs.getUrl());
    }
})();
