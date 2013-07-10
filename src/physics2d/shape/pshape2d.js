if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/aabb2"
    ],
    function( Class, Vec2, AABB2 ){
        "use strict";
	
        /**
	 * @class PShape2D
	 * @extends Class
	 * @brief Base class for shapes
	 */
	function PShape2D(){
	    
	    Class.call( this );
	    
	    /**
	    * @property PBody2D body
	    * @brief reference to body this shape is attached to
	    * @memberof PShape2D
	    */
	    this.body = undefined;
	    
	    /**
	    * @property Enum type
	    * @brief shape type, 1 - RECT, 2 - CIRCLE, 3 - CONVEX
	    * @memberof PShape2D
	    */
	    this.type = 0;
	    
	    /**
	    * @property AABB2 aabb
	    * @brief aabb of this shape
	    * @memberof PShape2D
	    */
	    this.aabb = new AABB2;
	    
	    /**
	    * @property Number volume
	    * @brief volume of this shape
	    * @memberof PShape2D
	    */
	    this.volume = 0;
	    
	    /**
	    * @property Number boundingRadius
	    * @brief the bounding radius of this shape
	    * @memberof PShape2D
	    */
	    this.boundingRadius = 0;
	}
	
	Class.extend( PShape2D, Class );
	
	/**
	 * @method calculateAABB
	 * @memberof PShape2D
	 * @brief calculates aabb of this shape
	 */
	PShape2D.prototype.calculateAABB = function(){
	    throw new Error("calculateAABB not implemented for shape type "+ this.type );
	};
	
	/**
	 * @method calculateWorldAABB
	 * @memberof PShape2D
	 * @brief calculates world aabb
	 * @param Vec2 position
	 * @param Array R
	 * @param AABB2 aabb
	 */
	PShape2D.prototype.calculateWorldAABB = function( position, R, aabb ){
	    throw new Error("calculateWorldAABB not implemented for shape type "+ this.type );
	};
	
	/**
	 * @method calculateInertia
	 * @memberof PShape2D
	 * @brief calculates inertia
	 * @param Number mass
	 * @returns Number
	 */
	PShape2D.prototype.calculateInertia = function( mass ){
	    throw new Error("calculateInertia not implemented for shape type "+ this.type );
	};
	
	/**
	 * @method calculateBoundingRadius
	 * @memberof PShape2D
	 * @brief calculates bounding radius
	 */
	PShape2D.prototype.calculateBoundingRadius = function(){
	    throw new Error("calculateBoundingRadius not implemented for shape type "+ this.type );
	};
	
	/**
	 * @method calculateVolume
	 * @memberof PShape2D
	 * @brief calculates volume of shape
	 */
	PShape2D.prototype.calculateVolume = function(){
	    throw new Error("calculateVolume not implemented for shape type "+ this.type );
	};
	
	
	PShape2D.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.type = "PShape2D";
	    json._SERVER_ID = this._id;
	    
	    json.shapeType = this.type;
	    
	    json.aabb = this.aabb;
	    json.volume = this.volume;
	    json.boundingRadius = this.boundingRadius;
	    
	    return json;
	};
	
	
	PShape2D.prototype.fromJSON = function( json ){
	    
	    this.type = json.shapeType;
	    this._SERVER_ID = json._SERVER_ID;
	    
	    this.aabb.fromJSON( json.aabb );
	    this.volume = json.volume;
	    this.boundingRadius = json.boundingRadius;
	    
	    return this;
	};
	
	
	PShape2D.RECT = 1;
	PShape2D.CIRCLE = 2;
	PShape2D.CONVEX = 3;
	
        
        return PShape2D;
    }
);