if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/components/renderable2d"
    ],
    function( Class, Renderable2D ){
        "use strict";
	
	var floor = Math.floor,
	    sqrt = Math.sqrt,
	    cos = Math.cos,
	    sin = Math.sin,
	    TWO_PI = Math.PI * 2;
	
        /**
	 * @class Circle2D
	 * @extends Renderable2D
	 * @brief 2D Circle Component
	 * @param Object opts sets Class properties from passed Object
	 */
        function Circle2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this, opts );
	    
	    /**
	    * @property Number radius
	    * @brief radius of the circle
	    * @memberof Circle2D
	    */
	    this.radius = opts.radius !== undefined ? opts.radius : 0.5;
	    this.calculateCircle();
        }
        
	Class.extend( Circle2D, Renderable2D );
        
	
	Circle2D.prototype.copy = function( other ){
	    
	    Renderable2D.call( this, other );
	    
	    this.radius = other.radius;
	    
	    return this;
	};
        
        
        Circle2D.prototype.toJSON = function(){
            var json = this._JSON;
	    
	    json.type = "Circle2D";
	    json._SERVER_ID = this._id;
	    
	    json.visible = this.visible;
	    json.offset = this.offset;
	    
	    json.alpha = this.alpha;
	    
	    json.fill = this.fill;
	    json.color = this.color;
	    
	    json.line = this.line;
	    json.lineColor = this.lineColor;
	    json.lineWidth = this.lineWidth;
	    
	    json.radius = this.radius;
	    
	    return json;
        };
        
        
        Circle2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
            this.visible = json.visible;
	    this.offset.fromJSON( json.offset );
	    
	    this.alpha = json.alpha;
	    
	    this.fill = json.fill;
	    this.color.fromJSON( json.color );
	    
	    this.line = json.line;
	    this.lineColor.fromJSON( json.lineColor );
	    this.lineWidth = json.lineWidth;
	    
	    this.radius = json.radius;
	    
	    this.calculateCircle();
	    
	    return this;
        };
	
        
        return Circle2D;
    }
);