if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	var id = 0,
	    shift = Array.prototype.shift,
	    defineProperty = Object.defineProperty;
	
	/**
	 * @class Class
	 * @brief Base class for all objects
	 */
	function Class(){
	    
	    /**
	    * @property Number _id
	    * @brief unique id of this object
	    * @memberof Class
	    */
	    this._id = ++id;
	    
	    /**
	    * @property String _class
	    * @brief class name of object
	    * @memberof Class
	    */
	    this._class = this.constructor.name;
	    
	    /**
	    * @property Object _events
	    * @brief event holder of object
	    * @memberof Class
	    */
	    this._events = {};
	}
        
	/**
	 * @method clone
	 * @memberof Class
	 * @brief return a copy of this Object
	 */
        Class.prototype.clone = function(){
	    var clone = new this.constructor;
	    clone.copy( this );
	    
            return clone;
        };
        
        /**
	 * @method copy
	 * @memberof Class
	 * @brief copies other object, override when extending
	 * @param Class other object to be copied
	 */
        Class.prototype.copy = function( other ){
	    
	    return this;
        };
	
	/**
	 * @method on
	 * @memberof Class
	 * @brief sets function to be called when event is triggered
	 * @param String name name of the event
	 * @param Function callback function to call on event
	 */
	Class.prototype.on = function( name, callback ){
	    var events = this._events[ name ] || ( this._events[ name ] = [] );
	    
	    events.push( callback );
        };
	
	/**
	 * @method off
	 * @memberof Class
	 * @brief clears events under event name
	 * @param string name
	 */
	Class.prototype.off = function( name ){
	    var events = this._events[ name ];
	    
	    if( events ) events.length = 0;
        };
	
	/**
	 * @method trigger
	 * @memberof Class
	 * @brief triggers event, arguments after the name will be passed to the event's callback
	 * @param String name
	 * @return Class
	 */
	Class.prototype.trigger = function( name ){
	    var events = this._events[ name ], event,
		i;
	    
	    if( !events || !events.length ) return;
	    
	    shift.apply( arguments );
	    
	    for( i = events.length; i--; ){
		( event = events[i] ).apply( this, arguments );
	    }
	};
	
	/**
	 * @method toString
	 * @memberof Class
	 * @brief returns Class name
	 * @return String
	 */
	Class.prototype.toString = function(){
	    
	    return this._class;
        };
	
	/**
	 * @method Class.props
	 * @memberof Class
	 * @brief define properties, getter/setter functions
	 * @param Object obj object to add property too
	 * @param Object props properties to add
	 */
	Class.props = function( obj, props ){
	    
	    for( var key in props ) defineProperty( obj, key, props[ key ] );
	};
	
	/**
	 * @method Class.extend
	 * @memberof Class
	 * @brief makes child inherit parent
	 */
	Class.extend = function( child, parent ){
	    var parentProto = parent.prototype,
		childProto = child.prototype = Object.create( parentProto ),
		key;
	    
	    for( key in parentProto ){
		childProto[ key ] = parentProto[ key ];
	    }
	    
	    childProto.constructor = child;
	    Class.types[ childProto.constructor.name ] = childProto.constructor;
        };
	
	
	Class.types = {
	    Class: Class
	};
	
	
	return Class;
    }
);