'use strict';

// Add a substring function to String
if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}

// Create the application.
var rcfApp = angular.module( 'rcfApp', [ 'ngRoute', 'restangular' ]);

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
	var obj = localStorage.getItem( 'rest-location' );
	if( obj )
		$rootScope.restUrl = angular.fromJson( obj );
	else
		$rootScope.restUrl = '';
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
    };
    
    $scope.shutdownApp = function( appName ) {
		Restangular.one( 'applications/' + appName + "/shutdown" ).post();
    };
});

rcfApp.controller( 'uploadController', function( $scope, $rootScope ) {
	$scope.actionUrl = $rootScope.restUrl + '/applications';
});


// Controller for the settings
rcfApp.controller( 'settingsController', function( $scope, $rootScope, Restangular ) {
	$scope.restLocation = $rootScope.restUrl;
	
    $scope.saveRestLocation = function( location ) {
		if( location.match("/$") == "/" )
			$rootScope.restUrl = location.substr( 0, location.length -1 );
		else
			$rootScope.restUrl = location;
    	
		localStorage.setItem( 'rest-location', angular.toJson( $rootScope.restUrl ));
    };
});


// Controller for a single application
rcfApp.controller( 'appController', function( $scope, $rootScope, $route, $routeParams, Restangular ) {
	$scope.rInvoked = false;
	$scope.appName = $routeParams.appName;
	$scope.template = '';
	$scope.actionId = '';
	$scope.actionIdLabel = '';
	Restangular.setBaseUrl( $rootScope.restUrl );
	
	Restangular.all( 'app/' + $scope.appName + '/all-children' ).getList().then( function( instances ) {
		$scope.rInvoked = true;
		$scope.rErrorMsg = '';
		$scope.rootNodes = $scope.buildInstancesGraph( instances );
		setTimeout( $scope.updateFromServer(), 10000 );
		
	}, function() {
		$scope.rInvoked = true;
		$scope.rErrorMsg = 'Communication with the server failed.';
	});
	
	
	// Sort and format instances
	$scope.buildInstancesGraph = function( instances ) {
		var rootNodes = [];
		if( instances ) {
			
			var currentParentNode;
			var lastInstancePathLength = 1;
			
			for( var index = 0; index < instances.length; ++index ) {
				
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
	
	
	// Perform an action on a given instances
	$scope.perform = function() {
		var realAction = $scope.actionId.split( '-' )[ 0 ];
		var instancePath = $scope.selectedInstance.path;
		var applyToChildren = $scope.actionId.endsWith( 'all' );
		
		var requestBody = angular.toJson({'apply-to-children':applyToChildren.toString(), 'instance-path':instancePath});
		Restangular.one( 'app', $scope.appName ).post( realAction, requestBody );
		$scope.actionId = '';
		$scope.selectedInstance.status = 'CUSTOM';
    };
    
    // Regularly poll the server
    // FIXME: shouldn't we stop the timeout at some time?
    $scope.updateFromServer = function() {
    	setTimeout( 
    		function() {
    			Restangular.all( 'app/' + $scope.appName + '/all-children' ).getList().then( function( instances ) {
    				$scope.rootNodes = $scope.buildInstancesGraph( instances );
    				$scope.updateSelectedInstance( instances );
    				$scope.updateFromServer();
    			})
    		}, 5000 );
    }
    
    $scope.findPosition = function( instancePath ) {
    	return instancePath.match(/\//g).length;
    }
    
    $scope.setSelectedInstance = function( instance ) {
    	$scope.selectedInstance = instance;
    	$scope.actionId = '';
    	var isRoot = $scope.findPosition( instance.path ) == 1;
    	$scope.template = $scope.findTemplateUrl( instance.status, isRoot );
    }
    
    $scope.setActionId = function( actionId ) {
    	$scope.actionId = actionId;
    	$scope.actionIdLabel = $scope.buildActionIdLabel( actionId );
    }
    
    $scope.formatStatus = function( status ) {
    	var result = '';
    	
    	if( status === 'NOT_DEPLOYED' )
    		result = 'not deployed';
    	else if( status === 'STARTING' )
    		result = 'starting and/or waiting for its dependencies to be started';
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
    		result = 'undetermined';
    	else if( status === 'CUSTOM' )
    		result = 'being updated..';
    	
    	return result;
    }
    
    $scope.updateSelectedInstance = function( rawInstances ) {
    	
    	if( $scope.selectedInstance ) {
	    	for( var index = 0; index < rawInstances.length; index ++ ) {
	    		var instance = rawInstances[ index ];
	    		if( instance.path === $scope.selectedInstance.path  ) {
	    			if( instance.status != $scope.selectedInstance.status ) {
	    				console.log( "hop" )
	    				$scope.setSelectedInstance( instance );
	    		}
	    			
	    			break;
	    		}
	    	}
    	}
    };
    
    $scope.findTemplateUrl = function( status, isRoot ) {
    	var result = '';
    	
    	if( status === 'NOT_DEPLOYED' )
    		result = 'app-not-deployed.html';
    	else if( status === 'STARTING' )
    		result = 'app-starting.html';
    	else if( status === 'DEPLOYING' )
    		result = 'app-deploying.html';
    	else if( status === 'UNDEPLOYING' )
    		result = 'app-undeploying.html';
    	else if( status === 'STOPPING' )
    		result = 'app-stopping.html';
    	else if( status === 'DEPLOYED_STOPPED' )
    		result = 'app-deployed-stopped.html';
    	else if( status === 'PROBLEM' )
    		result = 'app-problem.html';
    	else if( status === 'DEPLOYED_STARTED' ) {
    		if( isRoot )
    			result = 'app-deployed-started-root.html';
    		else
    			result = 'app-deployed-started.html';
    	}
    	
    	return 'pages/' + result;
    };
    
    $scope.buildActionIdLabel = function( actionId ) {
    	var result = actionId.replace( /-/g, " " ).toLowerCase().replace( /(^| )(\w)/g, function(x){return x.toUpperCase();});
    	return result;
    };
});
