if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"phys2d/phys2d",
	"math/color",
	"core/world/world"
    ],
    function( Class, Time, Phys2D, Color, World ){
        "use strict";
	
        /**
	 * @class World2D
	 * @extends World
	 * @brief World for 2D physics
	 * @param Object opts sets Class properties from passed Object
	 */
        function World2D( opts ){
	    opts || ( opts = {} );
	    
            World.call( this, opts );
	    
	    this.pworld2d = new Phys2D.PWorld2D( opts );
	}
        
	Class.extend( World2D, World );
	
	/**
	 * @method add
	 * @memberof World
	 * @brief adds body to physics world
	 * @param Component component
	 */
	World2D.prototype.add = function( component ){
	    
	    this.pworld2d.add( component.body );
	};
	
	/**
	 * @method remove
	 * @memberof World
	 * @brief removes body from physics world
	 * @param Component component
	 */
	World2D.prototype.remove = function( component ){
	    
	    this.pworld2d.remove( component.body );
	};
	
	/**
	 * @method update
	 * @memberof World
	 * @brief called every frame
	 */
	World2D.prototype.update = function(){
	    
	    this.pworld2d.step( Time.delta, Time.fixedDelta );
	};
	
        
        return World2D;
    }
);