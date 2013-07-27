if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        /**
	 * @class SharedObject
	 * @extends Class
	 * @brief Objects that are shared between server and client extend from this
	 */
        function SharedObject( ){
	    
            Class.call( this );
	    
	    /**
	    * @property Object _SYNC
	    * @memberof Scene
	    */
	    this._SYNC = {};
	    
	    /**
	    * @property Object _JSON
	    * @memberof Scene
	    */
	    this._JSON = {};
	    
	    /**
	    * @property Number _SERVER_ID
	    * @memberof Scene
	    */
	    this._SERVER_ID = -1;
	}
        
	Class.extend( SharedObject, Class );
	
	/**
	 * @method serverSync
	 * @memberof SharedObject
	 */
	SharedObject.prototype.serverSync = function(){
	    var sync = this._SYNC;
	    
	    return sync;
	};
	
	/**
	 * @method clientSync
	 * @memberof SharedObject
	 * @param JSON json
	 */
	SharedObject.prototype.clientSync = function( sync ){
	    
	    return this;
	};
	
	/**
	 * @method toJSON
	 * @memberof SharedObject
	 * @brief returns json representation of object
	 */
	SharedObject.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    return json;
	};
	
	/**
	 * @method fromJSON
	 * @memberof SharedObject
	 * @param JSON json
	 */
	SharedObject.prototype.fromJSON = function( json ){
	    
	    return this;
	};
	
        
        return SharedObject;
    }
);