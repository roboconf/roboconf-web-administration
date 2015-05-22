'use strict';


// Controller for a single application
rcfApp.controller( 'appController', function( $scope, $rootScope, $route, $routeParams, Restangular ) {
	$scope.rootUrl = $rootScope.restUrl;
	$scope.noError = true;
	$scope.invoked = false;
	$scope.actionInProgress = false;
	$scope.appName = $routeParams.appName;
	$scope.template = '';
	Restangular.setBaseUrl( $rootScope.restUrl );
	

	
	// Sort and format instances
	$scope.buildInstancesGraph = function( instances ) {
		var rootNodes = [];
		if( instances ) {
			
			var lastProcessedInstance = null;
			for( var index = 0; index < instances.length; ++index ) {
				
				// Create the current node and see the instance path's length
				var currentNode = { instance: instances[ index ], children: []};
				instances[ index ].treeNode = currentNode;
				var pathLength = $scope.findPosition( currentNode.instance.path );
				
				// New root instance
				if( pathLength == 1 ) {
					rootNodes.push( currentNode );
				}
				
				// Otherwise, count the segments.
				// Predicate: levels are incremented one by one, but can be decremented from several units at once.
				else {
					var sameSegmentsCount = 0;
					var old = lastProcessedInstance.instance.path.split( '/' );
					var curr = currentNode.instance.path.split( '/' );
					for( var i=0; i<old.length; i++ ) {
						if( old[ i ] === curr[ i ])
							sameSegmentsCount ++;
						else 
							break;
					}
					
					// Case: the current node is a (direct) child of the previous node.
					// Indirect child does not make sense in the Roboconf scope.
					if( sameSegmentsCount === old.length ) {
						currentNode.parent = lastProcessedInstance;
						lastProcessedInstance.children.push( currentNode );
					}
					
					// Case: sameSegmentsCount < old.length => there are common ancestors...
					else {
						var parentNode = lastProcessedInstance;
						for( var i=0; i < old.length - sameSegmentsCount; i++ )
							parentNode = parentNode.parent;
						
						currentNode.parent = parentNode;
						parentNode.children.push( currentNode );
					}
				}
				
				// Prepare the next iteration
				lastProcessedInstance = currentNode;
			}
		}
		
		return rootNodes;
	};
	
	
	// Perform an action on a given instances
	$scope.changeState = function( newState ) {
		var path = 'app/' + $scope.appName + '/change-state?new-state=' + newState + '&instance-path=' + $scope.selectedInstance.path;
		$scope.actionInProgress = true;
		Restangular.one( path ).post();
		$scope.selectedInstance.status = 'CUSTOM';
    };
    
    $scope.performAll = function( action, useInstance ) {
    	var path = 'app/' + $scope.appName + '/' + action;
    	if( useInstance )
    		path += '?instance-path=' + $scope.selectedInstance.path;
    	
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
    				
    				// Update the model
    				$scope.rootNodes = $scope.buildInstancesGraph( instances );
    				$scope.updateSelectedInstance( instances );
    				
    				// If the user clicked before, stop displaying the spinner
    				$scope.actionInProgress = false;
    				
    				// Refresh in 5 s
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
    		result = 'starting';
    	else if( status === 'DEPLOYING' )
    		result = 'being deployed.';
    	else if( status === 'UNDEPLOYING' )
    		result = 'being undeployed.';
    	else if( status === 'STOPPING' )
    		result = 'stopping';
    	else if( status === 'UNRESOLVED' )
    		result = 'waiting for its dependencies to be resolved';
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
    	
    	return node.instance.status === 'NOT_DEPLOYED';
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
    	 else if( status === 'UNRESOLVED' )
     		result = 'app-unresolved.html';
    	 else if( status === 'DEPLOYED_STARTED' )
    		result = isRoot ? 'app-root-deployed-started.html' : 'app-deployed-started.html';
    	
    	return 'pages/includes/' + result;
    };
    
    $scope.findBlockClass = function( instancePath ) {
    	var result = 'block short-block';
    	if( $scope.selectedInstance ) {
    		if( $scope.selectedInstance.path != instancePath
    				&& ! $scope.selectedInstance.path.startsWith( instancePath + '/' ))
        		result += ' block-faded';
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
