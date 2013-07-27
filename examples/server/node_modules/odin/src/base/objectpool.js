if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	/**
	 * @class ObjectPool
	 * @brief Object Pooling Helper
	 * @param Object constructor
	 */
	function ObjectPool( constructor ){
	    
	    /**
	    * @property Array pooled
	    * @brief array holding inactive objects
	    * @memberof ObjectPool
	    */
	    this.pooled = [];
	    
	    /**
	    * @property Array objects
	    * @brief array holding active objects
	    * @memberof ObjectPool
	    */
	    this.objects = [];
	    
	    /**
	    * @property Object constructor
	    * @brief reference to constructor object
	    * @memberof ObjectPool
	    */
	    this.object = constructor;
	}
	
	/**
	 * @method create
	 * @memberof ObjectPool
	 * @brief creates new instance of this.object
	 */
	ObjectPool.prototype.create = function(){
	    var pooled = this.pooled,
		object = pooled.length ? pooled.pop() : new this.object;
	    
	    this.objects.push( object );
	    
	    return object;
	};
	
	/**
	 * @method remove
	 * @memberof ObjectPool
	 * @brief removes passed object and pools it
	 * @param Object object
	 */
	ObjectPool.prototype.remove = function( object ){
	    var objects = this.objects,
		pooled = this.pooled,
		index = objects.indexOf( object ),
		i;
	    
	    if( index > -1 ){
		pooled.push( object );
		objects.splice( index, 1 );
	    }
	};
	
	/**
	 * @method release
	 * @memberof ObjectPool
	 * @brief all arguments passed are removed and pooled
	 */
	ObjectPool.prototype.release = function(){
	    
	    for( var i = arguments.length; i--; ) this.remove( arguments[i] );
	};
	
	/**
	 * @method clear
	 * @memberof ObjectPool
	 * @brief removes all objects and pools them
	 */
	ObjectPool.prototype.clear = function(){
	    var objects = this.objects,
		pooled = this.pooled,
		i;
	    
	    for( i = objects.length; i--; ) pooled.push( objects[i] );
	    objects.length = 0;
	};
	
	
	return ObjectPool;
    }
);