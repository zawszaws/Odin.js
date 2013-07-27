if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/objectpool",
	"math/vec2",
	"math/aabb2",
	"phys2d/collision/pcontact2d",
	"phys2d/bodies/pbody2d"
    ],
    function( Class, ObjectPool, Vec2, AABB2, PContact2D, PBody2D ){
	"use strict";
	
	
	var sqrt = Math.sqrt,
	    
	    contactPool = new ObjectPool( PContact2D ),
	    
	    circleCircle,
	    collisions;
	
	/**
	 * @class Phys2D.PNearphase2D
	 * @extends Class
	 * @brief 2D physics near phase
	 */
	function PNearphase2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Phys2D.PWorld2D world
	    * @brief use bounding radius for broad phase instead of aabb, defaults to false
	    * @memberof Phys2D.PNearphase2D
	    */
	    this.world = undefined;
	}
        
	Class.extend( PNearphase2D, Class );
	
	/**
	 * @method circleCircle
	 * @memberof Phys2D.PNearphase2D
	 * @brief collide circle vs circle
	 * @param PWorld2D world
	 */
	PNearphase2D.prototype.circleCircle = circleCircle = function( bi, bj, si, sj, xi, xj, contacts ){
	    
	};
	
	/**
	 * @method collisions
	 * @memberof Phys2D.PNearphase2D
	 * @brief gets all contacts
	 * @param PWorld2D world
	 */
	PNearphase2D.prototype.collisions = collisions = function(){
	    var world = this.world,
		contacts = world.contacts,
		pairsi = world.pairsi, pairsj = world.pairsj,
		bi, bj, si, sj,
		i;
	    
	    contactPool.clear();
	    contacts.length = 0;
	    
	    for( i = pairsi.length; i--; ){
		si = pairsi[i];
		sj = pairsj[i];
		
		if( si && sj ){
		    bi = si.body;
		    bj = sj.body;
		}
	    }
	};
	
	
	return PNearphase2D;
    }
);