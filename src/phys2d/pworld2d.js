if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"phys2d/collision/pbroadphase2d",
	"phys2d/collision/pnearphase2d",
	"phys2d/bodies/pbody2d"
    ],
    function( Class, Vec2, PBroadphase2D, PNearphase2D, PBody2D ){
	"use strict";
	
	
	var pow = Math.pow,
	    
	    STATIC = PBody2D.STATIC,
	    DYNAMIC = PBody2D.DYNAMIC,
	    KINEMATIC = PBody2D.KINEMATIC,
	    
	    AWAKE = PBody2D.AWAKE,
	    SLEEPY = PBody2D.SLEEPY,
	    SLEEPING = PBody2D.SLEEPING,
	    
	    LOW = 0.000001, HIGH = 0.25,
	    
	    now = function(){
		var w = typeof window !== "undefined" ? window : {},
		    performance = typeof w.performance !== "undefined" ? w.performance : {};
		
		performance.now = (
		    performance.now ||
		    performance.mozNow ||
		    performance.msNow ||
		    performance.oNow ||
		    performance.webkitNow ||
		    function(){
			return Date.now() - start;
		    }
		);
		
		return function(){
		    
		    return performance.now() * 0.001;
		}
	    }();
	
	/**
	 * @class Phys2D.PWorld2D
	 * @extends Class
	 * @brief 2D physics world
	 * @param Object opts sets Class properties from passed Object
	 */
	function PWorld2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Phys2D.PBroadphase2D broadphase
	    * @memberof Phys2D.PWorld2D
	    */
	    this.broadphase = new PBroadphase2D( opts );
	    this.broadphase.world = this;
	    
	    /**
	    * @property Phys2D.PNearphase2D nearphase
	    * @memberof Phys2D.PWorld2D
	    */
	    this.nearphase = new PNearphase2D( opts );
	    this.nearphase.world = this;
	    
	    /**
	    * @property Array bodies
	    * @memberof Phys2D.PWorld2D
	    */
	    this.bodies = [];
	    
	    this._removeList = [];
	    this._removeNeedsUpdate = false;
	    
	    /**
	    * @property Array pairsi
	    * @memberof Phys2D.PWorld2D
	    */
	    this.pairsi = [];
	    
	    /**
	    * @property Array pairsj
	    * @memberof Phys2D.PWorld2D
	    */
	    this.pairsj = [];
	    
	    /**
	    * @property Array contacts
	    * @memberof Phys2D.PWorld2D
	    */
	    this.contacts = [];
	    
	    /**
	    * @property Vec2 gravity
	    * @memberof Phys2D.PWorld2D
	    */
	    this.gravity = opts.gravity || new Vec2( 0, -9.801 );
	    
	    /**
	    * @property Number time
	    * @memberof Phys2D.PWorld2D
	    */
	    this.time = 0;
	}
        
	Class.extend( PWorld2D, Class );
	
	/**
	 * @method add
	 * @memberof Phys2D.PWorld2D
	 * @param PBody2D body
	 */
	PWorld2D.prototype.add = function( body ){
	    if( !body ){
		console.warn( this +".add: Body is not defined");
		return;
	    }
	    
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index < 0 ){
		bodies.push( body );
		body.world = this;
	    }
	};
	
	/**
	 * @method remove
	 * @memberof Phys2D.PWorld2D
	 * @param PBody2D body
	 */
	PWorld2D.prototype.remove = function( body ){
	    if( !body ){
		console.warn( this +".add: Body is not defined");
		return;
	    }
	    
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index > -1 ){
		this._removeNeedsUpdate = true;
		this._removeList.push( body );
	    }
	};
	
	/**
	 * @method step
	 * @memberof Phys2D.PWorld2D
	 * @param Number delta
	 * @param NUmber dt
	 */
	PWorld2D.prototype.step = function(){
	    var accumulator = 0;
	    
	    return function( delta, dt ){
		var bodies = this.bodies,
		    removeList = this._removeList,
		    gravity = this.gravity, gx = gravity.x, gy = gravity.y,
		    body, shapes, motionState, pos, vel, linearDamping, aVel, force,
		    mass, invMass, invI,
		    i, j;
		
		accumulator += delta;
		
		while( accumulator >= dt ){
		    accumulator -= dt;
		    this.time += dt;
		    
		    
		    for( i = bodies.length; i--; ){
			body = bodies[i];
			
			if( body.motionState === DYNAMIC ){
			    mass = body.mass;
			    force = body.force;
			    
			    force.x = gx * mass;
			    force.y = gy * mass;
			}
		    }
		    
		    this.broadphase.collisions();
		    this.nearphase.collisions();
		    
		    for( i = bodies.length; i--; ){
			body = bodies[i];
			shapes = body.shapes;
			motionState = body.motionState;
			
			invMass = body.invMass;
			invI = body.invI;
			
			pos = body.position;
			vel = body.velocity;
			force = body.force;
			linearDamping = body.linearDamping;
			aVel = body.angularVelocity;
			
			if( motionState !== STATIC ){
			    
			    vel.x *= pow( 1 - linearDamping.x, dt );
			    vel.y *= pow( 1 - linearDamping.y, dt );
			    
			    if( aVel !== undefined ) body.angularVelocity *= pow( 1 - body.angularDamping, dt );
			}
			
			if( motionState === DYNAMIC ){
			    
			    vel.x += force.x * invMass * dt;
			    vel.y += force.y * invMass * dt;
			    
			    if( aVel !== undefined ) body.angularVelocity += body.torque * body.invI * dt;
			    
			    if( body.sleepState !== SLEEPING ){
				pos.x += vel.x * dt;
				pos.y += vel.y * dt;
				
				if( aVel !== undefined ) body.rotation += body.angularVelocity * dt;
				
				for( j = shapes.length; j--; ) shapes[j].calculateAABB();
			    }
			}
			
			force.x = force.y = 0;
			if( aVel !== undefined ) body.torque = 0;
			
			body.sleepTick( this.time );
		    }
		}
		
		if( this._removeNeedsUpdate ){
		    this._removeNeedsUpdate = false;
		    for( i = removeList.length; i--; ) removeList.splice( i, 1 );
		}
	    };
	}();
	
	
	return PWorld2D;
    }
);