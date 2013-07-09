if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	/**
	 * @class ObjectPool
	 * @brief Object Pooling Helper
	 */
	function ObjectPool( constuctor ){
	    
	    /**
	    * @property Array _pool
	    * @brief array holding inactive objects
	    * @memberof ObjectPool
	    */
	    this._pool = [];
	    
	    /**
	    * @property Array objects
	    * @brief array holding active objects
	    * @memberof ObjectPool
	    */
	    this.objects = [];
	    
	    /**
	    * @property Object constuctor
	    * @brief reference to constuctor object
	    * @memberof ObjectPool
	    */
	    this.object = constuctor;
	}
	
	/**
	 * @method set
	 * @memberof ObjectPool
	 * @brief sets constuctor of Object to create
	 * @param Constuctor constuctor
	 */
	ObjectPool.prototype.set = function( constuctor ){
	    this.object = constuctor;
	};
	
	/**
	 * @method create
	 * @memberof ObjectPool
	 * @brief creates new instance of this.object
	 */
	ObjectPool.prototype.create = function(){
	    var pool = this._pool,
		object = pool.length ? pool.pop() : new this.object;
	    
	    this.objects.push( object );
	    
	    return object;
	};
	
	/**
	 * @method release
	 * @memberof ObjectPool
	 * @brief all arguments passed are removed, if created through create method they are pooled
	 */
	ObjectPool.prototype.release = function(){
	    var objects = this.objects, object, index, i;
	    
	    for( i = arguments.length; i--; ){
		object = arguments[i];
		index = objects.indexOf( object );
		
		if( index !== -1 ){
		    this._pool.push( object );
		    objects.splice( index, 1 );
		}
	    }
	};
	
	/**
	 * @method clear
	 * @memberof ObjectPool
	 * @brief removes all objects and pools them
	 */
	ObjectPool.prototype.clear = function(){
	    var objects = this.objects, i;
	    
	    for( i = objects.length; i--; ){
		this._pool.push( objects[i] );
	    }
	    
	    objects.length = 0;
	};
	
	
	return ObjectPool;
    }
);