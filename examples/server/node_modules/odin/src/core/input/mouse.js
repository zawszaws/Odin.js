if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/vec2"
    ],
    function( Class, Time, Vec2 ){
	"use strict";
        
        var max = Math.max,
	    min = Math.min,
	    downNeedsUpdate = true,
            moveNeedsUpdate = true,
            upNeedsUpdate = true,
            outNeedsUpdate = true,
            wheelNeedsUpdate = true,
	    
	    isDown = false, isUp = true,
	    
            last = new Vec2;
        
        /**
	 * @class Mouse
	 * @extends Class
	 * @brief Mouse helper
	 * @event down called when mouse button is clicked
	 * @event move called when mouse is moved
	 * @event up called when mouse button is released
	 * @event out called when mouse leaves element
	 * @event wheel called when mouse wheel is moved
	 */
        function Mouse(){
            
            Class.call( this );
            
	    /**
	    * @property Vec2 start
	    * @brief start position of mouse
	    * @memberof Mouse
	    */
            this.start = new Vec2;
	    
	    /**
	    * @property Vec2 delta
	    * @brief delta position of mouse
	    * @memberof Mouse
	    */
            this.delta = new Vec2;
	    
	    /**
	    * @property Vec2 position
	    * @brief current position of mouse
	    * @memberof Mouse
	    */
            this.position = new Vec2;
	    
	    /**
	    * @property Vec2 end
	    * @brief end position of mouse
	    * @memberof Mouse
	    */
            this.end = new Vec2;
	    
	    /**
	    * @property Number startTime
	    * @brief start time of mouse when clicked
	    * @memberof Mouse
	    */
	    this.startTime = 0;
	    
	    /**
	    * @property Number deltaTime
	    * @brief delta time of mouse when released
	    * @memberof Mouse
	    */
	    this.deltaTime = 0;
	    
	    /**
	    * @property Number endTime
	    * @brief end time of mouse when released
	    * @memberof Mouse
	    */
	    this.endTime = 0;
            
	    /**
	    * @property Number wheel
	    * @brief wheels direction -1 or 1
	    * @memberof Mouse
	    */
            this.wheel = 0;
	    
	    this._downFrame = -1;
	    this._upFrame = -1;
            
	    /**
	    * @property Boolean left
	    * @brief left mouse button
	    * @memberof Mouse
	    */
            this.left = false;
            
	    /**
	    * @property Boolean middle
	    * @brief middle mouse button
	    * @memberof Mouse
	    */
            this.middle = false;
            
	    /**
	    * @property Boolean right
	    * @brief right mouse button
	    * @memberof Mouse
	    */
            this.right = false;
        };
        
	Class.extend( Mouse, Class );
        
	
        Mouse.prototype.update = function(){
            
            downNeedsUpdate = true;
            moveNeedsUpdate = true;
            upNeedsUpdate = true;
            outNeedsUpdate = true;
            wheelNeedsUpdate = true;
        };
        
        
        Mouse.prototype.handleEvents = function( e ){
            e.preventDefault();
            
            switch( e.type ){
                case "mousedown":
                    this.handle_mousedown( e );
                    break;
                
                case "mousemove":
                    this.handle_mousemove( e );
                    break;
                
                case "mouseup":
                    this.handle_mouseup( e );
                    break;
                
                case "mouseout":
                    this.handle_mouseout( e );
                    break;
                
                case "mousewheel":
                case "DOMMouseScroll":
                    this.handle_mousewheel( e );
                    break;
            }
        };
        
        
        Mouse.prototype.getPosition = function( e ){
            var element = e.target || e.srcElement,
		offsetX = element.offsetLeft,
		offsetY = element.offsetTop,
		
		x = ( e.pageX || e.clientX ) - offsetX,
		y = ( e.pageY || e.clientY ) - offsetY;
	    
            this.position.set( x, y );
        };
        
        
        Mouse.prototype.handle_mousedown = function( e ){
            
            if( downNeedsUpdate ){
                
		this.startTime = Time.time;
		
                this.getPosition( e );
                
                this.start.copy( this.position );
                this.delta.set( 0, 0 );
                
                switch( e.button ){
                    case 0:
                        this.left = true;
                        break;
                    case 1:
                        this.middle = true;
                        break;
                    case 2:
                        this.right = true;
                        break;
                }
		
		if( !isDown ){
		    this._downFrame = Time.frame;
		    isDown = true;
		}
		isUp = false;
                
		this.trigger("down");
                
                downNeedsUpdate = false;
            }
        };
        
        
        Mouse.prototype.handle_mousemove = function( e ){
            var delta = this.delta,
		position = this.position
	    
            if( moveNeedsUpdate ){
                last.copy( this.position );
		
                this.getPosition( e );
                
		delta.x = position.x - last.x;
		delta.y = -( position.y - last.y );
		
		this.trigger("move");
                
                moveNeedsUpdate = false;
            }
        };
        
        
        Mouse.prototype.handle_mouseup = function( e ){
            
            if( upNeedsUpdate ){
                
		this.endTime = Time.time;
		this.deltaTime = this.endTime - this.startTime;
		
                this.getPosition( e );
                
                this.end.copy( this.position );
                
                switch( e.button ){
                    case 0:
                        this.left = false;
                        break;
                    case 1:
                        this.middle = false;
                        break;
                    case 2:
                        this.right = false;
                        break;
                }
                
		if( !isUp ){
		    this._upFrame = Time.frame;
		    isUp = true;
		}
		isDown = false;
		
		this.trigger("up");
		
                upNeedsUpdate = false;
            }
        };
        
        
        Mouse.prototype.handle_mouseout = function( e ){
            
            if( outNeedsUpdate ){
                
		this.endTime = Time.time;
		this.deltaTime = this.endTime - this.startTime;
		
                this.getPosition( e );
                
                this.left = false;
                this.middle = false;
                this.right = false;
                
		this.trigger("out");
                
                outNeedsUpdate = false;
            }
        };
        
        
        Mouse.prototype.handle_mousewheel = function( e ){
            
            if( wheelNeedsUpdate ){
                
                this.wheel = max( -1, min( 1, ( e.wheelDelta || -e.detail ) ) );
                
		this.trigger("wheel");
                
                wheelNeedsUpdate = false;
            }
        };
        
        
        Mouse.prototype.toJSON = function(){
            var json = this._JSON;
	    
	    json.start = this.start;
            json.delta = this.delta;
            json.position = this.position;
            json.end = this.end;
	    
	    json.startTime = this.startTime;
	    json.deltaTime = this.deltaTime;
	    json.endTime = this.endTime;
            
            json.wheel = this.wheel;
            
            json.left = this.left;
            json.middle = this.middle;
            json.right = this.right;
	    
	    return json;
        };
        
        
        return new Mouse;
    }
);