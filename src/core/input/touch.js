if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2"
    ],
    function( Class, Vec2 ){
	"use strict";
        
        /**
	 * @class Touch
	 * @extends Class
	 * @brief Touch helper
	 */
        function Touch(){
	    
	    Class.call( this );
	    
	    /**
	    * @property Number id
	    * @brief id of this touch
	    * @memberof Touch
	    */
            this.id = -1;
            
	    /**
	    * @property Vec2 delta
	    * @brief delta position of touch
	    * @memberof Touch
	    */
            this.delta = new Vec2;
            
	    /**
	    * @property Vec2 position
	    * @brief current position of touch
	    * @memberof Touch
	    */
            this.position = new Vec2;
	    
            this._last = new Vec2;
	    this._first = false;
        };
        
	Class.extend( Touch, Class );
        
        
        Touch.prototype.clear = function(){
            
	    this.id = -1;
	    
	    this.position.set( 0, 0 );
	    this.delta.set( 0, 0 );
	    this._last.set( 0, 0 );
	    
	    this._first = false;
        };
        
        
        Touch.prototype.getPosition = function( e ){
            var position = this.position, delta = this.delta, last = this._last, first = this._first,
		element = e.target || e.srcElement,
		offsetX = element.offsetLeft,
		offsetY = element.offsetTop;
	    
	    if( !first ){
		last.x = position.x;
		last.y = position.y;
		
		position.x = ( e.pageX || e.clientX ) - offsetX;
		position.y = ( e.pageY || e.clientY ) - offsetY;
	    }
	    else{
		position.x = last.x = ( e.pageX || e.clientX ) - offsetX;
		position.y = last.y = ( e.pageY || e.clientY ) - offsetY;
	    }
	    
	    delta.x = position.x - last.x;
	    delta.y = position.y - last.y;
        };
        
        
        return Touch;
    }
);