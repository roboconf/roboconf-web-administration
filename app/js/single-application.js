'use strict';


// Controller for a single application
rcfApp.controller( 'appController', function( $scope, $rootScope, $route, $routeParams, Restangular ) {
	$scope.rootUrl = $rootScope.restUrl;
	$scope.noError = true;
	$scope.invoked = false;
	$scope.appName = $routeParams.appName;
	$scope.template = '';
	Restangular.setBaseUrl( $rootScope.restUrl );
	

	
	// Sort and format instances
	$scope.buildInstancesGraph = function( instances ) {
		var rootNodes = [];
		if( instances ) {
			
			var currentParentNode;
			var lastInstancePathLength = 1;
			
			for( var index = 0; index < instances.length; ++index ) {
				
				// Create the current node and see the instance path's length
				var currentNode = { instance: instances[ index ], children: []};
				instances[ index ].treeNode = currentNode;
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
	$scope.changeState = function( newState ) {
		var path = 'app/' + $scope.appName + "/change-state?new-state=" + newState + "&instance-path=" + $scope.selectedInstance.path;
		Restangular.one( path ).post();
		$scope.selectedInstance.status = 'CUSTOM';
    };
    
    $scope.performAll = function( action, useInstance ) {
    	var path = 'app/' + $scope.appName + "/" + action;
    	if( useInstance )
    		path += "?instance-path=" + $scope.selectedInstance.path;
    	
    	Restangular.one( path ).post().then( function() {
    		$scope.loadInstances();
    	});
    	
    	if( useInstance )
    		$scope.selectedInstance.status = 'CUSTOM';
    };
    
    // Regularly poll the server
    // FIXME: shouldn't we stop the timeout at some time?
    $scope.updateFromServer = function() {
    	setTimeout( 
    		function() {
    			
    			Restangular.all( 'app/' + $scope.appName + '/children?all-children=true' ).getList().then( function( instances ) {
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
    	var parentNotDeployed = $scope.isParentNotDeployed( instance );
    	$scope.template = $scope.findTemplateUrl( instance.status, isRoot, parentNotDeployed );
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
    		result = 'being updated...';
    	
    	return result;
    }
    
    $scope.updateSelectedInstance = function( rawInstances ) {
    	
    	if( $scope.selectedInstance ) {
	    	for( var index = 0; index < rawInstances.length; index ++ ) {
	    		var instance = rawInstances[ index ];
	    		if( instance.path === $scope.selectedInstance.path  ) {
	    			if( instance.status != $scope.selectedInstance.status )
	    				$scope.setSelectedInstance( instance );
	    			
	    			break;
	    		}
	    	}
    	}
    };
    
    $scope.isParentNotDeployed = function( instance ) {
    	
    	var node = instance.treeNode;
    	while( node.parent )
    		node = node.parent;
    	
    	return node.instance.status === "NOT_DEPLOYED";
    };
    
    $scope.findTemplateUrl = function( status, isRoot, isParentNotDeployed ) {
    	var result = '';
    	
    	if( status === 'NOT_DEPLOYED' )
    		result = isRoot ? 'app-root-not-deployed.html' : isParentNotDeployed ? 'app-not-deployed-no-action.html' : 'app-not-deployed.html';
    	 else if( status === 'STARTING' )
    		result = 'app-starting.html';
    	 else if( status === 'DEPLOYING' )
    		result = isRoot ? 'app-root-deploying.html' : 'app-deploying.html';
    	 else if( status === 'UNDEPLOYING' )
    		result = isRoot ? 'app-root-undeploying.html' : 'app-undeploying.html';
    	 else if( status === 'STOPPING' )
    		result = 'app-stopping.html';
    	 else if( status === 'DEPLOYED_STOPPED' )
    		result = 'app-deployed-stopped.html';
    	 else if( status === 'PROBLEM' )
    		result = 'app-problem.html';
    	 else if( status === 'DEPLOYED_STARTED' )
    		result = isRoot ? 'app-root-deployed-started.html' : 'app-deployed-started.html';
    	
    	return 'pages/includes/' + result;
    };
    
    $scope.findBlockClass = function( instancePath ) {
    	var result = "block short-block";
    	if( $scope.selectedInstance ) {
    		if( $scope.selectedInstance.path != instancePath
    				&& ! $scope.selectedInstance.path.startsWith( instancePath + "/" ))
        		result += " block-faded";
    	}
    	
    	return result;
    };
    
    $scope.loadInstances = function() {
    	Restangular.all( 'app/' + $scope.appName + '/children?all-children=true' ).getList().then( function( instances ) {
    		$scope.rErrorMsg = '';
    		$scope.rootNodes = $scope.buildInstancesGraph( instances );
    		$scope.invoked = true;
    		
    	}, function() {
    		$scope.noError = false;
    	});
    };
    
    
    // Initialize the page
    $scope.loadInstances();
    $scope.updateFromServer();
});
