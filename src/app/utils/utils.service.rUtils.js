(function() {
    'use strict';

    angular
        .module('roboconf.utils')
        .service('rUtils', rUtils);

    rUtils.$inject = [ '$timeout' ];
    
    /* @ngInject */
    function rUtils( $timeout ) {
        var service = {
            endsWith: endsWith,
            startsWith: startsWith,
            isObj: isObj,
            sortInstances: sortInstances,
            findPosition: findPosition,
            showRightBlock: showRightBlock,
            hideRightBlock: hideRightBlock
        };

        return service;
        /////////////////////

        function startsWith( string, prefix ) {
        	return isObj( string ) && isObj( prefix ) && string.indexOf( prefix ) === 0;
        }

        function endsWith( string, suffix ) {
        	return isObj( string ) && isObj( suffix ) && string.indexOf( suffix, string.length - suffix.length ) !== -1;
        }
        
        function isObj( obj ) {
        	return obj !== undefined && obj !== null; 
        }
        
        function showRightBlock( delay ) {
        	$( '#left-block' ).css( 'width', '50%' );
    		$timeout( function() {
    			$( '#right-block' ).css( 'visibility', 'visible' );
    			$( '#right-block' ).css( 'position', 'static' );
    			$( '#right-block' ).css( 'opacity', '1.0' );
    		}, delay );
        }
        
        function hideRightBlock() {
        	$( '#right-block' ).css( 'visibility', 'hidden' );
    		$( '#right-block' ).css( 'opacity', '0' );
    		
    		$timeout( function() {
    			$( '#left-block' ).css( 'width', '100%' );
    			$( '#right-block' ).css( 'position', 'absolute' );
    		}, 1000 );
        }
        
        function sortInstances( instances ) {
    		var rootNodes = [];
    		if( instances ) {
    			
    			var lastProcessedInstance = null;
    			for( var index = 0; index < instances.length; ++index ) {
    				
    				// Create the current node and see the instance path's length
    				var currentNode = { instance: instances[ index ], children: []};
    				instances[ index ].treeNode = currentNode;
    				var pathLength = findPosition( currentNode.instance.path );
    				
    				// New root instance
    				if( pathLength === 1 ) {
    					rootNodes.push( currentNode );
    				}
    				
    				// Otherwise, count the segments.
    				// Predicate: levels are incremented one by one, but can be decremented from several units at once.
    				else {
    					var sameSegmentsCount = 0;
    					var old = lastProcessedInstance.instance.path.split( '/' );
    					var curr = currentNode.instance.path.split( '/' );
    					for( var i=0; i<old.length; i++ ) {
    						if( old[ i ] === curr[ i ]) {
    							sameSegmentsCount ++;
    						} else { 
    							break;
    						}
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
    						for( var j=0; j < old.length - sameSegmentsCount; j++ ) {
    							parentNode = parentNode.parent;
    						}
    						
    						currentNode.parent = parentNode;
    						parentNode.children.push( currentNode );
    					}
    				}
    				
    				// Prepare the next iteration
    				lastProcessedInstance = currentNode;
    			}
    		}
    		
    		return rootNodes;
    	}
    
        function findPosition( instancePath ) {
        	return instancePath.match(/\//g).length;
        }
    }
}());
