(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.instances' )
        .controller( 'InstancesListingController', instancesListingController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    instancesListingController.$inject = [ 'Restangular', '$scope', 'rUtils', '$routeParams' ];
    
    // Then comes the function
    function instancesListingController( Restangular, $scope, rUtils, $routeParams ) {
    	
    	$scope.noError = true;
    	$scope.invoked = false;
    	$scope.actionInProgress = false;
    	$scope.appName = $routeParams.appName;
    	$scope.template = '';
    	
    	// Perform an action on a given instances
    	$scope.changeState = function( newState ) {
    		var path = 'app/' + $scope.appName + '/change-state?new-state=' + newState + '&instance-path=' + $scope.selectedInstance.path;
    		$scope.actionInProgress = true;
    		Restangular.one( path ).post();
    		$scope.selectedInstance.status = 'CUSTOM';
        };
        
        $scope.performAll = function( action, useInstance ) {
        	var path = 'app/' + $scope.appName + '/' + action;
        	if( useInstance ) {
        		path += '?instance-path=' + $scope.selectedInstance.path;
        	}
        	
        	Restangular.one( path ).post().then( function() {
        		$scope.loadInstances();
        	});
        	
        	if( useInstance ) {
        		$scope.selectedInstance.status = 'CUSTOM';
        	}
        };
        
        // Regularly poll the server
        // FIXME: shouldn't we stop the timeout at some time?
        $scope.updateFromServer = function() {
        	setTimeout( 
        		function() {
        			
        			Restangular.all( 'app/' + $scope.appName + '/children?all-children=true' ).getList().then( function( instances ) {
        				
        				// Update the model
        				$scope.rootNodes = rUtils.sortInstances( instances );
        				$scope.updateSelectedInstance( instances );
        				
        				// If the user clicked before, stop displaying the spinner
        				$scope.actionInProgress = false;
        				
        				// Refresh in 5 s
        				$scope.updateFromServer();
        			});
        		}, 5000 );
        };
        
        $scope.setSelectedInstance = function( instance ) {
        	$scope.selectedInstance = instance;
        	$scope.actionId = '';
        	
        	var isRoot = rUtils.findPosition( instance.path ) === 1;
        	var parentNotDeployed = $scope.isParentNotDeployed( instance );
        	$scope.template = $scope.findTemplateUrl( instance.status, isRoot, parentNotDeployed );
        };
        
        $scope.formatStatus = function( status ) {
        	var result = '';
        	
        	switch( status ) {
        	case 'NOT_DEPLOYED': result = 'not deployed'; break;
        	case 'STARTING': result = 'starting'; break;
        	case 'DEPLOYING': result = 'being deployed'; break;
        	case 'UNDEPLOYING': result = 'being undeployed'; break;
        	case 'STOPPING': result = 'stopping'; break;
        	case 'UNRESOLVED': result = 'waiting for its dependencies to be resolved'; break;
        	case 'DEPLOYED_STOPPED': result = 'deployed but stopped'; break;
        	case 'DEPLOYED_STARTED': result = 'deployed and started'; break;
        	case 'PROBLEM': result = 'undetermined'; break;
        	case 'CUSTOM': result = 'being updated...'; break;
        	}
        	
        	return result;
        };
        
        $scope.updateSelectedInstance = function( rawInstances ) {
        	
        	if( $scope.selectedInstance ) {
    	    	for( var index = 0; index < rawInstances.length; index ++ ) {
    	    		var instance = rawInstances[ index ];
    	    		if( instance.path === $scope.selectedInstance.path  ) {
    	    			if( instance.status !== $scope.selectedInstance.status ) {
    	    				$scope.setSelectedInstance( instance );
    	    			}
    	    			
    	    			break;
    	    		}
    	    	}
        	}
        };
        
        $scope.isParentNotDeployed = function( instance ) {
        	
        	var node = instance.treeNode;
        	while( node.parent ) {
        		node = node.parent;
        	}
        	
        	return node.instance.status === 'NOT_DEPLOYED';
        };
        
        $scope.findTemplateUrl = function( status, isRoot, isParentNotDeployed ) {
        	var result = '';
        	
        	if( status === 'NOT_DEPLOYED' ) {
        		result = isRoot ? 'app-root-not-deployed.html' : isParentNotDeployed ? 'app-not-deployed-no-action.html' : 'app-not-deployed.html';
        	 } else if( status === 'STARTING' ) {
        		result = 'app-starting.html';
        	 } else if( status === 'DEPLOYING' ) {
        		result = isRoot ? 'app-root-deploying.html' : 'app-deploying.html';
        	 } else if( status === 'UNDEPLOYING' ) {
        		result = isRoot ? 'app-root-undeploying.html' : 'app-undeploying.html';
        	 } else if( status === 'STOPPING' ) {
        		result = 'app-stopping.html';
        	 } else if( status === 'DEPLOYED_STOPPED' ) {
        		result = 'app-deployed-stopped.html';
        	 } else if( status === 'PROBLEM' ) {
        		result = 'app-problem.html';
        	 } else if( status === 'UNRESOLVED' ) {
         		result = 'app-unresolved.html';
        	 } else if( status === 'DEPLOYED_STARTED' ) {
        		result = isRoot ? 'app-root-deployed-started.html' : 'app-deployed-started.html';
        	 }
        	
        	return 'templates/instances/includes/' + result;
        };
        
        $scope.findBlockClass = function( instancePath ) {
        	var result = 'block short-block';
        	if( $scope.selectedInstance ) {
        		if( $scope.selectedInstance.path !== instancePath && 
        				! $scope.selectedInstance.path.startsWith( instancePath + '/' )) {
            		result += ' block-faded';
        		}
        	}
        	
        	return result;
        };
        
        $scope.loadInstances = function() {
        	Restangular.all( 'app/' + $scope.appName + '/children?all-children=true' ).getList().then( function( instances ) {
        		$scope.rErrorMsg = '';
        		$scope.rootNodes = rUtils.sortInstances( instances );
        		$scope.invoked = true;
        		
        	}, function() {
        		$scope.noError = false;
        	});
        };
        
        
        // Initialize the page
        $scope.loadInstances();
        //$scope.updateFromServer();
        
        function initializeSearch() {
        	
        	// Show the search elements
        	$( '#Finder' ).parent().show();
        	$( '#Finder-Companion' ).show();
        	
        	// We just listen to text changes in the search box
        	// to update our local search filter.
        	$( '#Finder' ).bind( 'input', function() {
        		$scope.searchFilter = $( this ).val();
        		
        		// Force the update in the view
        		$scope.$apply();
        	});
        }
    }
})();
