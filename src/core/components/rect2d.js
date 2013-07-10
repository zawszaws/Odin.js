if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"core/components/renderable2d",
    ],
    function( Class, Vec2, Renderable2D ){
        "use strict";
	
        /**
	 * @class Rect2D
	 * @extends Renderable2D
	 * @brief 2D Rectangle Component
	 * @param Object opts sets Class properties from passed Object
	 */
        function Rect2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this, opts );
	    
	    /**
	    * @property Vec2 extents
	    * @brief half extents of the rect
	    * @memberof Rect2D
	    */
	    this.extents = opts.extents instanceof Vec2 ? opts.extents : new Vec2( 0.5, 0.5 );
	    this.calculateRect();
        }
        
	Class.extend( Rect2D, Renderable2D );
        
	
	Rect2D.prototype.copy = function( other ){
	    
	    Renderable2D.call( this, other );
	    
	    this.extents.copy( other.extents );
	    
	    return this;
	};
	
        
        Rect2D.prototype.toJSON = function(){
            var json = this._JSON;
	    
	    json.type = "Rect2D";
	    json._SERVER_ID = this._id;
	    
	    json.visible = this.visible;
	    json.offset = this.offset;
	    
	    json.alpha = this.alpha;
	    
	    json.fill = this.fill;
	    json.color = this.color;
	    
	    json.line = this.line;
	    json.lineColor = this.lineColor;
	    json.lineWidth = this.lineWidth;
	    
	    json.extents = this.extents;
	    
	    return json;
        };
        
        
        Rect2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
            this.visible = json.visible;
	    this.offset.fromJSON( json.offset );
	    
	    this.alpha = json.alpha;
	    
	    this.fill = json.fill;
	    this.color.fromJSON( json.color );
	    
	    this.line = json.line;
	    this.lineColor.fromJSON( json.lineColor );
	    this.lineWidth = json.lineWidth;
	    
	    this.extents.fromJSON( json.extents );
	    
	    this.calculateBox();
	    
	    return this;
        };
	
        
        return Rect2D;
    }
);