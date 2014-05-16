// 'use strict';

// Create the application.
var rcfApp = angular.module( 'rcfApp', [ 'ngRoute', 'restangular' ]);

// Add directives
var directives = angular.module('directives', []);
directives.directive('showOnHoverParent', function() {
      return {
         link : function(scope, element, attrs) {
            element.parent().bind('mouseenter', function() {
                element.show();
            });
            element.parent().bind('mouseleave', function() {
                 element.hide();
            });
       }
   };
});

// Configure our routes.
rcfApp.config( function( $routeProvider, $sceDelegateProvider ) {
	$routeProvider

	.when('/', {
		templateUrl : '/pages/apps.html',
		controller  : 'mainController'
	})
	
	.when('/new', {
		templateUrl : '/pages/upload.html',
		controller  : 'uploadController'
	})
	
	.when('/settings', {
		templateUrl : '/pages/settings.html',
		controller  : 'settingsController'
	})

	.when('/app/:appName', {
		templateUrl : '/pages/app.html',
		controller  : 'appController'
	})
	
	.otherwise({ redirectTo: '/' });
		
	// Required because the upload form targets another domain.
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',	// Allow same origin resource loads.
		'**']);
});

rcfApp.run( function( $rootScope ) {
	var obj = localStorage.getItem( 'preferences' );
	if( obj ) {
		
		var tempUrl = angular.fromJson( obj ).dm.rest.location;
		if( tempUrl.match("/$") == "/" )
			$rootScope.restUrl = tempUrl.substr( 0, tempUrl.length -1 );
		else
			$rootScope.restUrl = tempUrl;
		
	} else {
		$rootScope.restUrl = '';
	}
});

// Create the controller and inject Angular's $scope.
rcfApp.controller( 'mainController', function( $scope, $rootScope, $route, Restangular ) {
	$scope.rInvoked = false;
	$scope.rootUrl = $rootScope.restUrl;
	Restangular.setBaseUrl( $rootScope.restUrl );
		
	Restangular.all( 'applications' ).getList().then( function( applications ) {
		$scope.rInvoked = true;
		$scope.rErrorMsg = '';
		$scope.apps = applications;
		
	}, function() {
		$scope.rInvoked = true;
		$scope.rErrorMsg = 'Communication with the server failed.';
	})
	
	
	// Call-backs for ng-clicks    
    $scope.deleteApp = function( appName ) {
		Restangular.one( 'applications/' + appName ).remove();
		setTimeout(function () {
	        $scope.$apply(function () {
	        	$route.reload();
	        });
	    }, 2000);
    };
    
    $scope.shutdownApp = function( appName ) {
		Restangular.one( 'applications/' + appName + "/shutdown" ).post();
		setTimeout(function () {
	        $scope.$apply(function () {
	        	$route.reload();
	        });
	    }, 2000);
    };
});

rcfApp.controller( 'uploadController', function( $scope, $rootScope ) {
	// FIXME: check whether the '/' must be added or not!
	$scope.actionUrl = $rootScope.restUrl + '/applications';
});

rcfApp.controller( 'settingsController', function( $scope, $rootScope, Restangular ) {
	$scope.preferences = '';
	$scope.message = '';
	
	Restangular.setBaseUrl( $rootScope.restUrl );
	$scope.restorePrefs = function() {
    	var obj = localStorage.getItem( 'preferences' );
    	if( obj != 'undefined' && obj != null )
    		$scope.preferences = angular.fromJson( obj );
    };
    
    $scope.checkDm = function() {
		Restangular.setBaseUrl( $rootScope.restUrl );
		Restangular.one( 'init' ).get().then( 
			function( result ) {
				$scope.dmState = result == "true" ? "Initialized" : "Not initialized";
			}, function() {
				$scope.dmState = 'Unknown';
		});
    }
    
    $scope.initializeDm = function( msgServerLoc ) {
		Restangular.setBaseUrl( $rootScope.restUrl );
		Restangular.one( 'init' ).post( '', msgServerLoc ).then( 
			function() {
				$scope.message = 'The deployment manager was (re)initialized.';
			}, function() {
				$scope.message = 'The deployment manager could not be (re)initialized.';
			}
		);
		
		setTimeout( function() {
			$scope.message = '';
			$scope.$apply();
		}, 4000 );	
    }
    
    $scope.savePrefs = function( prefs ) {
		$rootScope.restUrl = prefs.dm.rest.location;
		localStorage.setItem( 'preferences', angular.toJson( prefs ));
		$scope.preferences = angular.copy( prefs );
		
		this.checkDm();
    };
    
    $scope.restorePrefs();
    $scope.checkDm();
});

