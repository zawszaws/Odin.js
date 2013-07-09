if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        /**
	 * @class PBody2D
	 * @extends Class
	 * @brief Base for 2D Physics Bodies
	 * @param Object opts sets Class properties from passed Object
	 */
	function PBody2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    /**
	    * @property Number filterGroup
	    * @brief only bodies with the same filter group collide
	    * @memberof PBody2D
	    */
	    this.filterGroup = opts.filterGroup !== undefined ? opts.filterGroup : 0;
	    
	    /**
	    * @property PWorld2D world
	    * @brief reference to world this body is attached to
	    * @memberof PBody2D
	    */
	    this.world = undefined;
	    
	    /**
	    * @property undefined userData
	    * @brief custom user data, when adding to a GameObject thourgh RigidBody2D component this is set to the RigidBody2D
	    * @memberof PBody2D
	    */
	    this.userData = undefined;
	}
	
	Class.extend( PBody2D, Class );
	
	
	PBody2D.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.type = "PBody2D";
	    json._SERVER_ID = this._id;
	    json.filterGroup = this.filterGroup;
	    
	    return json;
	};
	
	
	PBody2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    this.filterGroup = json.filterGroup;
	    
	    return this;
	};
	
	
	PBody2D.DYNAMIC = 1;
	PBody2D.STATIC = 2;
	PBody2D.KINEMATIC = 3;
	
        
        return PBody2D;
    }
);