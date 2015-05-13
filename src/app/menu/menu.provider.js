(function () {
    'use strict';

    angular.module( 'roboconf.menu' ).provider( 'MenuActions', actions );
    
    function actions() {
    	var _actions = [];

    	this.$get = function() {
    		return {
    			getMenuActions: function() {
    				return _actions;
    			}
    		};
    	};

    	this.add = function(item) {
    		_actions.push(item);
    	};
    }

})();
