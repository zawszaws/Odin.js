if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	var id = 0, slice = Array.prototype.slice;
	
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
	    
	    /**
	    * @property Object _JSON
	    * @brief json cache of object
	    * @memberof Class
	    */
	    this._JSON = {};
	    
	    /**
	    * @property Number _SERVER_ID
	    * @brief used for transfering data from/to server client
	    * @memberof Class
	    */
	    this._SERVER_ID = -1;
	}
        
	/**
	 * @method clone
	 * @memberof Class
	 * @brief return a copy of this Object
	 * @return Class
	 */
        Class.prototype.clone = function(){
	    var clone = new this.constructor;
	    clone.copy( this );
	    
            return clone;
        };
        
        /**
	 * @method copy
	 * @memberof Class
	 * @brief copies other object
	 * @param Class other object to be copied
	 * @return Class
	 */
        Class.prototype.copy = function( other ){
	    
	    return this;
        };
	
	/**
	 * @method on
	 * @memberof Class
	 * @brief sets function to be called when event name is triggered
	 * @param String name name of the event
	 * @param Function callback function to call on event
	 * @param Object context context of function
	 * @return Class
	 */
	Class.prototype.on = function( name, callback, context ){
	    var events = this._events[ name ] || ( this._events[ name ] = [] );
	    
	    events.push({
		callback: callback,
		context: context,
		ctx: context || this
	    });
	    
	    return this;
        };
	
	/**
	 * @method off
	 * @memberof Class
	 * @brief clears functions assigned to event name
	 * @param string name name of the event
	 * @return Class
	 */
	Class.prototype.off = function( name ){
	    var events = this._events[ name ], key;
	    
	    if( events ) events.length = 0;
	    
	    return this;
        };
	
	/**
	 * @method trigger
	 * @memberof Class
	 * @brief triggers event
	 * @param String name name of the event
	 * @return Class
	 */
	Class.prototype.trigger = function( name ){
	    var events = this._events[ name ];
	    if( !events || !events.length ) return this;
	    
	    var event, i, il,
		args = slice.call( arguments, 1 );
	    
	    for( i = 0, il = events.length; i < il; i++ ){
		( event = events[i] ).callback.apply( event.ctx, args );
	    }
	    
	    return this;
        };
	
	/**
	 * @method listenTo
	 * @memberof Class
	 * @brief listen to anothers objects event
	 * @param Class obj object to listen to
	 * @param String name name of the event
	 * @param Function callback function to call on event
	 * @param Object ctx context of the function
	 * @return Class
	 */
	Class.prototype.listenTo = function( obj, name, callback, ctx ){
	    if( !obj ) return this;
	    
	    obj.on( name, callback, ctx || this );
	    
	    return this;
        };
	
	/**
	 * @method toString
	 * @memberof Class
	 * @brief returns Class name of Object
	 * @return String
	 */
	Class.prototype.toString = function(){
	    
	    return this._class;
        };
	
	/**
	 * @method toString
	 * @memberof Class
	 * @brief returns id of Object
	 * @return Number
	 */
	Class.prototype.getId = function(){
	    
	    return this._id;
        };
	
	/**
	 * @method toJSON
	 * @memberof Class
	 * @brief returns json version of object
	 * @return Object
	 */
	Class.prototype.toJSON = function(){
	    
	    return this._JSON;
	};
	
	/**
	 * @method fromJSON
	 * @memberof Class
	 * @brief copies json version of object to properties
	 * @return Class
	 */
	Class.prototype.fromJSON = function( json ){
	    
	    return this;
	};
	
	/**
	 * @method extend
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
	    
	    childProto._super = parent;
	    childProto.constructor = child;
        };
	
	
	return Class;
    }
);