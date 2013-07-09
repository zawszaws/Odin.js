if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/mat2",
	"math/aabb2",
	"physics2d/body/pbody2d",
	"physics2d/body/pparticle2d",
	"physics2d/shape/pbox2d",
	"physics2d/shape/pcircle2d",
	"physics2d/shape/pconvex2d",
	"physics2d/shape/pshape2d",
    ],
    function( Class, Vec2, Mat2, AABB2, PBody2D, PParticle2D, PBox2D, PCircle2D, PConvex2D, PShape2D ){
        "use strict";
	
	var objectTypes = {
		PBox2D: PBox2D,
		PCircle2D: PCircle2D,
		PConvex2D: PConvex2D,
		PShape2D: PShape2D
	    },
	    AWAKE = PParticle2D.AWAKE,
	    SLEEPY = PParticle2D.SLEEPY,
	    SLEEPING = PParticle2D.SLEEPING,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
        /**
	 * @class PRigidBody2D
	 * @extends PParticle2D
	 * @brief 2D Rigid Body
	 * @param Object opts sets Class properties from passed Object
	 */
	function PRigidBody2D( opts ){
	    opts || ( opts = {} );
	    
	    PParticle2D.call( this, opts );
	    
	    /**
	    * @property PShape2D shape
	    * @brief the shape of the body
	    * @memberof PRigidBody2D
	    */
	    this.shape = opts.shape instanceof PShape2D ? opts.shape : new PBox2D;
	    this.shape.body = this;
	    
	    /**
	    * @property Number rotation
	    * @brief rotation of the body
	    * @memberof PRigidBody2D
	    */
	    this.rotation = opts.rotation !== undefined ? opts.rotation : 0;
	    
	    /**
	    * @property Mat2 R
	    * @brief rotation martix of the body
	    * @memberof PRigidBody2D
	    */
	    this.R = new Mat2;
	    
	    /**
	    * @property Number angularVelocity
	    * @brief angular velocity of the body
	    * @memberof PRigidBody2D
	    */
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    
	    /**
	    * @property Number angularDamping
	    * @brief angular damping of the body
	    * @memberof PRigidBody2D
	    */
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0.1;
	    
	    /**
	    * @property AABB2 aabb
	    * @brief min and max vectors of the body
	    * @memberof PRigidBody2D
	    */
	    this.aabb = new AABB2;
	    
	    /**
	    * @property Boolean aabbNeedsUpdate
	    * @memberof PRigidBody2D
	    */
	    this.aabbNeedsUpdate = true;
	    
	    /**
	    * @property Number torque
	    * @brief torque of the body
	    * @memberof PRigidBody2D
	    */
	    this.torque = 0;
	    
	    /**
	    * @property Number inertia
	    * @brief the inertia of the body's mass with its shape
	    * @memberof PRigidBody2D
	    */
	    this.inertia = this.shape.calculateInertia( this.mass );
	    
	    /**
	    * @property Number invInertia
	    * @brief inverse inertia of the body
	    * @memberof PRigidBody2D
	    */
	    this.invInertia = this.inertia > 0 ? 1 / this.inertia : 0;
	    
	    /**
	    * @property Number density
	    * @brief density of the body
	    * @memberof PRigidBody2D
	    */
	    this.density = this.mass / this.shape.volume;
	    
	    this.wlambda = 0;
	    
	    this._sleepAngularVelocity = 1e-3;
	}
	
	Class.extend( PRigidBody2D, PParticle2D );
	
	/**
	 * @method sleepTick
	 * @memberof PRigidBody2D
	 * @brief if allowSleep is true checks if can sleep, called in PWorld2D.step
	 * @param Number time
	 */
	PRigidBody2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    velSq = this.velocity.lenSq(),
		    
		    aVel = this.angularVelocity,
		    aVelSq = aVel * aVel,
		    
		    sleepVel = this._sleepVelocity,
		    sleepVelSq = sleepVel * sleepVel,
		    
		    sleepAVel = this._sleepAngularVelocity,
		    sleepAVelSq = sleepAVel * sleepAVel;
		
		if( sleepState === AWAKE && ( velSq < sleepVelSq || aVelSq < sleepAVelSq ) ){
		    this._sleepLastSleepy = time;
		    this.sleepState = SLEEPY;
		    this.trigger("sleepy");
		}
		else if( sleepState === SLEEPY && ( velSq > sleepVelSq || aVelSq > sleepAVelSq ) ){
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this._sleepLastSleepy ) > this._sleepTimeLimit ){
		    this.sleep();
		}
	    }
	};
	
	/**
	 * @method calculateAABB
	 * @memberof PRigidBody2D
	 * @brief calculates aabb based on shape, position, and rotation
	 */
	PRigidBody2D.prototype.calculateAABB = function(){
	    
	    this.shape.calculateWorldAABB( this.position, this.R.elements, this.aabb );
	    this.aabbNeedsUpdate = false;
	};
	
	/**
	 * @method applyForce
	 * @memberof PRigidBody2D
	 * @param Vec2 force
	 * @param Vec2 worldPoint
	 * @param Boolean wake
	 */
	PRigidBody2D.prototype.applyForce = function( addForce, worldPoint, wake ){
	    var pos = this.position,
		force = this.force,
		fx = addForce.x, fy = addForce.y,
		px, py;
	    
	    worldPoint = worldPoint || pos;
	    
	    if( this.type === STATIC ) return;
	    if( wake && this.sleepState === SLEEPING ) this.wake();
	    
	    px = worldPoint.x - pos.x;
	    py = worldPoint.y - pos.y;
	    
	    force.x += fx;
	    force.y += fy;
	    
	    this.torque += px * fy - py * fx;
	};
	
	/**
	 * @method applyTorque
	 * @memberof PRigidBody2D
	 * @param Number torque
	 * @param Boolean wake
	 */
	PRigidBody2D.prototype.applyTorque = function( torque, wake ){
	    
	    if( this.type === STATIC ) return;
	    if( wake && this.sleepState === SLEEPING ) this.wake();
	    
	    this.torque += torque;
	};
	
	/**
	 * @method applyImpulse
	 * @memberof PRigidBody2D
	 * @param Vec2 impulse
	 * @param Vec2 worldPoint
	 * @param Boolean wake
	 */
	PRigidBody2D.prototype.applyImpulse = function( impulse, worldPoint, wake ){
	    var pos = this.position,
		invMass = this.invMass,
		velocity = this.velocity,
		ix = impulse.x, iy = impulse.y,
		px, py;
	    
	    worldPoint = worldPoint || pos;
	    
	    if( this.type === STATIC ) return;
	    if( wake && this.sleepState === SLEEPING ) this.wake();
	    
	    px = worldPoint.x - pos.x;
	    py = worldPoint.y - pos.y;
	    
	    velocity.x += ix * invMass;
	    velocity.y += iy * invMass;
	    
	    this.angularVelocity += ( px * iy - py * ix ) * this.invInertia;
	};
	
	
	PRigidBody2D.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.type = "PRigidbody2D";
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
	    
	    json.shape = this.shape.toJSON();
	    
	    json.rotation = this.rotation;
	    json.R = this.R;
	    
	    json.angularVelocity = this.angularVelocity;
	    
	    json.angularDamping = this.angularDamping;
	    
	    json.aabb = this.aabb;
	    json.aabbNeedsUpdate = this.aabbNeedsUpdate;
	    
	    json.inertia = this.inertia;
	    json.invInertia = this.invInertia;
	    
	    json.density = this.density;
	    
	    return json;
	};
	
	
	PRigidBody2D.prototype.fromJSON = function( json ){
	    
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
	    
	    this.shape = new objectTypes[ json.shape.type ];
	    this.shape.fromJSON( json.shape );
	    this.shape.body = this;
	    
	    this.rotation = json.rotation;
	    this.R.fromJSON( json.R );
	    
	    this.angularVelocity = json.angularVelocity;
	    
	    this.angularDamping = json.angularDamping;
	    
	    this.aabb.fromJSON( json.aabb );
	    this.aabbNeedsUpdate = json.aabbNeedsUpdate;
	    
	    this.inertia = json.inertia;
	    this.invInertia = json.invInertia;
	    
	    this.density = json.density;
	    
	    return this;
	};
	
        
        return PRigidBody2D;
    }
);