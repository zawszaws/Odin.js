if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2"
    ],
    function( Class, Vec2 ){
	"use strict";
	
	/**
	 * @class Phys2D.PContact2D
	 * @extends Class
	 * @brief 2D physics contact info
	 */
	function PContact2D(){
	    
	    Class.call( this );
	    
	    /**
	    * @property Phys2D.PBody2D bi
	    * @memberof Phys2D.PContact2D
	    */
	    this.bi = undefined;
	    
	    /**
	    * @property Phys2D.PBody2D bj
	    * @memberof Phys2D.PContact2D
	    */
	    this.bj = undefined;
	    
	    /**
	    * @property Vec2 n
	    * @memberof Phys2D.PContact2D
	    */
	    this.n = new Vec2;
	    
	    /**
	    * @property Vec2 point
	    * @memberof Phys2D.PContact2D
	    */
	    this.point = new Vec2;
	}
        
	Class.extend( PContact2D, Class );
	
	
	return PContact2D;
    }
);