if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"phys2d/shapes/pshape2d"
    ],
    function( Class, Vec2, PShape2D ){
	"use strict";
	
	
	var PI = Math.PI;
	
	/**
	 * @class Phys2D.PCircle2D
	 * @extends Class
	 * @brief 2D circle shape
	 * @param Object opts sets Class properties from passed Object
	 */
	function PCircle2D( opts ){
	    opts || ( opts = {} );
	    
	    PShape2D.call( this, opts );
	    
	    this.shapeType = PShape2D.CIRCLE;
	    
	    /**
	    * @property Number radius
	    * @memberof Phys2D.PCircle2D
	    */
	    this.radius = opts.radius || 0.5;
	}
        
	Class.extend( PCircle2D, PShape2D );
	
	/**
	 * @method calculateAABB
	 * @memberof Phys2D.PCircle2D
	 */
	PCircle2D.prototype.calculateAABB = function(){
	    var world = new Vec2;
	    
	    return function(){
		if( !this.body ) return;
		
		var aabb = this.aabb, min = aabb.min, max = aabb.max,
		    r = this.radius;
		
		this.toWorld( world );
		
		min.x = world.x - r;
		min.y = world.y - r;
		
		max.x = world.x + r;
		max.y = world.y + r;
	    };
	}();
	
	/**
	 * @method calculateBoundingRadius
	 * @memberof Phys2D.PCircle2D
	 */
	PCircle2D.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadius = this.radius;
	};
	
	/**
	 * @method calculateMass
	 * @memberof Phys2D.PCircle2D
	 */
	PCircle2D.prototype.calculateMass = function(){
	    var r = this.radius, c = this.center, p = this.position,
		px = p.x, py = p.y,
		mass = 0, I = 0;
	    
	    c.x = px;
	    c.y = py;
	    
	    mass = this.density * PI * r * r;
	    I = mass * ( 0.5 * r * r + ( px * px + py * py ) );
	    
	    this.mass = mass;
	    this.invMass = mass > 0 ? 1 / mass : 0;
	    
	    this.I = I;
	    this.invI = I > 0 ? 1 / I : 0;
	};
	
	
	return PCircle2D;
    }
);