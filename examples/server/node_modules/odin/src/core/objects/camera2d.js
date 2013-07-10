if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/mat32",
	"math/mat4",
	"core/objects/gameobject2d"
    ],
    function( Class, Mathf, Vec2, Mat32, Mat4, GameObject2D ){
        "use strict";
	
	var clampBottom = Mathf.clampBottom;
	
	/**
	 * @class Camera2D
	 * @extends GameObject2D
	 * @brief 2d Camera
	 * @param Object opts sets Class properties from passed Object
	 */
        function Camera2D( opts ){
	    opts || ( opts = {} );
	    
            GameObject2D.call( this, opts );
	    
	    /**
	    * @property Number width
	    * @brief width of camera
	    * @memberof Camera2D
	    */
	    this.width = 960;
	    
	    /**
	    * @property Number height
	    * @brief height of camera
	    * @memberof Camera2D
	    */
            this.height = 640;
            
	    /**
	    * @property Number aspect
	    * @brief width / height
	    * @memberof Camera2D
	    */
            this.aspect = this.width / this.height;
            
	    /**
	    * @property Number zoom
	    * @brief zoom amount
	    * @memberof Camera2D
	    */
            this.zoom = opts.zoom !== undefined ? opts.zoom : 1;
            
	    this._matrixProjection3D = new Mat4;
	    
	    /**
	    * @property Mat32 matrixProjection
	    * @brief projection matrix
	    * @memberof Camera2D
	    */
            this.matrixProjection = new Mat32;
	    
	    /**
	    * @property Mat32 matrixProjectionInverse
	    * @brief inverse projection matrix
	    * @memberof Camera2D
	    */
            this.matrixProjectionInverse = new Mat32;
            
	    /**
	    * @property Mat32 matrixWorldInverse
	    * @brief inverse matrix world, calculated in renderer
	    * @memberof Camera2D
	    */
            this.matrixWorldInverse = new Mat32;
            
	    /**
	    * @property Mat32 matrixWorldInverse
	    * @brief inverse matrix world, calculated in renderer
	    * @memberof Camera2D
	    */
            this.needsUpdate = true;
        }
        
	Class.extend( Camera2D, GameObject2D );
        
        /**
	 * @method copy
	 * @memberof Camera2D
	 * @brief copies other object's properties
	 * @param Camera2D other
	 */
        Camera2D.prototype.copy = function( other ){
            
	    GameObject2D.call( this, other );
	    
            this.width = other.width;
            this.height = other.height;
            
            this.aspect = other.aspect;
            
            this.zoom = other.zoom;
            
            this.matrixProjection.copy( other.matrixProjection );
            this.matrixProjectionInverse.copy( other.matrixProjectionInverse );
            
            this.matrixWorldInverse.copy( other.matrixWorldInverse );
            
            this.needsUpdate = other.needsUpdate;
            
            return this;
        };
        
        /**
	 * @method setSize
	 * @memberof Camera2D
	 * @brief sets width and height of camera
	 * @param Number width
	 * @param Number height
	 */
        Camera2D.prototype.setSize = function( width, height ){
            
            this.width = width !== undefined ? width : this.width;
            this.height = height !== undefined ? height : this.height;
            
            this.aspect = this.width / this.height
            
            this.needsUpdate = true;
        };
        
        /**
	 * @method setZoom
	 * @memberof Camera2D
	 * @brief sets zoom amount
	 * @param Number zoom
	 */
        Camera2D.prototype.setZoom = function( zoom ){
            
            this.zoom = zoom !== undefined ? zoom : this.zoom;
            
	    this.trigger("zoom");
            this.needsUpdate = true;
        };
        
        /**
	 * @method zoomBy
	 * @memberof Camera2D
	 * @brief zooms by some amount
	 * @param Number zoom
	 */
        Camera2D.prototype.zoomBy = function( zoom ){
            
            this.zoom += zoom !== undefined ? zoom : 0;
            
	    this.trigger("zoom");
            this.needsUpdate = true;
        };
	
	/**
	 * @method updateMatrixProjection
	 * @memberof Camera2D
	 * @brief updates matrix projection
	 */
        Camera2D.prototype.updateMatrixProjection = function(){
	    var zoom = clampBottom( this.zoom, 0.001 ),
		w = this.width, h = this.height,
		right = ( w * 0.5 ) * zoom,
		left = -right,
		top = ( h * 0.5 ) * zoom,
		bottom = -top;
	    
	    this.matrixProjection.orthographic( left, right, top, bottom );
            this.matrixProjectionInverse.minv( this.matrixProjection );
	    
	    this._matrixProjection3D.orthographic( left, right, top, bottom, -1, 1 );
	    
            this.needsUpdate = false;
        };
        
        /**
	 * @method update
	 * @memberof Camera2D
	 * @brief called in Scence2D.update
	 */
        Camera2D.prototype.update = function(){
            var components = this.components,
                type, component;
            
            this.trigger("update");
            
            for( type in components ){
                component = components[ type ];
                
                if( component && component.update ){
                    component.update();
                }
            }
            
            this.updateMatrices();
            
	    if( this.needsUpdate ){
                this.updateMatrixProjection();
            }
            
            this.matrixWorldInverse.minv( this.matrixWorld );
	    
            this.trigger("lateUpdate");
        };
        
        
        Camera2D.prototype.toJSON = function(){
            var json = this._JSON,
		children = this.children,
		components = this.components,
		tags = this.tags,
		i;
	    
	    json.type = "Camera2D";
	    json.name = this.name;
	    json._SERVER_ID = this._id;
	    json.children = json.children || [];
	    json.components = json.components || [];
	    json.tags = json.tags || [];
	    
	    for( i = children.length; i--; ){
		json.children[i] = children[i].toJSON();
	    }
	    for( i = components.length; i--; ){
		json.components[i] = components[i].toJSON();
	    }
	    for( i = tags.length; i--; ){
		json.tags[i] = tags[i];
	    }
	    
	    json.z = this.z;
	    
	    json.position = this.position;
	    json.rotation = this.rotation;
	    json.scale = this.scale;
	    
	    json.width = this.width;
	    json.height = this.height;
	    json.zoom = this.zoom;
	    
            return json;
        };
        
        
        Camera2D.prototype.fromJSON = function( json ){
	    var children = json.children,
		components = json.components,
		tags = json.tags,
		jsonObject, object,
		i;
	    
	    this.name = json.name;
	    this._SERVER_ID = json._SERVER_ID;
	    
	    for( i = children.length; i--; ){
		jsonObject = children[i];
		object = new Class.types[ jsonObject.type ];
		this.add( object.fromJSON( jsonObject ) );
	    }
	    for( i in components ){
		jsonObject = components[i];
		object = new Class.types[ jsonObject.type ];
		this.addComponent( object.fromJSON( jsonObject ) )
	    }
	    for( i = tags.length; i--; ){
		this.tags[i] = tags[i];
	    }
	    
	    this.z = json.z;
	    
	    this.position.fromJSON( json.position );
	    this.rotation = json.rotation;
	    this.scale.fromJSON( json.scale );
	    
	    this.zoom = json.zoom;
	    this.setSize( json.width, json.height );
	    
	    this.updateMatrices();
	    
	    return this;
        };
        
        
	return Camera2D;
    }
);