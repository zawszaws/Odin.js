if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/body/pbody2d",
    ],
    function( Class, Vec2, PBody2D ){
        "use strict";
	
	var DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC,
	    AWAKE, SLEEPY, SLEEPING;
	
        /**
	 * @class PParticle2D
	 * @extends PBody2D
	 * @brief Body consisting of one point mass, does not have orientation
	 * @param Object opts sets Class properties from passed Object
	 */
	function PParticle2D( opts ){
	    opts || ( opts = {} );
	    
	    PBody2D.call( this, opts );
	    
	    /**
	    * @property Vec2 position
	    * @brief position of body
	    * @memberof PParticle2D
	    */
	    this.position = opts.position instanceof Vec2 ? opts.position : new Vec2;
	    
	    /**
	    * @property Vec2 velocity
	    * @brief velocity of body
	    * @memberof PParticle2D
	    */
	    this.velocity = opts.velocity instanceof Vec2 ? opts.velocity : new Vec2;
	    
	    /**
	    * @property Vec2 linearDamping
	    * @brief linear damping of body
	    * @memberof PParticle2D
	    */
	    this.linearDamping = opts.linearDamping instanceof Vec2 ? opts.linearDamping : new Vec2( 0.01, 0.01 );
	    
	    /**
	    * @property Number mass
	    * @brief mass of body, a mass of zero makes the bodt static
	    * @memberof PParticle2D
	    */
	    this.mass = opts.mass !== undefined ? opts.mass : 1;
	    
	    /**
	    * @property Number mass
	    * @brief inverse mass of body, 1 / mass
	    * @memberof PParticle2D
	    */
	    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
	    
	    /**
	    * @property Enum type
	    * @brief type of body, 1 - DYNAMIC, 2 - STATIC, 3 - KINEMATIC
	    * @memberof PParticle2D
	    */
	    this.type = opts.type !== undefined ? opts.type : this.mass > 0 ? DYNAMIC : STATIC;
	    
	    /**
	    * @property Number elasticity
	    * @brief the elasticity of the body
	    * @memberof PParticle2D
	    */
	    this.elasticity = opts.elasticity !== undefined ? opts.elasticity : 0.5;
	    
	    /**
	    * @property Number friction
	    * @brief the friction of the body
	    * @memberof PParticle2D
	    */
	    this.friction = opts.friction !== undefined ? opts.friction : 0.25;
	    
	    /**
	    * @property Vec2 force
	    * @memberof PParticle2D
	    */
	    this.force = new Vec2;
	    
	    this.vlambda = new Vec2;
	    
	    /**
	    * @property Boolean allowSleep
	    * @memberof PParticle2D
	    */
	    this.allowSleep = opts.allowSleep !== undefined ? opts.allowSleep : true;
	    
	    /**
	    * @property Enum sleepState
	    * @brief type of body, 1 - AWAKE, 2 - SLEEPY, 3 - SLEEPING
	    * @memberof PParticle2D
	    */
	    this.sleepState = AWAKE;
	    
	    this._sleepVelocity = 1e-4;
	    this._sleepTimeLimit = 3;
	    this._sleepLastSleepy = 0;
	}
	
	Class.extend( PParticle2D, PBody2D );
	
	/**
	 * @method isAwake
	 * @memberof PParticle2D
	 * @return Boolean
	 */
	PParticle2D.prototype.isAwake = function(){
	    
	    return this.sleepState === AWAKE;
	};
	
	/**
	 * @method isSleepy
	 * @memberof PParticle2D
	 * @return Boolean
	 */
	PParticle2D.prototype.isSleepy = function(){
	    
	    return this.sleepState === SLEEPY;
	};
	
	/**
	 * @method isSleeping
	 * @memberof PParticle2D
	 * @return Boolean
	 */
	PParticle2D.prototype.isSleeping = function(){
	    
	    return this.sleepState === SLEEPING;
	};
	
	/**
	 * @method wake
	 * @memberof PParticle2D
	 * @brief wakes body if sleeping
	 */
	PParticle2D.prototype.wake = function(){
	    
	    if( this.sleepState === SLEEPING ){
		this.trigger("wake");
	    }
	    this.sleepState = AWAKE;
	};
	
	/**
	 * @method sleep
	 * @memberof PParticle2D
	 * @brief makes body sleep
	 */
	PParticle2D.prototype.sleep = function(){
	    
	    if( this.sleepState === AWAKE || this.sleepState === SLEEPY ){
		this.trigger("sleep");
	    }
	    this.sleepState = SLEEPING;
	};
	
	/**
	 * @method sleepTick
	 * @memberof PParticle2D
	 * @brief if allowSleep is true checks if can sleep, called in PWorld2D.step
	 * @param Number time
	 */
	PParticle2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    velSq = this.velocity.lenSq(),
		    
		    sleepVel = this._sleepVelocity,
		    sleepVelSq = sleepVel * sleepVel;
		
		if( sleepState === AWAKE && velSq < sleepVelSq ){
		    this._sleepLastSleepy = time;
		    this.sleepState = SLEEPY;
		    this.trigger("sleepy");
		}
		else if( sleepState === SLEEPY && velSq > sleepVelSq ){
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this._sleepLastSleepy ) > this._sleepTimeLimit ){
		    this.sleep();
		}
	    }
	};
	
	
	PParticle2D.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.type = "PParticle2D";
	    json._SERVER_ID = this._id;
	    json.filterGroup = this.filterGroup;
	    
	    json.position = this.position;
	    json.velocity = this.velocity;
	    
	    json.linearDamping = this.linearDamping;
	    
	    json.mass = this.mass;
	    json.invMass = this.invMass;
	    
	    json.motionType = this.type;
	    
	    json.elasticity = this.elasticity;
	    json.friction = this.friction;
	    
	    json.allowSleep = this.allowSleep;
	    
	    return json;
	};
	
	
	PParticle2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    this.filterGroup = json.filterGroup;
	    
	    this.position.fromJSON( json.position );
	    this.velocity.fromJSON( json.velocity );
	    
	    this.linearDamping = json.linearDamping;
	    
	    this.mass = json.mass;
	    this.invMass = json.invMass;
	    
	    this.type = json.motionType;
	    
	    this.elasticity = json.elasticity;
	    this.friction = json.friction;
	    
	    this.allowSleep = json.allowSleep;
	    
	    return this;
	};
	
	
	PParticle2D.AWAKE = AWAKE = 1;
	PParticle2D.SLEEPY = SLEEPY = 2;
	PParticle2D.SLEEPING = SLEEPING = 3;
	
        
        return PParticle2D;
    }
);