if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/shape/pshape2d",
	"physics2d/shape/pconvex2d"
    ],
    function( Class, Vec2, PShape2D, PConvex2D ){
        "use strict";
	
	var sqrt = Math.sqrt;
	
        /**
	 * @class PRect2D
	 * @extends PConvex2D
	 * @brief Rectangle shape class
	 * @param Vec2 extents
	 */
	function PRect2D( extents ){
	    
	    /**
	    * @property Vec2 extents
	    * @memberof PShape2D
	    * @brief the half extents of rect
	    */
	    this.extents = extents instanceof Vec2 ? extents : new Vec2( 0.5, 0.5 );
	    
	    var x = this.extents.x, y = this.extents.y;
	    
	    var vertices = [
		new Vec2( x, y ),
		new Vec2( -x, y ),
		new Vec2( -x, -y ),
		new Vec2( x, -y ),
	    ]; 
	    
	    PConvex2D.call( this, vertices );
	    
	    this.type = PShape2D.RECT;
	    
	    this.calculateAABB();
	    this.calculateBoundingRadius();
	    this.calculateVolume();
	}
	
	Class.extend( PRect2D, PConvex2D );
	
	
	PRect2D.prototype.calculateAABB = function(){
	    var extents = this.extents,
		x = extents.x, y = extents.y,
		aabb = this.aabb, min = aabb.min, max = aabb.max;
	    
	    min.x = -x
	    min.y = -y;
	    max.x = x
	    max.y = y;
	};
	
	
	PRect2D.prototype.calculateInertia = function( mass ){
	    var extents = this.extents,
		w = extents.x * 2,
		h = extents.y * 2;
	    
	    return ( mass * ( w * w + h * h ) ) / 12;
	};
	
	
	PRect2D.prototype.calculateBoundingRadius = function(){
	    var extents = this.extents,
		x = extents.x, y = extents.y,
		l = x * x + y * y;
	    
	    this.boundingRadius = l !== 0 ? sqrt( l ) : 0;
	};
	
	
	PRect2D.prototype.calculateVolume = function(){
	    var extents = this.extents,
		w = extents.x * 2,
		h = extents.y * 2;
	    
	    this.volume = w * h;
	};
	
	
	PRect2D.prototype.toJSON = function(){
	    var json = this._JSON,
		vertices = this.vertices, normals = this.normals,
		i;
	    
	    json.type = "PRect2D";
	    json._SERVER_ID = this._id;
	    
	    json.shapeType = this.type;
	    
	    json.aabb = this.aabb;
	    json.volume = this.volume;
	    json.boundingRadius = this.boundingRadius;
	    
	    json.vertices = json.vertices || [];
	    json.normals = json.normals || [];
	    
	    for( i = vertices.length; i--; ){
		json.vertices[i] = vertices[i];
	    }
	    for( i = normals.length; i--; ){
		json.normals[i] = normals[i];
	    }
	    
	    json.extents = this.extents;
	    
	    return json;
	};
	
	
	PRect2D.prototype.fromJSON = function( json ){
	    var vertices = json.vertices, normals = json.normals,
		object, i;
	    
	    this.type = json.shapeType;
	    this._SERVER_ID = json._SERVER_ID;
	    
	    this.aabb.fromJSON( json.aabb );
	    this.volume = json.volume;
	    this.boundingRadius = json.boundingRadius;
	    
	    for( i = vertices.length; i--; ){
		this.vertices[i] = ( this.vertices[i] || new Vec2 ).copy( vertices[i] );
	    }
	    for( i = normals.length; i--; ){
		this.normals[i] = ( this.normals[i] || new Vec2 ).copy( normals[i] );
	    }
	    
	    this.extents = json.extents;
	    
	    return this;
	};
	
        
        return PRect2D;
    }
);