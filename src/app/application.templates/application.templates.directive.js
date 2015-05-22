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
			controller: rbcfZipUploadController
		};
	}

	rbcfZipUploadController.$inject = [ 'rPrefs', '$scope' ];
	function rbcfZipUploadController( rPrefs, $scope ) {
		$scope.restUrl = rPrefs.getUrl() + '/applications/templates';
	}
})();
