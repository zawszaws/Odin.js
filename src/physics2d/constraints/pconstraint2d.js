if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        /**
	 * @class PConstraint2D
	 * @extends Class
	 * @brief 2d constraint
	 * @param PBody2D bi
	 * @param PBody2D bj
	 */
	function PConstraint2D( bi, bj ){
	    
	    Class.call( this );
	    
	    /**
	    * @property PBody2D bi
	    * @memberof PConstraint2D
	    */
	    this.bi = bi;
	    
	    /**
	    * @property PBody2D bj
	    * @memberof PConstraint2D
	    */
	    this.bj = bj;
	    
	    /**
	    * @property Array equations
	    * @memberof PConstraint2D
	    */
	    this.equations = [];
	}
	
	Class.extend( PConstraint2D, Class );
	
	/**
	 * @method update
	 * @memberof PConstraint2D
	 * @brief updates equations, called in PWorld2D.step
	 */
	PConstraint2D.prototype.update = function(){};
        
        return PConstraint2D;
    }
);