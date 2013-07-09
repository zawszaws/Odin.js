if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/psolver2d",
	"physics2d/constraints/pfriction2d",
	"physics2d/collision/pbroadphase2d",
	"physics2d/collision/pnearphase2d",
	"physics2d/shape/pshape2d",
	"physics2d/body/pparticle2d",
	"physics2d/body/pbody2d",
	"physics2d/body/prigidbody2d"
    ],
    function( Class, Mathf, Vec2, PSolver2D, PFriction2D, PBroadphase2D, PNearphase2D, PShape2D, PParticle2D, PBody2D, PRigidbody2D ){
        "use strict";
	
	var objectTypes = {
		PParticle2D: PParticle2D,
		PBody2D: PBody2D,
		PRigidbody2D: PRigidbody2D
	    },
	    pow = Math.pow,
	    min = Math.min,
	    clamp = Mathf.clamp,
	    
	    CIRCLE = PShape2D.CIRCLE,
	    BOX = PShape2D.BOX,
	    CONVEX = PShape2D.CONVEX,
	    
	    AWAKE = PParticle2D.AWAKE,
	    SLEEPY = PParticle2D.SLEEPY,
	    SLEEPING = PParticle2D.SLEEPING,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC,
	    
	    LOW = 0.000001, HIGH = 0.1, now,
	    frictionPool = [];
	
	
	var now = (function(){
	    var startTime = Date.now(),
		w = typeof window !== "undefined" ? window : {},
		performance = typeof w.performance !== "undefined" ? w.performance : {
		    now: function(){
			return Date.now() - startTime;
		    }
		};
	    
	    return function(){
		
		return performance.now() * 0.001;
	    }
	}());
	
        /**
	 * @class PWorld2D
	 * @extends Class
	 * @brief Physices manager for 2D Bodies
	 * @param Object opts sets Class properties from passed Object
	 */
	function PWorld2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Boolean allowSleep
	    * @brief global allowes bodies to sleep or not
	    * @memberof PWorld2D
	    */
	    this.allowSleep = opts.allowSleep !== undefined ? opts.allowSleep : true;
	    
	    this._time = 0;
	    
	    /**
	    * @property Array bodies
	    * @brief array of all bodies attached to this world
	    * @memberof PWorld2D
	    */
	    this.bodies = [];
	    
	    this.contacts = [];
	    this.frictions = [];
	    this.constraints = [];
	    
	    /**
	    * @property Array pairsi
	    * @brief array holding bodies i for check in nearphase
	    * @memberof PWorld2D
	    */
	    this.pairsi = [];
	    
	    /**
	    * @property Array pairsj
	    * @brief array holding bodies j for check in nearphase
	    * @memberof PWorld2D
	    */
	    this.pairsj = [];
	    
	    /**
	    * @property Vec2 gravity
	    * @brief world gravity defaults to Vec2( 0, -9.801 )
	    * @memberof PWorld2D
	    */
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    /**
	    * @property PSolver2D solver
	    * @brief world solver
	    * @memberof PWorld2D
	    */
	    this.solver = new PSolver2D( opts );
	    
	    /**
	    * @property PBroadphase2D broadphase
	    * @brief world broadphase handler
	    * @memberof PWorld2D
	    */
	    this.broadphase = new PBroadphase2D( opts );
	    
	    /**
	    * @property PNearphase2D nearphase
	    * @brief world nearphase handler
	    * @memberof PWorld2D
	    */
	    this.nearphase = new PNearphase2D;
	    
	    /**
	    * @property Boolean debug
	    * @brief world debug
	    * @memberof PWorld2D
	    */
	    this.debug = opts.debug !== undefined ? opts.debug : true;
	    
	    /**
	    * @property Object profile
	    * @brief world profile info, only calculated if debug is true
	    * @memberof PWorld2D
	    */
	    this.profile = {
		total: 0,
		solve: 0,
		integration: 0,
		broadphase: 0,
		nearphase: 0
	    };
	    
	    this._removeList = [];
	}
	
	Class.extend( PWorld2D, Class );
	
	/**
	 * @method add
	 * @memberof PWorld2D
	 * @brief adds body to world
	 */
	PWorld2D.prototype.add = function( body ){
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
		
	    if( index === -1 ){
		body.world = this;
		bodies.push( body );
		body.trigger("add");
	    }
	};
	
	/**
	 * @method remove
	 * @memberof PWorld2D
	 * @brief removes body from world
	 */
	PWorld2D.prototype.remove = function( body ){
	    
	    this._removeList.push( body );
	};
	
	
	PWorld2D.prototype._remove = function(){
	    var bodies = this.bodies,
		removeList = this._removeList,
		body, index, i, il;
	    
	    for( i = removeList.length; i--; ){
		body = removeList[i];
		index = bodies.indexOf( body );
		
		if( index !== -1 ){
		    bodies.splice( index, 1 );
		    body.trigger("remove");
		}
	    }
	    
	    removeList.length = 0;
	};
	
	/**
	 * @method addConstraint
	 * @memberof PWorld2D
	 * @brief adds constraint to world
	 */
	PWorld2D.prototype.addConstraint = function( constraint ){
	    var constraints = this.constraints,
		index = constraints.indexOf( constraint );
		
	    if( index === -1 ){
		constraints.push( constraint );
	    }
	};
	
	/**
	 * @method removeConstraint
	 * @memberof PWorld2D
	 * @brief removes constraint from world
	 */
	PWorld2D.prototype.removeConstraint = function( constraint ){
	    var constraints = this.constraints,
		index = constraints.indexOf( constraint );
		
	    if( index !== -1 ){
		constraints.splice( index, 1 );
	    }
	};
	
	/**
	 * @method step
	 * @memberof PWorld2D
	 * @brief step world forward by time,
	 * @param Number dt
	 */
	PWorld2D.prototype.step = function( dt ){
	    var debug = this.debug,
		profile = this.profile, profileStart, start = now(),
		
		gravity = this.gravity,
		gn = gravity.len(),
		bodies = this.bodies,
		solver = this.solver,
		solverEquations = solver.equations,
		pairsi = this.pairsi, pairsj = this.pairsj,
		contacts = this.contacts, frictions = this.frictions, constraints = this.constraints,
		c, bi, bj, um, umg, c1, c2,
		
		body, shape, shapeType, type, force, vel, aVel, linearDamping, pos, mass, invMass,
		i, j;
	    
	    this._time += dt < LOW ? LOW : dt > HIGH ? HIGH : dt;
	    
	    for( i = bodies.length; i--; ){
		body = bodies[i];
		force = body.force;
		mass = body.mass;
		
		if( body.type === DYNAMIC ){
		    force.x += gravity.x * mass;
		    force.y += gravity.y * mass;
		}
	    }
	    
	    if( debug ) profileStart = now();
	    
	    this.broadphase.collisionPairs( this, pairsi, pairsj );
	    
	    if( debug ) profile.broadphase = now() - profileStart;
	    
	    
	    if( debug ) profileStart = now();
	    
	    this.nearphase.collisions( this, pairsi, pairsj, contacts );
	    
	    for( i = frictions.length; i--; ){
		frictionPool.push( frictions[i] );
	    }
	    frictions.length = 0;
	    
	    for( i = contacts.length; i--; ){
		c = contacts[i];
		bi = c.bi; bj = c.bj;
		
		solverEquations.push( c );
		
		um = min( bi.friction, bj.friction );
		
		if( um > 0 ){
		    umg = um * gn;
		    mass = bi.invMass + bj.invMass;
		    mass = mass > 0 ? 1 / mass : 0;
		    
		    c1 = frictionPool.length ? frictionPool.pop() : new PFriction2D( bi, bj, umg * mass );
		    c2 = frictionPool.length ? frictionPool.pop() : new PFriction2D( bi, bj, umg * mass );
		    
		    frictions.push( c1, c2 );
		    
		    c1.bi = c2.bi = bi;
		    c1.bj = c2.bj = bj;
		    c1.minForce = c2.minForce = -umg * mass;
		    c1.maxForce = c2.maxForce = umg * mass;
		    
		    c1.ri.copy( c.ri );
		    c2.ri.copy( c.ri );
		    c1.rj.copy( c.rj );
		    c2.rj.copy( c.rj );
		    
		    c1.t.copy( c.n ).perpL();
		    c2.t.copy( c.n ).perpR();
		    
		    solverEquations.push( c1, c2 );
		}
	    }
	    
	    if( debug ) profile.nearphase = now() - profileStart;
	    
	    
	    if( debug ) profileStart = now();
	    
	    for( i = constraints.length; i--; ){
		c = constraints[i];
		c.update();
		
		for( j = c.equations.length; j--; ){
		    solverEquations.push( c.equations[j] );
		}
	    }
	    
	    solver.solve( this, dt );
	    solverEquations.length = 0;
	    
	    if( debug ) profile.solve = now() - profileStart;
	    
	    
	    if( debug ) profileStart = now();
	    
	    for( i = bodies.length; i--; ){
		body = bodies[i];
		
		shape = body.shape;
		shapeType = shape.type;
		
		type = body.type;
		force = body.force;
		vel = body.velocity;
		aVel = body.angularVelocity;
		linearDamping = body.linearDamping;
		pos = body.position;
		invMass = body.invMass;
		
		body.trigger("preStep");
		
		if( type === DYNAMIC || type === KINEMATIC ){
		    
		    vel.x *= pow( 1 - linearDamping.x, dt );
		    vel.y *= pow( 1 - linearDamping.y, dt );
		    
		    if( aVel !== undefined ) body.angularVelocity *= pow( 1 - body.angularDamping, dt );
		    
		    vel.x += force.x * invMass * dt;
		    vel.y += force.y * invMass * dt;
		    
		    if( aVel !== undefined ) body.angularVelocity += body.torque * body.invInertia * dt;
		    
		    if( body.sleepState !== SLEEPING ){
			pos.x += vel.x * dt;
			pos.y += vel.y * dt;
			
			if( aVel !== undefined ) body.rotation += aVel * dt;
			
			if( body.aabb ) body.aabbNeedsUpdate = true;
		    }
		}
		
		body.R.setRotation( body.rotation );
		
		force.x = 0;
		force.y = 0;
		
		if( body.torque ) body.torque = 0;
		
		if( this.allowSleep ) body.sleepTick( this._time );
		
		body.trigger("postStep");
	    }
	    
	    if( debug ) profile.integration = now() - profileStart;
	    
	    if( this._removeList.length ){
		this._remove();
	    }
	    
	    if( debug ) profile.total = now() - start;
	};
	
	
	PWorld2D.prototype.toJSON = function(){
	    var json = this._JSON,
		bodies = this.bodies,
		i;
	    
	    json.type = "PWorld2D";
	    json._SERVER_ID = this._id;
	    
	    json.allowSleep = this.allowSleep;
	    json.gravity = this.gravity;
	    json.debug = this.debug;
	    
	    json.bodies = json.bodies || [];
	    
	    for( i = bodies.length; i--; ){
		json.bodies[i] = bodies[i].toJSON();
	    }
	    
	    return json;
	};
	
	
	PWorld2D.prototype.fromJSON = function( json ){
	    var bodies = json.bodies,
		jsonObject, object, i;
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
	    this.allowSleep = json.allowSleep;
	    this.gravity.fromJSON( json.gravity );
	    this.debug = json.debug;
	    
	    for( i = bodies.length; i--; ){
		jsonObject = bodies[i];
		object = new objectTypes[ jsonObject.type ];
		this.add( object.fromJSON( jsonObject ) );
	    }
	    
	    return this;
	};
	
        
        return PWorld2D;
    }
);