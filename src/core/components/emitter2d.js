if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/vec2",
	"core/components/component"
    ],
    function( Class, Time, Vec2, Component ){
        "use strict";
	
        /**
	 * @class Emitter2D
	 * @extends Component
	 * @brief 2D Emitter Component
	 * @param Object opts sets Class properties from passed Object
	 */
        function Emitter2D( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
        }
        
	Class.extend( Emitter2D, Component );
	
	
	Emitter2D.prototype.init = function(){
	    
	};
	
	
	Emitter2D.prototype.update = function(){
	    
	};
	
        
        return Emitter2D;
    }
);