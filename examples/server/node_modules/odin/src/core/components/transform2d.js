if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/mat32",
	"math/mat4",
	"core/components/sharedcomponent"
    ],
    function( Class, Mathf, Vec2, Mat32, Mat4, SharedComponent ){
        "use strict";
	
	var EPSILON = Mathf.EPSILON,
	    lerp = Mathf.lerp;
	
	
        /**
	 * @class Transform2D
	 * @extends SharedComponent
	 * @brief position, rotation and scale of an object
	 * @param Object opts sets Class properties from passed Object
	 */
        function Transform2D( opts ){
	    opts || ( opts = {} );
	    
            SharedComponent.call( this );
	    
	    /**
	    * @property Transform2D root
	    * @brief reference to root transform
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
	    * @brief model view matrix
	    * @memberof Transform2D
	    */
	    this.matrixModelView = new Mat32;
	    this._modelViewNeedsUpdate = false;
            
	    /**
	    * @property Vec2 position
	    * @brief local position
	    * @memberof Transform2D
	    */
	    this.position = opts.position !== undefined ? opts.position : new Vec2;
	    
	    /**
	    * @property Vec2 scale
	    * @brief local scale
	    * @memberof Transform2D
	    */
	    this.scale = opts.scale !== undefined ? opts.scale : new Vec2( 1, 1 );
	    
	    /**
	    * @property Number rotation
	    * @brief local rotation
	    * @memberof Transform2D
	    */
	    this.rotation = opts.rotation !== undefined ? opts.rotation : 0;
	    
	    if( opts.children ) this.addChild.apply( this, opts.children );
	}
        
	Class.extend( Transform2D, SharedComponent );
	
	/**
	 * @method init
	 * @memberof Transform2D
	 * @brief called when added to GameObject
	 */
	Transform2D.prototype.init = function(){
	    
	    this.update();
	};
	
	/**
	 * @method update
	 * @memberof Transform2D
	 * @brief called every frame
	 */
	Transform2D.prototype.update = function(){
	    var scale = this.scale,
		matrix = this.matrix,
		matrixWorld = this.matrixWorld;
	    
            matrix.setRotation( this.rotation );
	    
	    if( scale.x !== 1 || scale.y !== 1 ) matrix.scale( scale );
	    
            matrix.setTranslation( this.position );
            
            if( this.root === this ){
                matrixWorld.copy( matrix );
            }
            else{
                matrixWorld.mmul( this.parent.matrixWorld, matrix );
            }
	    
	    this._modelViewNeedsUpdate = true;
	};
	
	/**
	 * @method predict
	 * @memberof Transform2D
	 * @brief called every frame, only in ClientGame
	 * @param Object state0
	 * @param Object state
	 * @param Number t
	 */
	Transform2D.prototype.predict = function( state0, state, t ){
	    
	    this.position.vlerp( state0.position, state.position, t );
	    this.scale.vlerp( state0.scale, state.scale, t );
	    this.rotation = lerp( state0.rotation, state.rotation, t );
	};
	
	/**
	 * @method updateModelView
	 * @memberof Transform2D
	 * @brief updates model view matrix
	 * @param Camera2D camera
	 */
	Transform2D.prototype.updateModelView = function( camera ){
	    
	    if( this._modelViewNeedsUpdate ){
		
		this.matrixModelView.mmul( this.matrixWorld, camera.matrixWorldInv );
		this._modelViewNeedsUpdate = false;
	    }
	};
	
	/**
	 * @method toWorld
	 * @memberof Transform2D
	 * @brief converts vector from local to world coordinates
	 * @param Vec2 v
	 */
        Transform2D.prototype.toWorld = function( v ){
	    
	    return v.applyMat32( this.matrixWorld );
	};
        
	/**
	 * @method toLocal
	 * @memberof Transform2D
	 * @brief converts vector from world to local coordinates
	 * @param Vec2 v
	 */
        Transform2D.prototype.toLocal = function(){
	    var mat = new Mat32;
	    
	    return function( v ){
		
		return v.applyMat32( mat.minv( this.matrixWorld ) );
	    };
	}();
        
	/**
	 * @method translate
	 * @memberof Transform2D
	 * @brief translates Transform2D by translation relative to some object or if not set itself
	 * @param Vec2 translation
	 * @param Transform2D relativeTo
	 */
        Transform2D.prototype.translate = function(){
	    var vec = new Vec2;
	    
	    return function( translation, relativeTo ){
		vec.copy( translation );
		
		if( relativeTo instanceof Transform2D ){
		    vec.rotate( relativeTo.rotation );
		}
		else if( relativeTo instanceof Number ){
		    vec.rotate( relativeTo );
		}
		
		this.position.add( vec );
	    };
        }();
        
        /**
	 * @method rotate
	 * @memberof Transform2D
	 * @brief rotates Transform2D by rotation relative to some object or if not set itself
	 * @param Number rotation
	 * @param Transform2D relativeTo
	 */
        Transform2D.prototype.rotate = function(){
	    var vec = new Vec2;
	    
	    return function( rotation, relativeTo ){
		vec.copy( rotation );
		
		if( relativeTo instanceof Transform2D ){
		    vec.rotate( relativeTo.rotation );
		}
		else if( relativeTo instanceof Number ){
		    vec.rotate( relativeTo );
		}
		
		this.rotation.rotate( vec.x, vec.y, vec.z );
	    };
        }();
        
        /**
	 * @method scale
	 * @memberof Transform2D
	 * @brief scales Transform2D by scale relative to some object or if not set itself
	 * @param Vec2 scale
	 * @param Transform2D relativeTo
	 */
        Transform2D.prototype.scale = function(){
	    var vec = new Vec2;
	    
	    return function( scale, relativeTo ){
		vec.copy( scale );
		
		if( relativeTo instanceof Transform2D ){
		    vec.rotate( relativeTo.rotation );
		}
		else if( relativeTo instanceof Number ){
		    vec.rotate( relativeTo );
		}
		
		this.scale.mul( vec );
	    };
        }();
	
        /**
	 * @method lookAt
	 * @memberof Transform2D
	 * @brief makes Transform2D look at another Transform2D or Vec2
	 * @param Vec2 target
	 * @param Vec2 up
	 */
        Transform2D.prototype.lookAt = function(){
	    var vec = new Vec2,
		mat = new Mat32;
	    
	    return function( target, up ){
		up = up instanceof Vec2 ? up : undefined;
		
		if( target instanceof Transform2D ){
		    vec.copy( target.position );
		}
		else if( target instanceof Vec2 ){
		    vec.copy( target );
		}
		
		mat.lookAt( this.position, vec, up );
		this.rotation.setRotationMat32( mat );
	    };
        }();
	
	/**
	 * @method follow
	 * @memberof Transform2D
	 * @brief makes Transform2D follow another Transform2D or Vec2
	 * @param Vec2 target
	 * @param Number damping
	 * @param Transform2D relativeTo
	 */
	Transform2D.prototype.follow = function(){
	    var vec = new Vec2;
	    
	    return function( target, damping, relativeTo ){
		damping = damping > 0 ? damping : 1;
		
		if( target instanceof Transform2D ){
		    vec.sub( target.position, this.position );
		}
		else if( target instanceof Vec2 ){
		    vec.sub( target, this.position );
		}
		
		if( vec.lenSq() > EPSILON ) this.translate( vec.smul( 1 / damping ), relativeTo );
	    };
	}();
        
        /**
	 * @method addChildren
	 * @memberof Transform2D
	 * @brief adds all Transform2Ds in arguments to children
	 */
        Transform2D.prototype.addChildren = function(){
	    
            for( i = arguments.length; i--; ) this.addChild( arguments[i] );
        };
        
        /**
	 * @method addChild
	 * @memberof Transform2D
	 * @brief adds Transform2D to children
	 */
        Transform2D.prototype.addChild = function( transform ){
	    if( !transform ){
		console.warn( this +".addTransform2D: Transform2D is not defined");
		return;
	    }
	    
	    var children = this.children,
		index = children.indexOf( transform ),
		root;
	    
	    if( index < 0 ){
		if( transform.parent ) transform.parent.remove( transform );
		
		transform.parent = this;
		children.push( transform );
		
		root = this;
		
		while( root.parent ){
		    root = root.parent;
		}
		transform.root = root;
	    }
	    else{
		console.warn( this +".addTransform2D: Transform2D already has child "+ transform );
	    }
        };
        
        /**
	 * @method add
	 * @memberof Transform2D
	 * @brief same as addChildren
	 */
        Transform2D.prototype.add = Transform2D.prototype.addChildren;
        
        /**
	 * @method removeChildren
	 * @memberof Transform2D
	 * @brief removes all Transform2Ds in arguments from children
	 */
        Transform2D.prototype.removeChildren = function(){
	    
            for( i = arguments.length; i--; ) this.removeChildren( arguments[i] );
        };
        
        /**
	 * @method removeChild
	 * @memberof Transform2D
	 * @brief removes Transform2D from children
	 */
        Transform2D.prototype.removeChild = function( transform ){
	    if( !transform ){
		console.warn( this +".removeTransform2D: Transform2D is not defined");
		return;
	    }
	    
	    var children = this.children,
		index = children.indexOf( transform ),
		root;
	    
	    if( index > -1 ){
		transform.parent = undefined;
		children.splice( index, 1 );
		
		root = this;
		
		while( root.parent ){
		    root = root.parent;
		}
		transform.root = root;
	    }
	    else{
		console.warn( this +".removeTransform2D: Transform2D does not have child "+ transform );
	    }
        };
        
        /**
	 * @method remove
	 * @memberof Transform2D
	 * @brief same as removeChildren
	 */
        Transform2D.prototype.remove = Transform2D.prototype.removeChildren;
        
        /**
	 * @method clear
	 * @memberof Transform2D
	 * @brief clears all data from transform and its children
	 */
        Transform2D.prototype.clear = function(){
	    var children = this.children, child,
		i;
	    
	    for( i = children.length; i--; ){
		child = children[i];
		
		if( child.children.length ) child.clear();
		
		this.removeChild( child );
	    }
	};
	
	
	Transform2D.prototype.serverSync = function(){
	    var sync = this._SYNC;
	    
	    sync._class = this._class;
	    sync._SERVER_ID = this._id;
	    
	    sync.position = this.position;
	    sync.scale = this.scale;
	    sync.rotation = this.rotation;
	    
	    return sync;
	};
	
	
	Transform2D.prototype.clientSync = function( sync ){
	    
	    this.position.copy( sync.position );
	    this.scale.copy( sync.scale );
	    this.rotation = sync.rotation;
	    
	    return this;
	};
	
	
	Transform2D.prototype.toJSON = function(){
	    var json = this._JSON,
		i;
	    
	    json._class = this._class;
	    json._SERVER_ID = this._id;
	    
	    json.position = this.position;
	    json.scale = this.scale;
	    json.rotation = this.rotation;
	    
	    return json;
	};
	
	
	Transform2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
	    this.position.copy( json.position );
	    this.scale.copy( json.scale );
	    this.rotation = json.rotation;
	    
	    return this;
	};
	
        
        return Transform2D;
    }
);