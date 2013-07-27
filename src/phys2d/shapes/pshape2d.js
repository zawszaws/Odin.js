if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/mat2",
	"math/aabb2"
    ],
    function( Class, Vec2, Mat2, AABB2 ){
	"use strict";
	
	
	var CIRCLE, CONVEX;
	
	/**
	 * @class Phys2D.PShape2D
	 * @extends Class
	 * @brief 2D shape
	 * @param Object opts sets Class properties from passed Object
	 */
	function PShape2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property ENUM shapeType
	    * @memberof Phys2D.PShape2D
	    * @brief PShape2D.CIRCLE or PShape2D.CONVEX
	    */
	    this.shapeType = -1;
	    
	    /**
	    * @property Phys2D.PRigidbody2D body
	    * @memberof Phys2D.PShape2D
	    */
	    this.body = undefined;
	    
	    /**
	    * @property Vec2 position
	    * @memberof Phys2D.PShape2D
	    */
	    this.position = opts.position || new Vec2;
	    
	    /**
	    * @property Number rotation
	    * @memberof Phys2D.PShape2D
	    */
	    this.rotation = opts.rotation || 0;
	    
	    /**
	    * @property Mat2 R
	    * @memberof Phys2D.PShape2D
	    */
	    this.R = new Mat2().setRotation( this.rotation );
	    
	    /**
	    * @property Number density
	    * @memberof Phys2D.PShape2D
	    */
	    this.density = opts.density !== undefined ? opts.density : 1;
	    
	    /**
	    * @property Number mass
	    * @memberof Phys2D.PShape2D
	    */
	    this.mass = 0;
	    this.invMass = 0;
	    
	    /**
	    * @property Number inertia
	    * @memberof Phys2D.PShape2D
	    */
	    this.I = 0;
	    this.invI = 0;
	    
	    /**
	    * @property Vec2 center
	    * @memberof Phys2D.PShape2D
	    */
	    this.center = new Vec2;
	    
	    /**
	    * @property AABB2 aabb
	    * @memberof Phys2D.PShape2D
	    */
	    this.aabb = new AABB2;
	    
	    /**
	    * @property Number boundingRadius
	    * @memberof Phys2D.PShape2D
	    */
	    this.boundingRadius = 0;
	}
        
	Class.extend( PShape2D, Class );
	
	/**
	 * @method init
	 * @memberof Phys2D.PShape2D
	 */
	PShape2D.prototype.init = function(){
	    
	    this.calculateAABB();
	    this.calculateBoundingRadius();
	    this.calculateMass();
	};
	
	/**
	 * @method calculateAABB
	 * @memberof Phys2D.PShape2D
	 */
	PShape2D.prototype.calculateAABB = function(){
	    
	};
	
	/**
	 * @method calculateBoundingRadius
	 * @memberof Phys2D.PShape2D
	 */
	PShape2D.prototype.calculateBoundingRadius = function(){
	    
	};
	
	/**
	 * @method calculateMass
	 * @memberof Phys2D.PShape2D
	 */
	PShape2D.prototype.calculateMass = function(){
	    
	};
	
	/**
	 * @method setDensity
	 * @memberof Phys2D.PShape2D
	 * @param Number density
	 */
	PShape2D.prototype.setDensity = function( density ){
	    
	    this.density = density;
	    this.calculateMass();
	    
	    if( this.body ) this.body.calculateMass();
	};
	
	/**
	 * @method setMass
	 * @memberof Phys2D.PShape2D
	 * @param Number mass
	 */
	PShape2D.prototype.setMass = function( mass ){
	    
	    this.mass = mass;
	    this.invMass = 1 / mass;
	    
	    if( this.body ) this.body.calculateMass();
	};
	
	/**
	 * @method setI
	 * @memberof Phys2D.PShape2D
	 * @param Number I
	 */
	PShape2D.prototype.setI = function( I ){
	    
	    this.I = I;
	    this.invI = 1 / I;
	    
	    if( this.body ) this.body.calculateMass();
	};
	
	/**
	 * @method toWorld
	 * @memberof Phys2D.PShape2D
	 * @param Vec2 v
	 */
	PShape2D.prototype.toWorld = function( v ){
	    var body = this.body,
		bodyPos = body.position, R = body.R.elements,
		pos = this.position, x = pos.x, y = pos.y;
	    
	    v.x = bodyPos.x + ( x * R[0] + y * R[2] );
	    v.y = bodyPos.y + ( x * R[1] + y * R[3] );
	};
	
	
	PShape2D.CIRCLE = CIRCLE = 1;
	PShape2D.CONVEX = CONVEX = 2;
	
	
	return PShape2D;
    }
);