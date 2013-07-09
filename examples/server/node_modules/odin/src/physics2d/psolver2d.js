if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
	var abs = Math.abs;
	
        /**
	 * @class PSolver2D
	 * @extends Class
	 * @brief constraint equation Gauss-Seidel solver
	 * @param Object opts sets Class properties from passed Object
	 */
	function PSolver2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Array equations
	    * @brief equations to solve
	    * @memberof PSolver2D
	    */
	    this.equations = [];
	    
	    /**
	    * @property Number iterations
	    * @brief max number of iterations
	    * @memberof PSolver2D
	    */
	    this.iterations = opts.iterations !== undefined ? opts.iterations : 10;
	    
	    /**
	    * @property Number tolerance
	    * @brief global error tolerance
	    * @memberof PSolver2D
	    */
	    this.tolerance = opts.tolerance !== undefined ? opts.tolerance : 1e-6;
	}
	
	Class.extend( PSolver2D, Class );
	
	/**
	 * @method solve
	 * @memberof PSolver2D
	 * @brief sovles equations for world bodies
	 * @param PWorld2D world
	 * @param Number dt
	 */
	PSolver2D.prototype.solve = function(){
	    var lambdas = [], invCs = [], Bs = [];
	    
	    return function( world, dt ){
		var iterations = this.iterations,
		
		    tolerance = this.tolerance,
		    toleranceSq = tolerance * tolerance,
		    
		    equations = this.equations,
		    equationsLen = equations.length,
		    
		    bodies = world.bodies,
		    bodiesLen = bodies.length,
		    
		    B, invC, GWlambda, deltalambda, deltalambdaTotal, lambda,
		    
		    body, velocity, vlambda, c, i, iter;
		    
		if( equationsLen ){
		    
		    for( i = bodiesLen; i--; ){
			body = bodies[i];
			vlambda = body.vlambda;
			
			vlambda.x = 0;
			vlambda.y = 0;
			
			if( body.wlambda !== undefined ) body.wlambda = 0;
		    }
		    
		    
		    for( i = equationsLen; i--; ){
			c = equations[i];
			
			c.calculateConstants( dt );
			
			lambdas[i] = 0;
			Bs[i] = c.calculateB( dt );
			invCs[i] = 1 / c.calculateC();
		    }
		    
		    
		    for( iter = 0; iter < iterations; iter++ ){
			
			deltalambdaTotal = 0;
			
			for( i = equationsLen; i--; ){
			    c = equations[i];
			    
			    B = Bs[i];
			    invC = invCs[i];
			    lambda = lambdas[i];
			    GWlambda = c.calculateGWlambda();
			    deltalambda = invC * ( B - GWlambda - c.eps * lambda );
			    
			    if( lambda + deltalambda < c.minForce ){
				deltalambda = c.minForce - lambda;
			    }
			    else if( lambda + deltalambda > c.maxForce ){
				deltalambda = c.maxForce - lambda;
			    }
			    
			    lambdas[i] += deltalambda;
			    deltalambdaTotal += abs( deltalambda );
			    
			    c.addToWlambda( deltalambda );
			}
			
			if( deltalambdaTotal * deltalambdaTotal < toleranceSq ) break;
		    }
		    
		    
		    for( i = bodiesLen; i--; ){
			body = bodies[i];
			velocity = body.velocity;
			vlambda = body.vlambda;
			
			velocity.x += vlambda.x;
			velocity.y += vlambda.y;
			
			if( body.wlambda !== undefined ) body.angularVelocity += body.wlambda;
		    }
		}
		
		return iter;
	    };
	}();
	
	/**
	 * @method add
	 * @memberof PSolver2D
	 * @brief adds equation
	 * @param PEquation2D equation
	 */
	PSolver2D.prototype.add = function( equation ){
	    
	    this.equations.push( equation );
	};
	
	/**
	 * @method remove
	 * @memberof PSolver2D
	 * @brief removes equation
	 * @param PEquation2D equation
	 */
	PSolver2D.prototype.remove = function( equation ){
	    var equations = this.equations,
		idx = equations.indexOf( equation );
	    
	    if( idx !== -1 ){
		equations.splice( idx, equation );
	    }
	};
	
	/**
	 * @method clear
	 * @memberof PSolver2D
	 * @brief clears all equations
	 */
	PSolver2D.prototype.clear = function(){
	    
	    this.equations.length = 0;
	};
	
        
        return PSolver2D;
    }
);