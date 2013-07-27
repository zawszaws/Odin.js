if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/aabb2",
	"phys2d/bodies/pbody2d",
	"phys2d/shapes/pcircle2d"
    ],
    function( Class, Vec2, AABB2, PBody2D, PCircle2D ){
	"use strict";
	
	
	var STATIC = PBody2D.STATIC,
	    DYNAMIC = PBody2D.DYNAMIC,
	    KINEMATIC = PBody2D.KINEMATIC,
	    
	    AWAKE = PBody2D.AWAKE,
	    SLEEPY = PBody2D.SLEEPY,
	    SLEEPING = PBody2D.SLEEPING;
	
	/**
	 * @class Phys2D.PRigidbody2D
	 * @extends Phys2D.PBody2D
	 * @brief 2D body consisting of position and orientation
	 * @param Object opts sets Class properties from passed Object
	 */
	function PRigidbody2D( opts ){
	    opts || ( opts = {} );
	    
	    PBody2D.call( this, opts );
	    
	    /**
	    * @property Number rotation
	    * @memberof Phys2D.PRigidbody2D
	    */
	    this.rotation = opts.rotation || 0;
	    
	    /**
	    * @property Mat2 R
	    * @memberof Phys2D.PRigidbody2D
	    */
	    this.R = new Mat2().setRotation( this.rotation );
	    
	    /**
	    * @property Number velocity
	    * @memberof Phys2D.PRigidbody2D
	    */
	    this.angularVelocity = opts.angularVelocity || 0;
	    
	    /**
	    * @property Number angularDamping
	    * @memberof Phys2D.PRigidbody2D
	    */
	    this.angularDamping = opts.angularDamping || 0.01;
	    
	    /**
	    * @property Array shapes
	    * @memberof Phys2D.PRigidbody2D
	    */
	    this.shapes = [];
	    
	    /**
	    * @property Number I
	    * @memberof Phys2D.PRigidbody2D
	    */
	    this.I = 0;
	    this.invI = 0;
	    
	    /**
	    * @property Number torque
	    * @memberof Phys2D.PRigidbody2D
	    */
	    this.torque = 0;
	    
	    /**
	    * @property Number sleepAngularVelocity
	    * @memberof Phys2D.PRigidbody2D
	    * @brief if the angular velocity is smaller than this value, the body is considered sleepy
	    */
	    this.sleepAngularVelocity = opts.sleepAngularVelocity !== undefined ? opts.sleepAngularVelocity : 0.01;
	    
	    if( opts.shapes ) this.addShapes.apply( this, opts.shapes );
	}
        
	Class.extend( PRigidbody2D, PBody2D );
	
	/**
	 * @method addShapes
	 * @memberof Phys2D.PRigidbody2D
	 * @brief adds all shapes in arguments to shapes
	 */
	PRigidbody2D.prototype.addShapes = function(){
	    
	    for( var i = arguments.length; i--; ) this.addShape( arguments[i] );
	};
	
	/**
	 * @method addShape
	 * @memberof Phys2D.PRigidbody2D
	 * @param PShape2D shape
	 */
	PRigidbody2D.prototype.addShape = function( shape ){
	    if( !shape ){
		console.warn( this +".addShape: Shape is not defined");
		return;
	    }
	    
	    var shapes = this.shapes,
		index = shapes.indexOf( shape );
	    
	    if( index < 0 ){
		shapes.push( shape );
		shape.body = this;
		
		shape.init();
	    }
	    else{
		console.warn( this +".addShape: Shape is already added to body");
	    }
	    
	    this.calculateMass();
	};
	
	/**
	 * @method add
	 * @memberof Phys2D.PRigidbody2D
	 * @brief same as addShapes
	 */
	PRigidbody2D.prototype.add = PRigidbody2D.prototype.addShapes;
	
	/**
	 * @method removeShapes
	 * @memberof Phys2D.PRigidbody2D
	 * @brief adds all shapes in arguments to shapes
	 */
	PRigidbody2D.prototype.removeShapes = function(){
	    
	    for( var i = arguments.length; i--; ) this.removeShape( arguments[i] );
	};
	
	/**
	 * @method removeShape
	 * @memberof Phys2D.PRigidbody2D
	 * @param PShape2D shape
	 */
	PRigidbody2D.prototype.removeShape = function( shape ){
	    if( !shape ){
		console.warn( this +".addShape: Shape is not defined");
		return;
	    }
	    
	    var shapes = this.shapes,
		index = shapes.indexOf( shape );
	    
	    if( index > -1 ){
		shapes.splice( index, 1 );
		shape.body = undefined;
	    }
	    else{
		console.warn( this +".addShape: Shape is already added to body");
	    }
	    
	    this.calculateMass();
	};
	
	/**
	 * @method remove
	 * @memberof Phys2D.PRigidbody2D
	 * @brief same as addShapes
	 */
	PRigidbody2D.prototype.remove = PRigidbody2D.prototype.removeShapes;
	
	/**
	 * @method calculateMass
	 * @memberof Phys2D.PRigidbody2D
	 */
	PRigidbody2D.prototype.calculateMass = function(){
	    var shapes = this.shapes, shape,
		mass = 0, I = 0,
		i;
	    
	    for( i = shapes.length; i--; ){
		shape = shapes[i];
		shape.calculateMass();
		
		mass += shape.mass;
		I += shape.I;
	    }
	    
	    this.mass = mass;
	    this.invMass = 1 / mass;
	    
	    this.I = I;
	    this.invI = 1 / I;
	};
	
	/**
	 * @method sleepTick
	 * @memberof Phys2D.PRigidbody2D
	 */
	PRigidbody2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    vel = this.velocity.lenSq(),
		    aVel = this.angularVelocity * this.angularVelocity,
		    
		    sleepVel = this.sleepVelocity * this.sleepVelocity,
		    sleepAVel = this.sleepAngularVelocity * this.sleepAngularVelocity;
		
		if( sleepState === AWAKE && ( vel < sleepVel || aVel < sleepAVel ) ){
		    
		    this.sleepState = SLEEPY;
		    this._timeLastSleepy = time;
		}
		else if( sleepState === SLEEPY && ( vel > sleepVel || aVel > sleepAVel ) ){
		    
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this._timeLastSleepy ) > this.sleepyTimeLimit ){
		    
		    this.sleep();
		}
	    }
	};
	
	
	return PRigidbody2D;
    }
);