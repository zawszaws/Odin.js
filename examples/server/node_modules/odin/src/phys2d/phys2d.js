if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function( require ){
	"use strict";
	
	/**
	 * @class Phys2D
	 * @brief holds 2d physics classes
	 */
	var Phys2D = {};
	
	
	Phys2D.PBody2D = require("phys2d/bodies/pbody2d");
	Phys2D.PRigidbody2D = require("phys2d/bodies/prigidbody2d");
	
	Phys2D.PBroadphase2D = require("phys2d/collision/pbroadphase2d");
	Phys2D.PContact2D = require("phys2d/collision/pcontact2d");
	Phys2D.PNearphase2D = require("phys2d/collision/pnearphase2d");
	
	Phys2D.PCircle2D = require("phys2d/shapes/pcircle2d");
	Phys2D.PShape2D = require("phys2d/shapes/pshape2d");
	
	Phys2D.PWorld2D = require("phys2d/pworld2d");
	
	
	return Phys2D;
    }
);