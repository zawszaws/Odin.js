if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/aabb2",
	"physics2d/body/pbody2d"
    ],
    function( Class, AABB2, PBody2D ){
        "use strict";
	
	var intersects = AABB2.intersects,
	    
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
        /**
	 * @class PBroadphase2D
	 * @extends Class
	 * @brief World broad phase
	 * @param Object opts sets Class properties from passed Object
	 */
	function PBroadphase2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Boolean useBoundingRadius
	    * @brief use bounding radius for broad phase instead of aabb, defaults to false
	    * @memberof PBroadphase2D
	    */
	    this.useBoundingRadius = opts.useBoundingRadius !== undefined ? opts.useBoundingRadius : false;
	}
	
	Class.extend( PBroadphase2D, Class );
	
	/**
	 * @method needBroadphaseTest
	 * @memberof PBroadphase2D
	 * @brief checks if bodyi needs to be checked against bodyj
	 * @return Boolean
	 */
	PBroadphase2D.prototype.needBroadphaseTest = function( bi, bj ){
	    
	    return !(
		( bi.filterGroup !== bj.filterGroup ) ||
		( ( bi.type === KINEMATIC || bi.type === STATIC || bi.isSleeping() ) &&
		( bj.type === KINEMATIC || bj.type === STATIC || bj.isSleeping() ) ) ||
		( !bi.shape && !bj.shape )
	    );
	};
	
	/**
	 * @method collisionPairs
	 * @memberof PBroadphase2D
	 * @brief gets all collisions to be checked by near phase
	 * @param PWorld2D world
	 * @param Array pairsi
	 * @param Array pairsj
	 */
	PBroadphase2D.prototype.collisionPairs = function( world, pairsi, pairsj ){
	    var bodies = world.bodies,
		count = bodies.length,
		bi, bj, i, j;
	    
	    pairsi.length = pairsj.length = 0;
	    
	    if( this.useBoundingRadius ){
		
		for( i = 0; i < count; i++ ) for( j = 0; j !== i; j++ ){
		    bi = bodies[i]; bj = bodies[j];
		    
		    if( !this.needBroadphaseTest( bi, bj ) ) continue;
		    
		    this.boundingRadiusBroadphase( bi, bj, pairsi, pairsj );
		}
	    }
	    else{
		
		for( i = 0; i < count; i++ ) for( j = 0; j !== i; j++ ){
		    bi = bodies[i]; bj = bodies[j];
		    
		    if( !this.needBroadphaseTest( bi, bj ) ) continue;
		    
		    this.AABBBroadphase( bi, bj, bi.aabb, bj.aabb, pairsi, pairsj );
		}
	    }
	};
	
	/**
	 * @method boundingRadiusBroadphase
	 * @memberof PBroadphase2D
	 * @brief does bounding radius broad phase
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param Array pairsi
	 * @param Array pairsj
	 */
	PBroadphase2D.prototype.boundingRadiusBroadphase = function( bi, bj, pairsi, pairsj ){
	    var si = bi.shape, sj = bj.shape,
		
		r = si.boundingRadius + sj.boundingRadius,
		
		xi = bi.position, xj = bj.position,
		
		dx = xj.x - xi.x,
		dy = xj.y - xi.y,
		
		d = dx * dx + dy * dy;
	    
	    if( d <= r * r ){
		pairsi.push( bi );
		pairsj.push( bj );
	    }
	};
	
	/**
	 * @method AABBBroadphase
	 * @memberof PBroadphase2D
	 * @brief does aabb broad phase
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param AABB2 biAABB
	 * @param AABB2 bjAABB
	 * @param Array pairsi
	 * @param Array pairsj
	 */
	PBroadphase2D.prototype.AABBBroadphase = function( bi, bj, biAABB, bjAABB, pairsi, pairsj ){
	    
	    if( bi.aabbNeedsUpdate ){
		bi.calculateAABB();
	    }
	    if( bj.aabbNeedsUpdate ){
		bj.calculateAABB();
	    }
	    
	    if( intersects( biAABB, bjAABB ) ){
		pairsi.push( bi );
		pairsj.push( bj );
	    }
	};
	
        
        return PBroadphase2D;
    }
);