if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
        /**
	 * @class Axis
	 * @extends Class
	 * @brief map each axis to two buttons on a joystick, mouse, or keyboard keys
	 */
        function Axis( opts ){
            opts || ( opts = {} );
	    
	    /**
	    * @property String name
	    * @memberof Axis
	    */
	    this.name = opts.name !== undefined ? opts.name : "unknown";
	    
	    /**
	    * @property String negButton
	    * @memberof Axis
	    */
	    this.negButton = opts.negButton !== undefined ? opts.negButton : "";
	    
	    /**
	    * @property String posButton
	    * @memberof Axis
	    */
	    this.posButton = opts.posButton !== undefined ? opts.posButton : "";
	    
	    /**
	    * @property String altNegButton
	    * @memberof Axis
	    */
	    this.altNegButton = opts.altNegButton !== undefined ? opts.altNegButton : "";
	    
	    /**
	    * @property String altPosButton
	    * @memberof Axis
	    */
	    this.altPosButton = opts.altPosButton !== undefined ? opts.altPosButton : "";
	    
	    /**
	    * @property Number gravity
	    * @memberof Axis
	    */
	    this.gravity = opts.gravity !== undefined ? opts.gravity : 3;
	    
	    /**
	    * @property Number dead
	    * @memberof Axis
	    */
	    this.dead = opts.dead !== undefined ? opts.dead : 0.001;
	    
	    /**
	    * @property Number sensitivity
	    * @memberof Axis
	    */
	    this.sensitivity = opts.sensitivity !== undefined ? opts.sensitivity : 3;
	    
	    /**
	    * @property Enum type
	    * @memberof Axis
	    */
	    this.type = opts.type !== undefined ? opts.type : -1;
	    
	    /**
	    * @property Number axis
	    * @memberof Axis
	    */
	    this.axis = opts.axis !== undefined ? opts.axis : "x";
	    
	    /**
	    * @property Number joyNum
	    * @memberof Axis
	    */
	    this.joyNum = opts.joyNum !== undefined ? opts.joyNum : 0;
	    
	    /**
	    * @property Number value
	    * @memberof Axis
	    */
	    this.value = 0;
        };
	
	
	Axis.BUTTON = 1;
	Axis.MOUSE = 2;
	Axis.MOUSE_WHEEL = 3;
	
        
        return Axis;
    }
);