// Controller for a single application
rcfApp.controller( 'appController', function( $scope, $rootScope, $route, $routeParams, Restangular ) {
	$scope.rInvoked = false;
	$scope.appName = $routeParams.appName;
	Restangular.setBaseUrl( $rootScope.restUrl );
	
	Restangular.all( 'app/' + $scope.appName + '/all-children' ).getList().then( function( instances ) {
		$scope.rInvoked = true;
		$scope.rErrorMsg = '';
		$scope.rootNodes = $scope.buildInstancesGraph( instances );
		
	}, function() {
		$scope.rInvoked = true;
		$scope.rErrorMsg = 'Communication with the server failed.';
	})
	
	
	// Sort and format instances
	$scope.buildInstancesGraph = function( instances ) {
		var rootNodes = [];		
		if( instances ) {
			
			var currentParentNode;
			var lastInstancePathLength = 1;
			
			for( index = 0; index < instances.length; ++index ) {
				
				// Create the current node and see the instance path's length
				var currentNode = { instance: instances[ index ], children: []};
				var pathLength = $scope.findPosition( currentNode.instance.path );
				
				// New root instance
				if( pathLength == 1 ) {
					currentParentNode = currentNode;
					rootNodes.push( currentNode );	
				}
				
				// The child is at the same level than the previous element.
				// Do we have to update the parent?
				else if( lastInstancePathLength === pathLength ) {
					if( $scope.findPosition( currentParentNode.instance.path ) === pathLength )
						currentParentNode = currentParentNode.parent;
					
					currentNode.parent = currentParentNode;
					currentParentNode.children.push( currentNode );
				}
				
				// If the child is at the same or the previous level, restore the parent.
				// The previous node does not have any child.
				else if( lastInstancePathLength > pathLength ) {
					currentParentNode = currentParentNode.parent;
					currentNode.parent = currentParentNode;
					currentParentNode.children.push( currentNode );
				}
				
				// If the child is a level after, change the parent
				else if( lastInstancePathLength < pathLength ) {
					currentNode.parent = currentParentNode;
					currentParentNode.children.push( currentNode );
					currentParentNode = currentNode;
				}
				
				// Remember the last path length
				lastInstancePathLength = pathLength;
			}
		}
		
		return rootNodes;
	};
	
	
	// Call-backs for ng-clicks
	$scope.perform = function( appName, actionName, instancePath ) {
		var escapedPath = instancePath.replace( new RegExp( '\\|', 'g' ), '%7C' );
		var noChild = angular.toJson( false );
		Restangular.one( 'app/' + appName + '/' + actionName + '/instance/' + escapedPath ).post( '', noChild );
		setTimeout(function () {
	        $scope.$apply(function () {
	        	$route.reload();
	        });
	    }, 2000);
    };
    
    $scope.findPosition = function( instancePath ) {
    	return instancePath.match(/\|/g).length;
    }
    
    $scope.setSelectedInstance = function( instance ) {
    	$scope.selectedInstance = instance;
    }
    
    $scope.formatInstancePath = function( instance ) {
    	var result = '';
    	if( instance )
    		result = instance.path.replace( new RegExp( '\\|', 'g' ), '/' );
    	
    	return result;
    }
    
    $scope.formatStatus = function( status ) {
    	var result = '';
    	
    	if( status === 'NOT_DEPLOYED' )
    		result = 'not deployed';
    	else if( status === 'STARTING' )
    		result = 'starting and/or waiting for its dependencies to be started.';
    	else if( status === 'DEPLOYING' )
    		result = 'being deployed.';
    	else if( status === 'UNDEPLOYING' )
    		result = 'being undeployed.';
    	else if( status === 'STOPPING' )
    		result = 'stopping';
    	else if( status === 'DEPLOYED_STOPPED' )
    		result = 'deployed but stopped';
    	else if( status === 'DEPLOYED_STARTED' )
    		result = 'deployed and started';
    	else if( status === 'PROBLEM' )
    		result = 'undetermined.';
    	
    	return result;
    }
});
