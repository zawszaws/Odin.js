if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/utils",
	"math/mathf",
	"math/vec2",
	"math/mat32"
    ],
    function( Class, Utils, Mathf, Vec2, Mat32 ){
        "use strict";
        
	var isNumber = Utils.isNumber,
	    EPSILON = Mathf.EPSILON,
	    standardRadian = Mathf.standardRadian;
	
	/**
	 * @class Transform2D
	 * @extends Class
	 * @brief 2d Transform info for Game Objects
	 * @param Object opts sets Class properties from passed Object
	 */
        function Transform2D( opts ){
            opts || ( opts = {} );
	    
            Class.call( this );
            
	    /**
	    * @property Class root
	    * @brief reference to root element
	    * @memberof Transform2D
	    */
            this.root = this;
            
	    /**
	    * @property Array children
	    * @brief array of children attached to this object
	    * @memberof Transform2D
	    */
            this.children = [];
            
	    /**
	    * @property Mat32 matrix
	    * @brief local matrix
	    * @memberof Transform2D
	    */
	    this.matrix = new Mat32;
	    
	    /**
	    * @property Mat32 matrixWorld
	    * @brief world matrix
	    * @memberof Transform2D
	    */
            this.matrixWorld = new Mat32;
	    
	    /**
	    * @property Mat32 matrixModelView
	    * @brief model view matrix, calculated in renderer
	    * @memberof Transform2D
	    */
            this.matrixModelView = new Mat32;
            
	    /**
	    * @property Vec2 position
	    * @brief local position
	    * @memberof Transform2D
	    */
	    this.position = opts.position instanceof Vec2 ? opts.position : new Vec2;
	    
	    /**
	    * @property Number rotation
	    * @brief local rotation
	    * @memberof Transform2D
	    */
	    this.rotation = !!opts.rotation ? opts.rotation : 0;
	    
	    /**
	    * @property Vec2 scale
	    * @brief local scale
	    * @memberof Transform2D
	    */
	    this.scale = opts.scale instanceof Vec2 ? opts.scale : new Vec2( 1, 1 );
	    
	    this._position = this.position.clone();
	    this._rotation = this.rotation;
	    this._scale = this.scale.clone();
	    
	    this.updateMatrices();
        }
        
	Class.extend( Transform2D, Class );
        
	/**
	 * @method copy
	 * @memberof Transform2D
	 * @brief copies other object's properties
	 * @param Transform2D other
	 */
        Transform2D.prototype.copy = function( other ){
	    var children = other.children,
		child, i;
	    
            this.children.length = 0;
            
	    for( i = children.length; i--; ){
		child = children[c];
		
		if( child ) this.add( child.clone() );
	    }
            
            this.root = other.root;
            
            this.position.copy( other.position );
            this.scale.copy( other.scale );
            this.rotation = other.rotation;
            
            this.updateMatrices();
            
            return this;
        };
        
        /**
	 * @method add
	 * @memberof Transform2D
	 * @brief adds all objects in arguments to children
	 */
        Transform2D.prototype.add = function(){
            var children = this.children,
                child, index, root,
                i;
            
            for( i = arguments.length; i--; ){
                child = arguments[i];
                index = children.indexOf( child );
                
                if( index === -1 && child instanceof Transform2D ){
                    
                    if( child.parent ){
                        child.parent.remove( child );
                    }
                    child.parent = this;
                    
                    children.push( child );
                
                    root = this;
                    
                    while( !!root.parent ){
                        root = root.parent;
                    }
                    child.root = root;
                    
                    child.trigger("add");
                    this.trigger("addChild", child );
                }
            }
            
            return this;
        };
        
        /**
	 * @method remove
	 * @memberof Transform2D
	 * @brief removes all objects in arguments from children
	 */
        Transform2D.prototype.remove = function(){
            var children = this.children,
                child, index,
                i;
            
            for( i = arguments.length; i--; ){
                child = arguments[i];
                index = children.indexOf( child );
                
                if( index !== -1 ){
                    
                    children.splice( index, 1 );
                    
                    child.parent = undefined;
                
                    root = this;
                    
                    while( !!root.parent ){
                        root = root.parent;
                    }
                    child.root = root;
                    
                    child.trigger("remove" );
                    this.trigger("removeChild", child );
                }
            }
            
            return this;
        };
	
	/**
	 * @method localToWorld
	 * @memberof Transform2D
	 * @brief converts vector from local to world coordinates
	 * @param Vec2 v
	 */
        Transform2D.prototype.localToWorld = function( v ){
	    
	    return v.applyMat32( this.matrixWorld );
	};
        
	/**
	 * @method worldToLocal
	 * @memberof Transform2D
	 * @brief converts vector from world to local coordinates
	 * @param Vec2 v
	 */
        Transform2D.prototype.worldToLocal = function(){
	    var mat = new Mat32;
	    
	    return function( v ){
		
		return v.applyMat32( mat.getInverse( this.matrixWorld ) );
	    };
	}();
	
	/**
	 * @method applyMat32
	 * @memberof Transform2D
	 * @brief applies Mat32 to Transform
	 * @param Mat32 matrix
	 */
	Transform2D.prototype.applyMat32 = function(){
	    var mat = new Mat32;
	    
	    return function( matrix ){
		
		this.matrix.mmul( matrix, this.matrix );
		
		this.scale.getScaleMat32( this.matrix );
		this.rotation = this.matrix.getRotation();
		this.position.getPositionMat32( this.matrix );
	    };
        }();
        
	/**
	 * @method translate
	 * @memberof Transform2D
	 * @brief translates Transform by translation relative to some object or if not set itself
	 * @param Vec2 translation
	 * @param Transform2D relativeTo
	 */
        Transform2D.prototype.translate = function(){
	    var vec = new Vec2,
		mat = new Mat32;
	    
	    return function( translation, relativeTo ){
		vec.copy( translation );
		
		if( relativeTo instanceof Transform2D ){
		    mat.setRotation( relativeTo.rotation );
		}
		else if( isNumber( relativeTo ) ){
		    mat.setRotation( relativeTo );
		}
		
		if( relativeTo ) vec.applyMat32( mat );
		
		this.position.add( vec );
	    };
        }();
        
        /**
	 * @method rotate
	 * @memberof Transform2D
	 * @brief rotates Transform by rotation relative to some object or if not set itself
	 * @param Number rotation
	 * @param Transform2D relativeTo
	 */
        Transform2D.prototype.rotate = function( angle, relativeTo ){
	    
	    if( relativeTo instanceof Transform2D ){
		angle += relativeTo.rotation;
	    }
	    else if( isNumber( relativeTo ) ){
		angle += relativeTo;
	    }
	    
	    if( relativeTo ) angle += relativeTo.rotation;
	    
	    this.rotation += angle;
        };
        
        /**
	 * @method rotate
	 * @memberof Transform2D
	 * @brief scales Transform by scale relative to some object or if not set itself
	 * @param Number scale
	 * @param Transform2D relativeTo
	 */
        Transform2D.prototype.scale = function(){
	    var vec = new Vec2,
		mat = new Mat32;
	    
	    return function( scale, relativeTo ){
		vec.copy( scale );
		
		if( relativeTo instanceof Transform2D ){
		    mat.setRotation( relativeTo.rotation );
		}
		else if( isNumber( relativeTo ) ){
		    mat.setRotation( relativeTo );
		}
		
		if( relativeTo ){
		    vec.applyMat32( mat );
		}
		
		this.scale.add( vec );
	    }
        }();
        
        /**
	 * @method rotateAround
	 * @memberof Transform2D
	 * @brief rotates Transform around point
	 * @param Vec2 point
	 * @param Number angle
	 */
        Transform2D.prototype.rotateAround = function(){
	    var point = new Vec2;
		
	    return function( point, angle ){
		
		point.copy( point ).sub( this.position );
		
		this.translate( point );
		this.rotate( angle );
		this.translate( point.inverse(), angle );
	    };
        }();
	
        /**
	 * @method lookAt
	 * @memberof Transform2D
	 * @brief makes Transform look at another Transform or point
	 * @param Transform2D target
	 */
        Transform2D.prototype.lookAt = function(){
	    var vec = new Vec2,
		mat = new Mat32;
	    
	    return function( target ){
		
		if( target instanceof Transform2D ){
		    vec.copy( target.position );
		}
		else{
		    vec.copy( target );
		}
		
		this.rotation = mat.lookAt( this.position, vec ).getRotation();
	    };
        }();
	
	/**
	 * @method follow
	 * @memberof Transform2D
	 * @brief makes Transform follow another Transform or point
	 * @param Transform2D target
	 * @param Number damping
	 * @param Transform2D relativeTo
	 */
	Transform2D.prototype.follow = function(){
	    var vec = new Vec2;
	    
	    return function( target, damping, relativeTo ){
		damping = damping ? damping : 1;
		
		if( target instanceof Transform2D ){
		    vec.vsub( target.position, this.position );
		}
		else if( target instanceof Vec2 ){
		    vec.vsub( target, this.position );
		}
		
		if( vec.lenSq() > EPSILON ){
		    this.translate( vec.smul( 1 / damping ), relativeTo );
		}
	    };
	}();
        
        /**
	 * @method updateMatrices
	 * @memberof Transform2D
	 * @brief update matrices
	 */
        Transform2D.prototype.updateMatrices = function(){
            var scale = this.scale,
		matrix = this.matrix,
		matrixWorld = this.matrixWorld;
	    
            matrix.setRotation( this.rotation );
	    
	    if( scale.x !== 1 || scale.y !== 1 ){
                matrix.scale( scale );
            }
	    
            matrix.setTranslation( this.position );
            
            if( this.root === this ){
                matrixWorld.copy( matrix );
            }
            else{
                matrixWorld.mmul( matrix, this.parent.matrixWorld );
            }
	    
	    if( !this._position.equals( this.position ) ) this.trigger("moved");
	    if( !this._scale.equals( scale ) ) this.trigger("scaled");
	    if( this._rotation !== this.rotation ) this.trigger("rotated");
        };
        
        
        Transform2D.prototype.toJSON = function(){
            var json = this._JSON,
		children = this.children, i;
	    
	    json.type = "Transform2D";
	    json._SERVER_ID = this._id;
	    json.children = json.children || [];
	    
	    for( i = children.length; i--; ){
		json.children[i] = children[i].toJSON();
	    }
	    
	    json.position = this.position;
	    json.rotation = this.rotation;
	    json.scale = this.scale;
	    
            return json;
        };
        
        
        Transform2D.prototype.fromJSON = function( json ){
	    var children = json.children,
		jsonObject, object,
		i;
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
	    for( i = children.length; i--; ){
		jsonObject = children[i];
		object = new Class.types[ jsonObject.type ];
		this.add( object.fromJSON( jsonObject ) );
	    }
	    
	    this.position.fromJSON( json.position );
	    this.rotation = json.rotation;
	    this.scale.fromJSON( json.scale );
	    
	    this.updateMatrices();
	    
	    return this;
        };
        
        
	return Transform2D;
    }
);