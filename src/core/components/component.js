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
	 * @brief Base class for everything attached to GameObjects
	 */
        function Component(){
            
            Class.call( this );
	    
	    /**
	    * @property GameObject gameObject
	    * @brief reference to GameObject this component is attached too
	    * @memberof Component
	    */
            this.gameObject = undefined;
        }
        
	Class.extend( Component, Class );
        
        /**
	 * @method init
	 * @memberof Component
	 * @brief called when add to a GameObject
	 */
        Component.prototype.init = function(){};
	
	/**
	 * @method update
	 * @memberof Component
	 * @brief called before GameObject updates
	 */
        Component.prototype.update = function(){};
        
        
        return Component;
    }
);