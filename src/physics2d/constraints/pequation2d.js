if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        /**
	 * @class PEquation2D
	 * @extends Class
	 * @brief 2d equation
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param Number minForce
	 * @param Number maxForce
	 */
	function PEquation2D( bi, bj, minForce, maxForce ){
	    
	    Class.call( this );
	    
	    /**
	    * @property PBody2D bi
	    * @memberof PEquation2D
	    */
	    this.bi = bi;
	    
	    /**
	    * @property PBody2D bj
	    * @memberof PEquation2D
	    */
	    this.bj = bj;
	    
	    /**
	    * @property Number minForce
	    * @brief min force of equation, used in solver
	    * @memberof PEquation2D
	    */
	    this.minForce = minForce !== undefined ? minForce : -1e6;
	    
	    /**
	    * @property Number maxForce
	    * @brief max force of equation, used in solver
	    * @memberof PEquation2D
	    */
	    this.maxForce = maxForce !== undefined ? maxForce : 1e6;
	    
	    /**
	    * @property Number stiffness
	    * @brief stiffness of the equation
	    * @memberof PEquation2D
	    */
	    this.stiffness = 1e7;
	    
	    /**
	    * @property Number relaxation
	    * @brief number of steps to relax this equation
	    * @memberof PEquation2D
	    */
	    this.relaxation = 5;
	    
	    /**
	    * @property Number a
	    * @memberof PEquation2D
	    */
	    this.a = 0;
	    
	    /**
	    * @property Number b
	    * @memberof PEquation2D
	    */
	    this.b = 0;
	    
	    /**
	    * @property Number eps
	    * @memberof PEquation2D
	    */
	    this.eps = 0;
	}
	
	Class.extend( PEquation2D, Class );
	
	/**
	 * @method calculateConstants
	 * @memberof PEquation2D
	 * @brief calculates a, b, and eps based on delta time
	 * @param Number h
	 */
	PEquation2D.prototype.calculateConstants = function( h ){
	    var d = this.relaxation,
		k = this.stiffness;
	    
	    this.a = 4 / ( h * ( 1 + 4 * d ) );
	    this.b = ( 4 * d ) / ( 1 + 4 * d );
	    this.eps = 4 / ( h * h * k * ( 1 + 4 * d ) );
	};
	
        
        return PEquation2D;
    }
);