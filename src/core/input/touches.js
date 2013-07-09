if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/vec2",
	"core/input/touch"
    ],
    function( Class, Time, Vec2, Touch ){
	"use strict";
        
        var startNeedsUpdate = true,
            moveNeedsUpdate = true,
            endNeedsUpdate = true;
        
        /**
	 * @class Touches
	 * @extends Class
	 * @brief handles all Touch events
	 */
        function Touches(){
            
            Class.call( this );
	    
            /**
	    * @property Array array
	    * @brief array holding all touches
	    * @memberof Touches
	    */
            this.array = [];
            
            for( var i = 0; i < 11; i++ ){
                this.array.push( new Touch );
            }
        };
        
	Class.extend( Touches, Class );
        
        /**
	 * @method clear
	 * @memberof Touches
	 * @brief clears all touch events
	 */
        Touches.prototype.clear = function(){
            var array =  this.array,
                i, il;
	    
           for( i = 0, il = array.length; i < il; i++ ){
                array[i].clear();
            }
        };
        
        /**
	 * @method getTouches
	 * @memberof Touches
	 * @brief returns list of active touches
	 * @param Array array
	 * @return Array
	 */
        Touches.prototype.getTouches = function(){
	    var defaultArray = [];
	    
	    return function( array ){
		array = array instanceof Array ? array : defaultArray;
		array.length = 0;
		
		var thisArray = this.array, touch,
		    i, il;
		
		for( i = 0, il = thisArray.length; i < il; i++ ){
		    touch = thisArray[i];
		    
		    if( touch.identifier !== -1 ){
			array.push( touch );
		    }
		}
		
		return array;
	    };
	}();
        
        /**
	 * @method forEach
	 * @memberof Touches
	 * @brief for each active touch call a function
	 * @param Function callback
	 */
        Touches.prototype.forEach = function( callback ){
	    var thisArray = this.array, touch,
		i, il;
	    
	    for( i = 0, il = thisArray.length; i < il; i++ ){
		touch = thisArray[i];
		
		if( touch.identifier !== -1 ){
		    callback( touch );
		}
	    }
	};
        
        /**
	 * @method count
	 * @memberof Touches
	 * @brief returns number of active touches
	 * @return Number
	 */
        Touches.prototype.count = function(){
	    var thisArray = this.array, touch,
		i, il, count = 0;
	    
	    for( i = 0, il = thisArray.length; i < il; i++ ){
		touch = thisArray[i];
		
		if( touch.identifier !== -1 ){
		    count++;
		}
	    }
	    
	    return count;
	};
	
        
        Touches.prototype.update = function(){
            
            startNeedsUpdate = true;
            moveNeedsUpdate = true;
            endNeedsUpdate = true;
        };
        
        
        Touches.prototype.handleEvents = function( e ){
            e.preventDefault();
            
            switch( e.type ){
                case "touchstart":
                    this.handle_touchstart( e );
                    break;
                
                case "touchmove":
                    this.handle_touchmove( e );
                    break;
                
                case "touchend":
                    this.handle_touchend( e );
                    break;
                
                case "touchcancel":
                    this.handle_touchcancel( e );
                    break;
            }
        };
        
        
        Touches.prototype.handle_touchstart = function( e ){
	    var touches, count, evtTouches, touch, evtTouch,
		i;
	    
            if( startNeedsUpdate ){
                
                touches = this.array;
                evtTouches = e.touches;
                count = evtTouches.length;
		
		if( count <= touches.length ){
		    for( i = count; i--; ){
			evtTouch = evtTouches[i];
			touch = touches[i];
                        
                        touch.identifier = evtTouch.identifier;
                        
			touch.startTime = Time.time;
			
                        touch.getPosition( evtTouch );
			
			if( touch._first ){
			    touch._downFrame = Time.frame;
			    touch._first = false;
			}
                        
                        touch.start.copy( touch.position );
			
                        this.trigger("start", touch );
                    }
                }
                else{
                    this.clear();
                }
                
                startNeedsUpdate = false;
            }
        };
        
        
        Touches.prototype.handle_touchmove = function( e ){
            var touches, count, evtTouches, touch, evtTouch,
		delta, position, last, i, j;
	    
            if( moveNeedsUpdate ){
                
                touches = this.array;
                evtTouches = e.changedTouches;
                count = evtTouches.length;
		
		for( i = count; i--; ){
		    evtTouch = evtTouches[i];
		    
		    for( j = touches.length; j--; ){
			touch = touches[j];
                        
			if( touch.identifier === evtTouch.identifier ){
			    delta = touch.delta;
			    position = touch.position;
			    last = touch._last;
			    
                            last.copy( touch.position );
                            
                            touch.getPosition( evtTouch );
                            
			    delta.x = position.x - last.x;
			    delta.y = -( position.y - last.y );
                            
                            this.trigger("move", touch );
                        }
                    }
                }
                
                moveNeedsUpdate = false;
            }
        };
        
        
        Touches.prototype.handle_touchend = function( e ){
            var touches, count, evtTouches, touch, evtTouch,
		i, j;
	    
            if( endNeedsUpdate ){
                
                touches = this.array;
                evtTouches = e.changedTouches;
                count = evtTouches.length;
		
		for( i = count; i--; ){
		    evtTouch = evtTouches[i];
		    
		    for( j = touches.length; j--; ){
			touch = touches[j];
			
			if( touch.identifier === evtTouch.identifier ){ 
                            
                            touch._last.copy( touch.position );
                            
                            touch.getPosition( evtTouch );
			    
			    if( !touch._first ){
				touch._upFrame = Time.frame;
				touch._first = true;
			    }
                            
			    touch.endTime = Time.time;
			    touch.deltaTime = touch.endTime - touch.startTime;
			    
                            touch.end.copy( touch.position );
                            
			    touch.identifier = -1;
                            
                            this.trigger("end", touch );
                        }
                    }
                }
                
                endNeedsUpdate = false;
            }
        };
        
        
        Touches.prototype.handle_touchcancel = function( e ){
	    this.clear();
        };
	
	
	Touches.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.array = this.array;
	    
	    return json;
	};
        
        
        return new Touches;
    }
);