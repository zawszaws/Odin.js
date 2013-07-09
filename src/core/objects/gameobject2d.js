if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/objects/transform2d",
	"core/objects/camera2d",
	"core/components/box2d",
	"core/components/circle2d",
	"core/components/component",
	"core/components/poly2d",
	"core/components/renderable2d",
	"core/components/rigidbody2d",
	"core/components/sprite2d"
    ],
    function( Class, Transform2D, Camera2D, Box2D, Circle2D, Component, Poly2D, Renderable2D, RigidBody2D, Sprite2D ){
        "use strict";
	
	var objectTypes = {
		Transform2D: Transform2D,
		GameObject2D: GameObject2D,
		Camera2D: Camera2D,
		Box2D: Box2D,
		Circle2D: Circle2D,
		Component: Component,
		Poly2D: Poly2D,
		Renderable2D: Renderable2D,
		RigidBody2D: RigidBody2D,
		Sprite2D: Sprite2D
	    };
	
	/**
	 * @class GameObject2D
	 * @extends Transform2D
	 * @brief 2d GameObject
	 * @param Object opts sets Class properties from passed Object
	 */
        function GameObject2D( opts ){
	    opts || ( opts = {} );
	    
            Transform2D.call( this, opts );
            
	    /**
	    * @property String name
	    * @brief name of this GameObject
	    * @memberof GameObject2D
	    */
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
	    /**
	    * @property Number z
	    * @brief determines renderering order smaller numbers render in back
	    * @memberof GameObject2D
	    */
	    this.z = opts.z !== undefined ? opts.z : 0;
	    
	    /**
	    * @property Object userData
	    * @brief any extra custom data added
	    * @memberof GameObject2D
	    */
	    this.userData = opts.userData !== undefined ? opts.userData : {};
	    
	    /**
	    * @property Array tags
	    * @brief array of string names
	    * @memberof GameObject2D
	    */
            this.tags = [];
	    
	    /**
	    * @property Object components
	    * @brief object holding components attached to GameObject
	    * @memberof GameObject2D
	    */
            this.components = {};
            
	    /**
	    * @property Scene2D scene
	    * @brief reference to Scene this was added to
	    * @memberof GameObject2D
	    */
            this.scene = undefined;
	    
            this.add.apply( this, opts.children );
            this.addTag.apply( this, opts.tags );
            this.addComponent.apply( this, opts.components );
        }
        
	Class.extend( GameObject2D, Transform2D );
        
        /**
	 * @method copy
	 * @memberof GameObject2D
	 * @brief copies other object's properties
	 * @param GameObject2D other
	 */
        GameObject2D.prototype.copy = function( other ){
            var name, component, prop;
            
	    Transform2D.call( this, other );
	    
            this.name = this._class + this._id;
            
            this.tags.length = 0;
            this.addTag.apply( this, other.tags );
            
	    for( name in other.components ){
                component = other.components[ name ];
		this.addComponent( component.clone() );
            }
            
            if( other.scene ){
                other.scene.add( this );
            }
            
            return this;
        };
	
	/**
	 * @method init
	 * @memberof GameObject2D
	 * @brief called when added to scene
	 */
        GameObject2D.prototype.init = function(){
            var components = this.components,
                type, component;
                
            
            for( type in components ){
                component = components[ type ];
                
                if( component ){
                    component.init();
		    component.trigger("init");
                }
            }
            
            this.trigger("init");
        };
        
        /**
	 * @method addTag
	 * @memberof GameObject2D
	 * @brief adds all strings in arguments to tags
	 */
        GameObject2D.prototype.addTag = function(){
            var tags = this.tags,
                tag, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                tag = arguments[i];
                index = tags.indexOf( tag );
                
                if( index === -1 ){
                    tags.push( tag );
                }
            }
        };
        
        /**
	 * @method removeTag
	 * @memberof GameObject2D
	 * @brief removes all strings in arguments from tags
	 */
        GameObject2D.prototype.removeTag = function(){
            var tags = this.tags,
                tag, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                tag = arguments[a];
                index = tags.indexOf( tag );
                
                if( index !== -1 ){
                    tags.splice( index, 1 );
                }
            }
        };
        
        /**
	 * @method hasTag
	 * @memberof GameObject2D
	 * @brief checks if this GameObject has a tag
	 * @param String tag
	 */
        GameObject2D.prototype.hasTag = function( tag ){
	    
	    return this.tags.indexOf( tag ) !== -1;
        };
        
        /**
	 * @method addComponent
	 * @memberof GameObject2D
	 * @brief adds all components in arguments to components
	 */
        GameObject2D.prototype.addComponent = function(){
            var components = this.components,
                component, i;
	    
            for( i = arguments.length; i--; ){
                component = arguments[i];
                
                if( !components[ component._class ] ){
                    
		    if( component instanceof Component ){
			if( component.gameObject ){
			    component = component.clone();
			}
			
			components[ component._class ] = component;
			component.gameObject = this;
			
			this.trigger("addComponent", component );
			component.trigger("add", this );
		    }
		    else{
			console.warn("GameObject2D.addComponent: "+ component._class +" is not an instance of Component");
		    }
                }
		else{
		    console.warn("GameObject2D.addComponent: GameObject2D already has a "+ component._class +" Component");
		}
            }
        };
        
        /**
	 * @method removeComponent
	 * @memberof GameObject2D
	 * @brief removes all components in arguments from components
	 */
        GameObject2D.prototype.removeComponent = function(){
            var components = this.components,
                component, i;
            
            for( i = arguments.length; i--; ){
                component = arguments[i];
                
                if( components[ component._class ] ){
                    
                    component.gameObject = undefined;
                    components[ component._class ] = undefined;
                    
                    this.trigger("removeComponent", component );
                    component.trigger("remove", this );
                }
		else{
		    console.warn("GameObject2D.removeComponent: Component is not attached to GameObject2D");
		}
            }
        };
        
        /**
	 * @method hasComponent
	 * @memberof GameObject2D
	 * @brief checks if this GameObject has a Component
	 * @param String type
	 */
        GameObject2D.prototype.hasComponent = function( type ){
            
            return !!this.components[ type ];
        };
        
        /**
	 * @method getComponent
	 * @memberof GameObject2D
	 * @brief returns component with name
	 * @param String type
	 */
        GameObject2D.prototype.getComponent = function( type ){
            
            return this.components[ type ];
        };
        
        /**
	 * @method getComponents
	 * @memberof GameObject2D
	 * @brief returns all components attached to this GameObject
	 * @param Array results
	 */
        GameObject2D.prototype.getComponents = function( results ){
            results = results || [];
	    var key;
            
            for( key in this.components ){
                results.push( this.components[ key ] );
            }
            
            return results;
        };
        
        /**
	 * @method forEachComponent
	 * @memberof GameObject2D
	 * @brief for each component call a function
	 * @param Function callback
	 */
        GameObject2D.prototype.forEachComponent = function( callback ){
            var components = this.components,
                type, component;
                
            
            for( type in components ){
                component = components[ type ];
                
                if( component ){
                    callback( component );
                }
            }
        };
        
        /**
	 * @method update
	 * @memberof GameObject2D
	 * @brief called in Scence2D.update
	 */
        GameObject2D.prototype.update = function(){
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
            
            this.trigger("lateUpdate");
        };
        
        
        GameObject2D.prototype.toJSON = function(){
            var json = this._JSON,
		children = this.children,
		components = this.components,
		tags = this.tags,
		component, i;
	    
	    json.type = "GameObject2D";
	    json.name = this.name;
	    json._SERVER_ID = this._id;
	    json.children = json.children || [];
	    json.components = json.components || {};
	    json.tags = json.tags || [];
	    
	    for( i = children.length; i--; ){
		json.children[i] = children[i].toJSON();
	    }
	    for( i in components ){
		component = components[i];
		if( component._class !== "RigidBody2D" ) json.components[i] = component.toJSON();
	    }
	    for( i = tags.length; i--; ){
		json.tags[i] = tags[i];
	    }
	    
	    json.z = this.z;
	    
	    json.position = this.position;
	    json.rotation = this.rotation;
	    json.scale = this.scale;
	    
            return json;
        };
        
        
        GameObject2D.prototype.fromJSON = function( json ){
	    var children = json.children,
		components = json.components,
		tags = json.tags,
		jsonObject, object,
		i;
	    
	    this.name = json.name;
	    this._SERVER_ID = json._SERVER_ID;
	    
	    for( i = children.length; i--; ){
		jsonObject = children[i];
		object = new objectTypes[ jsonObject.type ];
		this.add( object.fromJSON( jsonObject ) );
	    }
	    for( i in components ){
		jsonObject = components[i];
		object = new objectTypes[ jsonObject.type ];
		this.addComponent( object.fromJSON( jsonObject ) )
	    }
	    for( i = tags.length; i--; ){
		this.tags[i] = tags[i];
	    }
	    
	    this.z = json.z;
	    
	    this.position.fromJSON( json.position );
	    this.rotation = json.rotation;
	    this.scale.fromJSON( json.scale );
	    
	    this.updateMatrices();
	    
	    return this;
        };
        
        
	return GameObject2D;
    }
);