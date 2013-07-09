if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
        
        /**
	 * @class Orientation
	 * @extends Class
	 * @brief Orientation helper
	 * @event orientation called when orientation changes
	 * @event orientationchange called orientation mode changes ( landscape or portrait )
	 */
        function Orientation(){
            
            Class.call( this );
            
	    /**
	    * @property Number alpha
	    * @brief the alpha value
	    * @memberof Orientation
	    */
            this.alpha = 0;
	    
	    /**
	    * @property Number beta
	    * @brief the beta value
	    * @memberof Orientation
	    */
	    this.beta = 0;
	    
	    /**
	    * @property Number gamma
	    * @brief the gamma value
	    * @memberof Orientation
	    */
	    this.gamma = 0;
	    
	    /**
	    * @property Number mode
	    * @brief the mode of the orientation ( portrait_up, portrait_down, landscape_left, or landscape_right )
	    * @memberof Orientation
	    */
	    this.mode = "portrait_up";
        };
        
	Class.extend( Orientation, Class );
        
        
        Orientation.prototype.handleEvents = function( e ){
	    
            switch( e.type ){
                case "deviceorientation":
                    this.handle_deviceorientation( e );
                    break;
		
                case "orientationchange":
                    this.handle_orientationchange( e );
                    break;
            }
        };
        
        
        Orientation.prototype.handle_deviceorientation = function( e ){
            
            if( e.alpha !== undefined && e.beta !== undefined && e.gamma !== undefined ){
		
		this.alpha = e.alpha;
		this.beta = e.beta;
		this.gamma = e.gamma;
		
		this.trigger("orientation", this );
	    }
        };
        
        
        Orientation.prototype.handle_orientationchange = function( e ){
	    orientation = window.orientation;
	    
	    switch( orientation ){
		case 0:
		    this.mode = "portrait_up";
		    break;
		    
		case 90:
		    this.mode = "landscape_left";
		    break;
		    
		case -90:
		    this.mode = "landscape_right";
		    break;
		    
		case 180:
		case -180:
		    this.mode = "portrait_down";
		    break;
	    }
	    
	    this.trigger( "orientationchange", this.mode, orientation );
        };
	
	
	Orientation.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.alpha = this.alpha;
	    json.beta = this.beta;
	    json.gamma = this.gamma;
	    
	    json.mode = this.mode;
	    
	    return json;
	};
        
        
        return new Orientation;
    }
);