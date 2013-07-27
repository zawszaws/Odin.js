if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/color"
    ],
    function( Class, Color ){
        "use strict";
	
        /**
	 * @class World
	 * @extends Class
	 * @brief base class for holding Scene's world data
	 * @param Object opts sets Class properties from passed Object
	 */
        function World( opts ){
	    opts || ( opts = {} );
	    
            Class.call( this );
	    
	    /**
	    * @property Color background
	    * @brief background color of scene
	    * @memberof World
	    */
	    this.background = opts.color !== undefined ? opts.color : new Color( 0.5, 0.5, 0.5, 1 );
	}
        
	Class.extend( World, Class );
	
	/**
	 * @method add
	 * @memberof World
	 * @brief adds body to physics world
	 * @param Component component
	 */
	World.prototype.add = function( component ){
	    
	};
	
	/**
	 * @method remove
	 * @memberof World
	 * @brief removes body from physics world
	 * @param Component component
	 */
	World.prototype.remove = function( component ){
	    
	};
	
	/**
	 * @method update
	 * @memberof World
	 * @brief called every frame
	 */
	World.prototype.update = function(){
	    
	};
	
        
        return World;
    }
);