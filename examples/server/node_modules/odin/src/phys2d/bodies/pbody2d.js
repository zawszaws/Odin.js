if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2"
    ],
    function( Class, Vec2 ){
	"use strict";
	
	
	var STATIC, DYNAMIC, KINEMATIC,
	    AWAKE, SLEEPY, SLEEPING;
	
	/**
	 * @class Phys2D.PBody2D
	 * @extends Class
	 * @brief 2D body consisting of one point mass
	 * @param Object opts sets Class properties from passed Object
	 */
	function PBody2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Phys2D.World2D world
	    * @memberof Phys2D.PBody2D
	    */
	    this.world = undefined;
	    
	    /**
	    * @property Vec2 position
	    * @memberof Phys2D.PBody2D
	    */
	    this.position = opts.position || new Vec2;
	    
	    /**
	    * @property Vec2 velocity
	    * @memberof Phys2D.PBody2D
	    */
	    this.velocity = opts.velocity || new Vec2;
	    
	    /**
	    * @property Vec2 linearDamping
	    * @memberof Phys2D.PBody2D
	    */
	    this.linearDamping = opts.linearDamping || new Vec2( 0.01, 0.01 );
	    
	    /**
	    * @property Vec2 force
	    * @memberof Phys2D.PBody2D
	    */
	    this.force = new Vec2;
	    
	    /**
	    * @property Vec2 center
	    * @memberof Phys2D.PBody2D
	    */
	    this.center = opts.center || new Vec2;
	    
	    /**
	    * @property Number mass
	    * @memberof Phys2D.PBody2D
	    */
	    this.mass = opts.mass !== undefined ? opts.mass : 1;
	    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
	    
	    /**
	    * @property ENUM motionState
	    * @memberof Phys2D.PBody2D
	    * @brief motion state, Phys2D.PBody2D.DYNAMIC, Phys2D.PBody2D.STATIC or Phys2D.PBody2D.KINEMATIC
	    */
	    this.motionState = opts.motionState !== undefined ? opts.motionState : this.mass > 0 ? DYNAMIC : STATIC;
	    
	    /**
	    * @property Number boundingRadius
	    * @memberof Phys2D.PBody2D
	    */
	    this.boundingRadius = 0.1;
	    
	    /**
	    * @property Boolean allowSleep
	    * @memberof Phys2D.PBody2D
	    */
	    this.allowSleep = opts.allowSleep !== undefined ? !!opts.allowSleep : true;
	    
	    /**
	    * @property Number sleepVelocity
	    * @memberof Phys2D.PBody2D
	    * @brief if the velocity's magnitude is smaller than this value, the body is considered sleepy
	    */
	    this.sleepVelocity = opts.sleepVelocity !== undefined ? opts.sleepVelocity : 0.01;
	    
	    /**
	    * @property Number sleepyTimeLimit
	    * @memberof Phys2D.PBody2D
	    * @brief if the body has been sleepy for sleepyTimeLimit seconds, it is considered sleeping
	    */
	    this.sleepyTimeLimit = opts.sleepyTimeLimit !== undefined ? opts.sleepyTimeLimit : 1;
	    
	    /**
	    * @property ENUM sleepState
	    * @memberof Phys2D.PBody2D
	    */
	    this.sleepState = AWAKE;
	    
	    this._timeLastSleepy = 0;
	}
        
	Class.extend( PBody2D, Class );
	
	/**
	 * @method isAwake
	 * @memberof Phys2D.PBody2D
	 */
	PBody2D.prototype.isAwake = function(){
	    
	    return this.sleepState === AWAKE;
	};
	
	/**
	 * @method isSleepy
	 * @memberof Phys2D.PBody2D
	 */
	PBody2D.prototype.isSleepy = function(){
	    
	    return this.sleepState === SLEEPY;
	};
	
	/**
	 * @method isSleeping
	 * @memberof Phys2D.PBody2D
	 */
	PBody2D.prototype.isSleeping = function(){
	    
	    return this.sleepState === SLEEPING;
	};
	
	/**
	 * @method wake
	 * @memberof Phys2D.PBody2D
	 */
	PBody2D.prototype.wake = function(){
	    
	    if( this.sleepState === SLEEPING ){
		this.trigger("wake");
	    }
	    this.sleepState = AWAKE;
	};
	
	/**
	 * @method sleep
	 * @memberof Phys2D.PBody2D
	 */
	PBody2D.prototype.sleep = function(){
	    
	    this.sleepState = SLEEPING;
	};
	
	/**
	 * @method sleepTick
	 * @memberof Phys2D.PBody2D
	 */
	PBody2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    vel = this.velocity.lenSq(),
		    sleepVel = this.sleepVelocity * this.sleepVelocity;
		
		if( sleepState === AWAKE && vel < sleepVel ){
		    
		    this.sleepState = SLEEPY;
		    this._timeLastSleepy = time;
		}
		else if( sleepState === SLEEPY && vel > sleepVel ){
		    
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this._timeLastSleepy ) > this.sleepyTimeLimit ){
		    
		    this.sleep();
		}
	    }
	};
	
	
	PBody2D.AWAKE = AWAKE = 1;
	PBody2D.SLEEPY = SLEEPY = 2;
	PBody2D.SLEEPING = SLEEPING = 3;
	
	
	PBody2D.STATIC = STATIC = 1;
	PBody2D.DYNAMIC = DYNAMIC = 2;
	PBody2D.KINEMATIC = KINEMATIC = 3;
	
	
	return PBody2D;
    }
);