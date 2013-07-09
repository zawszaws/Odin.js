if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2"
    ],
    function( Class, Vec2 ){
	"use strict";
        
        var abs = Math.abs,
	    sqrt = Math.sqrt;
	
        /**
	 * @class Accelerometer
	 * @extends Class
	 * @brief Accelerometer helper
	 * @event accelerometer called when the device accelerometer changes
	 */
        function Accelerometer(){
            
            Class.call( this );
	    
            /**
	    * @property Number x
	    * @memberof Accelerometer
	    */
	    this.x = 0;
	    
            /**
	    * @property Number y
	    * @memberof Accelerometer
	    */
	    this.y = 0;
	    
            /**
	    * @property Number z
	    * @memberof Accelerometer
	    */
	    this.z = 0;
        };
        
	Class.extend( Accelerometer, Class );
	
	
        Accelerometer.prototype.handle_devicemotion = function( e ){
	    var x, y, z, len;
	    
            aig = e.accelerationIncludingGravity;
            
            if( aig ){
                x = aig.x,
                y = aig.y,
                z = aig.z
                
		len = x * x + y * y + z * z;
		
		if( len > 0 ){
		    len = 1 / sqrt( len );
		    
		    this.x = x * len;
		    this.y = y * len;
		    this.z = z * len;
		}
		else{
		    this.x = 0;
		    this.y = 0;
		    this.z = 0;
		}
		
                this.trigger("accelerometer");
            }
        };
	
	
	Accelerometer.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.x = this.x;
	    json.y = this.y;
	    json.z = this.z;
	    
	    return json;
	};
        
        
        return new Accelerometer;
    }
);