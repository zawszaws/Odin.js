if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/aabb2",
	"phys2d/bodies/pbody2d"
    ],
    function( Class, Vec2, AABB2, PBody2D ){
	"use strict";
	
	
	var intersects = AABB2.intersects,
	    
	    STATIC = PBody2D.STATIC,
	    DYNAMIC = PBody2D.DYNAMIC,
	    KINEMATIC = PBody2D.KINEMATIC,
	    
	    AWAKE = PBody2D.AWAKE,
	    SLEEPY = PBody2D.SLEEPY,
	    SLEEPING = PBody2D.SLEEPING,
	    
	    needsTest,
	    collisions,
	    boundingRadiusBroadphase,
	    AABBBroadphase;
	
	/**
	 * @class Phys2D.PBroadphase2D
	 * @extends Class
	 * @brief 2D physics broad phase
	 */
	function PBroadphase2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Phys2D.PWorld2D world
	    * @brief use bounding radius for broad phase instead of aabb, defaults to false
	    * @memberof Phys2D.PBroadphase2D
	    */
	    this.world = undefined;
	    
	    /**
	    * @property Boolean useBoundingRadius
	    * @brief use bounding radius for broad phase instead of aabb, defaults to false
	    * @memberof Phys2D.PBroadphase2D
	    */
	    this.useBoundingRadius = opts.useBoundingRadius !== undefined ? !!opts.useBoundingRadius : true;
	}
        
	Class.extend( PBroadphase2D, Class );
	
	/**
	 * @method needsTest
	 * @memberof Phys2D.PBroadphase2D
	 * @brief checks if bodies need to be checked against each other
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @return Boolean
	 */
	PBroadphase2D.prototype.needsTest = needsTest = function( bi, bj ){
	    
	    return !(
		( ( bi.motionState === STATIC || bi.motionState === KINEMATIC || bi.sleepState === SLEEPING ) &&
		( bj.motionState === STATIC || bj.motionState === KINEMATIC || bj.sleepState === SLEEPING ) )
	    );
	};
	
	/**
	 * @method collisions
	 * @memberof Phys2D.PBroadphase2D
	 * @brief gets all broad phase collisions to be checked by near phase
	 * @param PWorld2D world
	 */
	PBroadphase2D.prototype.collisions = collisions = function(){
	    var world = this.world,
		useBoundingRadius = this.useBoundingRadius,
		pairsi = world.pairsi, pairsj = world.pairsj,
		bi, shapesi, bj, shapesj, shapesNumi, shapesNumj,
		bodies = world.bodies, count = bodies.length,
		i, j, k, l;
	    
	    pairsi.length = pairsj.length = 0;
	    
	    for( i = 0; i < count; i++ ) for( j = 0; j !== i; j++ ){
		bi = bodies[i];
		bj = bodies[j];
		
		if( !needsTest( bi, bj ) ) continue;
		
		shapesi = bi.shapes; shapesNumi = shapesi.length;
		shapesj = bj.shapes; shapesNumj = shapesj.length;
		
		if( shapesNumi && shapesNumj ){
		    
		    for( k = shapesNumi; k--; ) for( l = shapesNumj; l--; ){
			
			if( useBoundingRadius ){
			    boundingRadiusBroadphase( shapesi[k], shapesj[l], pairsi, pairsj );
			}
			else{
			    AABBBroadphase( shapesi[k], shapesj[l], pairsi, pairsj );
			}
		    }
		}
	    }
	};

	/**
	 * @method boundingRadiusBroadphase
	 * @memberof Phys2D.PBroadphase2D
	 * @brief gets all broad phase collisions to be checked by near phase
	 * @param Phys2D.PShape2D si
	 * @param Phys2D.PShape2D sj
	 * @param Array pairsi
	 * @param Array pairsj
	 * @return Boolean
	 */
	PBroadphase2D.prototype.boundingRadiusBroadphase = boundingRadiusBroadphase = function(){
	    var xi = new Vec2, xj = new Vec2; 
	    
	    return function( si, sj, pairsi, pairsj ){
		si.toWorld( xi ); sj.toWorld( xj );
		
		var r = si.boundingRadius + sj.boundingRadius,
		    
		    dx = xj.x - xi.x,
		    dy = xj.y - xi.y,
		    
		    d = dx * dx + dy * dy;
		
		if( d <= r * r ){
		    pairsi.push( si );
		    pairsj.push( sj );
		}
	    };
	}();
	
	/**
	 * @method AABBBroadphase
	 * @memberof Phys2D.PBroadphase2D
	 * @brief does aabb broad phase
	 * @param Phys2D.PShape2D si
	 * @param Phys2D.PShape2D sj
	 * @param Array pairsi
	 * @param Array pairsj
	 */
	PBroadphase2D.prototype.AABBBroadphase = AABBBroadphase = function( si, sj, pairsi, pairsj ){
	    
	    if( intersects( si.aabb, sj.aabb ) ){
		pairsi.push( si );
		pairsj.push( sj );
	    }
	};
	
	
	return PBroadphase2D;
    }
);