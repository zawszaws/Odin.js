if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/utils",
	"core/scene/world2d"
    ],
    function( Class, Utils, World2D ){
        "use strict";
	
        /**
	 * @class Scene2D
	 * @extends Class
	 * @brief Scene manager for 2D GameObjects
	 * @param Object opts sets Class properties from passed Object
	 */
        function Scene2D( opts ){
	    opts || ( opts = {} );
            
            Class.call( this );
            
	    /**
	    * @property String name
	    * @brief name of this Object
	    * @memberof Scene2D
	    */
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
	    /**
	    * @property Array children
	    * @brief array of all children attached to scene
	    * @memberof Scene2D
	    */
            this.children = [];
	    
            this._renderables = [];
            this._rigidbodies = [];
            this._cameras = [];
	    
	    /**
	    * @property World2D world
	    * @brief World Class
	    * @memberof Scene2D
	    */
            this.world = opts.world instanceof World2D ? opts.world : new World2D( opts );
            
            this.add.apply( this, opts.children );
        }
        
	Class.extend( Scene2D, Class );
        
        /**
	 * @method forEach
	 * @memberof Scene2D
	 * @brief calls function on each child in scene
	 * @param Function callback function to be called on each child
	 */
        Scene2D.prototype.forEach = function( callback ){
            var children = this.children, i;
            
            for( i = children.length; i--; ){
                callback( children[i] );
            }
        };
        
        /**
	 * @method add
	 * @memberof Scene2D
	 * @brief adds all Objects in arguments to scene
	 */
        Scene2D.prototype.add = function(){
            var children = this.children,
                child, index, i;
            
            for( i = arguments.length; i--; ){
                child = arguments[i];
                index = children.indexOf( child );
		
                if( index === -1 ){
		    
		    child.scene = this;
		    
		    children.push( child );
		    
		    if( child.children.length > 0 ){
			this.add.apply( this, child.children );
		    }
		    
		    this._add( child );
		    
		    child.trigger("addToScene");
		    this.trigger("addGameObject", child );
		    
		    child.init();
                }
                else{
                    console.warn("Scene2D.add: "+ child.name +" is already added to scene");
                }
            }
        };
        
        /**
	 * @method remove
	 * @memberof Scene2D
	 * @brief removes all Objects in arguments from scene
	 */
        Scene2D.prototype.remove = function(){
            var children = this.children,
                child, index, i;
            
            for( i = arguments.length; i--; ){
                child = arguments[i];
                index = children.indexOf( child );
                
                if( index !== -1 ){
                    
                    child.scene = undefined;
                    
                    children.splice( index, 1 );
                    
                    if( child.children.length > 0 ){
                        this.remove.apply( this, child.children );
		    }
		    
		    this._remove( child );
                    
		    child.trigger("removeFromScene");
		    this.trigger("removeGameObject", child );
                }
                else{
                    console.warn("Scene2D.remove: "+ child +" is not in scene");
                }
            }
        };
        
        /**
	 * @method clear
	 * @memberof Scene2D
	 * @brief removes all Objects from scene
	 */
        Scene2D.prototype.clear = function(){
            var children = this.children,
                child, index, i;
            
            for( i = children.length; i--; ){
                child = children[i];
                child.scene = undefined;
                children.splice( i, 1 );
		
		if( child.children.length > 0 ){
		    this.remove.apply( this, child.children );
		}
		
		this._remove( child );
                
		child.trigger("removeFromScene");
		this.trigger("removeGameObject", child );
            }
        };
        
	
	Scene2D.prototype._add = function( gameObject ){
	    var renderable = (
		    gameObject.getComponent("Sprite2D") ||
		    gameObject.getComponent("Box2D") ||
		    gameObject.getComponent("Circle2D") ||
		    gameObject.getComponent("Poly2D")
		),
		rigidbody2d = gameObject.getComponent("RigidBody2D");
	    
	    if( renderable ){
		this._renderables.push( renderable );
		this._renderables.sort( this.sort );
	    }
	    if( rigidbody2d ){
		this._rigidbodies.push( rigidbody2d );
		this.world.add( rigidbody2d );
	    }
	    if( gameObject.matrixProjection ){
		this._cameras.push( gameObject );
	    }
	};
        
	
	Scene2D.prototype._remove = function( gameObject ){
	    var renderable = (
		    gameObject.getComponent("Sprite2D") ||
		    gameObject.getComponent("Box2D") ||
		    gameObject.getComponent("Circle2D") ||
		    gameObject.getComponent("Poly2D")
		),
		rigidbody2d = gameObject.getComponent("RigidBody2D"),
		index;
	    
	    if( renderable ){
		index = this._renderables.indexOf( renderable );
		this._renderables.splice( index, 1 );
		
		this._renderables.sort( this.sort );
	    }
	    if( rigidbody2d ){
		index = this._rigidbodies.indexOf( rigidbody2d );
		this._rigidbodies.splice( index, 1 );
		this.world.remove( rigidbody2d );
	    }
	    if( gameObject.matrixProjection ){
		index = this._cameras.indexOf( gameObject );
		this._cameras.splice( index, 1 );
	    }
	};
        
	
	Scene2D.prototype.sort = function( a, b ){
	    
	    return b.gameObject.z - a.gameObject.z;
	};
	
        /**
	 * @method findByTag
	 * @memberof Scene2D
	 * @brief finds Object by tag
	 * @param String tag
	 * @param Array results
	 */
        Scene2D.prototype.findByTag = function( tag, results ){
            results = results || [];
            
            var children = this.children,
                child, i;
            
            for( i = children.length; i--; ){
                child = children[i];
                
                if( child.hasTag( tag ) ){
                    results.push( child );
                }
            }
            
            return results;
        };
        
        /**
	 * @method findByName
	 * @memberof Scene2D
	 * @brief finds Object by name
	 * @param String name
	 */
        Scene2D.prototype.findByName = function( name ){
            var children = this.children,
                child, i;
            
            for( i = children.length; i--; ){
                child = children[i];
                
                if( child.name === name ) return child;
            }
            
            return undefined;
        };
        
        /**
	 * @method findById
	 * @memberof Scene2D
	 * @brief finds Object by id
	 * @param Number id
	 */
        Scene2D.prototype.findById = function( id ){
            var children = this.children,
                child, i;
            
            for( i = children.length; i--; ){
                child = children[i];
                
                if( child._id === id ) return child;
            }
            
            return undefined;
        };
        
        /**
	 * @method findByServerId
	 * @memberof Scene2D
	 * @brief finds Object by its Server ID
	 * @param Number id
	 */
        Scene2D.prototype.findByServerId = function( id ){
            var children = this.children,
                child, i;
            
            for( i = children.length; i--; ){
                child = children[i];
                
                if( child._SERVER_ID === id ) return child;
            }
            
            return undefined;
        };
        
        /**
	 * @method update
	 * @memberof Scene2D
	 * @brief updates all objects in scene
	 */
        Scene2D.prototype.update = function(){
            var children = this.children, i;
            
            this.trigger("update");
	    
	    this.world.update();
            
            for( i = children.length; i--; ){
                children[i].update();
            }
            
            this.trigger("lateUpdate");
        };
        
        
        Scene2D.prototype.toJSON = function(){
            var json = this._JSON,
		children = this.children,
		i;
	    
	    json.type = "Scene2D";
	    json.name = this.name;
	    json._SERVER_ID = this._id;
	    json.world = this.world.toJSON();
	    
	    json.children = json.children || [];
	    
	    for( i = children.length; i--; ){
		json.children[i] = children[i].toJSON();
	    }
	    
	    return json;
        };
        
        
        Scene2D.prototype.fromJSON = function( json ){
            var children = json.children,
		jsonObject, object,
		i;
	    
	    this.name = json.name;
	    this._SERVER_ID = json._SERVER_ID;
	    this.world.fromJSON( json.world );
	    
	    this.clear();
	    for( i = children.length; i--; ){
		jsonObject = children[i];
		object = new Class.types[ jsonObject.type ];
		this.add( object.fromJSON( jsonObject ) );
	    }
	    
	    return this;
        };
        
        
        return Scene2D;
    }
);