if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        /**
	 * @class Component
	 * @extends Class
	 * @brief Base class for all components
	 */
        function Component(){
	    
            Class.call( this );
	    
	    this.gameObject = undefined;
	}
        
	Class.extend( Component, Class );
	
	/**
	 * @method init
	 * @memberof Component
	 * @brief called when added to GameObject
	 */
	Component.prototype.init = function(){
	    
	};
	
	/**
	 * @method update
	 * @memberof Component
	 * @brief called every frame
	 */
	Component.prototype.update = function(){
	    
	};
	
	/**
	 * @method destroy
	 * @memberof Component
	 * @brief removes this from GameObject
	 */
	Component.prototype.destroy = function(){
	    var gameObject = this.gameObject;
	    
	    if( gameObject ){
		gameObject.removeComponent( this );
	    }
	    else{
		console.warn( this +".destroy: Component is not added to a GameObject");
	    }
	    
	    this.trigger("destroy");
	};
	
        
        return Component;
    }
);