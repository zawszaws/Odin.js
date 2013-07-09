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
	    * @property Number identifier
	    * @brief id of this touch
	    * @memberof Touch
	    */
            this.identifier = -1;
            
	    /**
	    * @property Vec2 start
	    * @brief start position of touch
	    * @memberof Touch
	    */
            this.start = new Vec2;
            
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
            
	    /**
	    * @property Vec2 end
	    * @brief end position of touch
	    * @memberof Touch
	    */
            this.end = new Vec2;
	    
	    this._first = false;
	    
	    this._downFrame = -1;
	    this._upFrame = -1;
	    
	    /**
	    * @property Number startTime
	    * @brief start time of touch
	    * @memberof Touch
	    */
	    this.startTime = 0;
	    
	    /**
	    * @property Number deltaTime
	    * @brief delta time of touch
	    * @memberof Touch
	    */
	    this.deltaTime = 0;
	    
	    /**
	    * @property Number endTime
	    * @brief end time of touch
	    * @memberof Touch
	    */
	    this.endTime = 0;
	    
	    
            this._last = new Vec2;
        };
        
	Class.extend( Touch, Class );
        
        /**
	 * @method clear
	 * @memberof Touch
	 * @brief clears touch
	 */
        Touch.prototype.clear = function(){
            this.identifier = -1;
            
            this.start.set( 0, 0 );
            this.delta.set( 0, 0 );
            this.position.set( 0, 0 );
            this.end.set( 0, 0 );
	    
	    this.startTime = 0;
	    this.deltaTime = 0;
	    this.endTime = 0;
	    
            this._last.set( 0, 0 );
        };
        
        
        Touch.prototype.getPosition = function( e ){
            var element = e.target || e.srcElement,
		offsetX = element.offsetLeft,
		offsetY = element.offsetTop,
		
		x = ( e.pageX || e.clientX ) - offsetX,
		y = ( e.pageY || e.clientY ) - offsetY;
            
            this.position.set( x, y );
        };
	
	
	Touch.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.identifier = this.identifier;
	    
	    json.start = this.start;
	    json.delta = this.delta;
	    json.position = this.position;
	    json.end = this.end;
	    
	    json.startTime = this.startTime;
	    json.deltaTime = this.deltaTime;
	    json.endTime = this.endTime;
	    
	    return json;
	};
        
        
        return Touch;
    }
);