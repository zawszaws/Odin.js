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
	 * @class Key
	 * @extends Class
	 * @brief a keyboard key object
	 * @param String name the name of the key
	 * @param Number keyCode the key code of the key
	 */
        function Key( name, keyCode ){
            
	    Class.call( this );
	    
	    /**
	    * @property String name
	    * @brief the name of the key
	    * @memberof Key
	    */
            this.name = name;
	    
	    /**
	    * @property String keyCode
	    * @brief the key code
	    * @memberof Key
	    */
            this.keyCode = keyCode;
	    
	    /**
	    * @property Boolean down
	    * @brief boolean if this key is pressed
	    * @memberof Key
	    */
            this.down = false;
            
            this._first = true;
	    
            this._downFrame = -1;
            this._upFrame = -1;
	    
	    /**
	    * @property Number downTime
	    * @brief time the key was pressed
	    * @memberof Key
	    */
            this.downTime = -1;
	    
	    /**
	    * @property Number endTime
	    * @brief time the key was released
	    * @memberof Key
	    */
            this.endTime = -1;
        };
        
	Class.extend( Key, Class );
	
	
	Key.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.name = this.name;
	    json.keyCode = this.keyCode;
	    json.down = this.down;
	    
	    json.downTime = this.downTime;
	    json.endTime = this.endTime;
	    
	    return json;
	};
	
        
        return Key;
    }
);