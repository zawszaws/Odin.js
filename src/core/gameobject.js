if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/sharedobject"
    ],
    function( Class, SharedObject ){
        "use strict";
	
        /**
	 * @class GameObject
	 * @extends SharedObject
	 * @brief Base class for all entities in scenes
	 * @param Object opts sets Class properties from passed Object
	 */
        function GameObject( opts ){
	    opts || ( opts = {} );
	    
            SharedObject.call( this );
	    
	    /**
	    * @property Scene scene
	    * @brief reference to scene GameObject is a member of
	    * @memberof GameObject
	    */
	    this.scene = undefined;
	    
	    /**
	    * @property Array tags
	    * @brief array of tags on this object
	    * @memberof GameObject
	    */
	    this.tags = [];
	    
	    /**
	    * @property Object components
	    * @brief holds all components attached to GameObject
	    * @memberof GameObject
	    */
	    this.components = {};
	    
	    this.camera2d = undefined;
	    this.emitter2d = undefined;
	    this.rigidbody2d = undefined;
	    this.sprite2d = undefined;
	    this.transform2d = undefined;
	    
	    if( opts.components ) this.addComponents.apply( this, opts.components );
	    if( opts.tags ) this.addTags.apply( this, opts.tags );
	}
        
	Class.extend( GameObject, SharedObject );
	
	/**
	 * @method init
	 * @memberof GameObject
	 * @brief called when added to Scene
	 */
	GameObject.prototype.init = function(){
	    var components = this.components,
		component, key;
	    
	    for( key in components ){
		component = components[ key ];
		component.init();
		component.trigger("init");
	    }
	    
	    this.trigger("init");
	};
	
	/**
	 * @method update
	 * @memberof GameObject
	 * @brief called every frame
	 */
	GameObject.prototype.update = function(){
	    var components = this.components,
		component, key;
	    
	    for( key in components ){
		component = components[ key ];
		component.update();
		component.trigger("update");
	    }
	    
	    this.trigger("update");
	};
	
	/**
	 * @method destroy
	 * @memberof GameObject
	 * @brief removes this from Scene
	 */
	GameObject.prototype.destroy = function(){
	    var scene = this.scene;
	    
	    if( scene ){
		scene.removeGameObject( this );
	    }
	    else{
		console.warn( this +".destroy: GameObject is not added to a Scene");
	    }
	    
	    this.trigger("destroy");
	};
	
	/**
	 * @method addComponents
	 * @memberof GameObject
	 * @brief adds all Components in arguments to GameObject
	 */
	GameObject.prototype.addComponents = function(){
	    
	    for( var i = arguments.length; i--; ) this.addComponent( arguments[i] );
	};
	
	/**
	 * @method addComponent
	 * @memberof GameObject
	 * @brief adds Component to GameObject
	 * @param Component component
	 */
	GameObject.prototype.addComponent = function( component ){
	    if( !component ){
		console.warn( this +".addComponent: Component is not defined");
		return;
	    }
	    
	    var components = this.components,
		type = component.toString(),
		index = components[ type ];
	    
	    if( !index ){
		if( component.gameObject ) component = component.clone();
		
		component.gameObject = this;
		components[ type ] = component;
		
		if( this.scene ){
		    component.init();
		    component.trigger("init");
		}
		
		this[ type.toLowerCase() ] = component;
	    }
	    else{
		console.warn( this +".addComponent: GameObject already has a "+ component );
	    }
	    
	    this.trigger("addComponent", component );
	};
	
	/**
	 * @method add
	 * @memberof GameObject
	 * @brief same as addComponents
	 */
	GameObject.prototype.add = GameObject.prototype.addComponents;
	
	/**
	 * @method removeComponents
	 * @memberof GameObject
	 * @brief removes all Components in arguments from GameObject
	 */
	GameObject.prototype.removeComponents = function(){
	    
	    for( var i = arguments.length; i--; ) this.removeComponent( arguments[i] );
	};
	
	/**
	 * @method removeComponent
	 * @memberof GameObject
	 * @brief removes Component from GameObject
	 * @param Component component
	 */
	GameObject.prototype.removeComponent = function( component ){
	    if( !component ){
		console.warn( this +".removeComponent: Component is not defined");
		return;
	    }
	    
	    var components = this.components,
		type = component.toString(),
		index = components[ type ];
	    
	    if( index ){
		component.gameObject = undefined;
		components[ type ] = undefined;
		
		this[ type.toLowerCase() ] = undefined;
	    }
	    else{
		console.warn( this +".removeComponent: GameObject does not have a "+ component );
	    }
	    
	    this.trigger("removeComponent", component );
	};
	
	/**
	 * @method remove
	 * @memberof GameObject
	 * @brief same as removeComponents
	 */
	GameObject.prototype.remove = GameObject.prototype.removeComponents;
	
	/**
	 * @method getComponent
	 * @memberof GameObject
	 * @brief gets Component
	 * @param String type
	 * @returns Component
	 */
	GameObject.prototype.getComponent = function( type ){
	    
	    return this.components[ type ];
	};
	
	/**
	 * @method hasComponent
	 * @memberof GameObject
	 * @brief checks if GameObject has Component type
	 * @param String type
	 * @returns Boolean
	 */
	GameObject.prototype.hasComponent = function( type ){
	    
	    return !!this.components[ type ];
	};
	
	/**
	 * @method addTags
	 * @memberof GameObject
	 * @brief adds all tags in arguments to GameObject
	 */
	GameObject.prototype.addTags = function(){
	    
	    for( var i = arguments.length; i--; ) this.addTag( arguments[i] );
	};
	
	/**
	 * @method addTag
	 * @memberof GameObject
	 * @brief adds tag to GameObject
	 * @param Component component
	 */
	GameObject.prototype.addTag = function( tag ){
	    if( !tag ){
		console.warn( this +".addTag: tag is not defined");
		return;
	    }
	    
	    var tags = this.tags,
		index = tags.indexOf( tag );
	    
	    if( index < 0 ) tags.push( tag );
	};
	
	/**
	 * @method removeTags
	 * @memberof GameObject
	 * @brief removes all tags in arguments from GameObject
	 */
	GameObject.prototype.removeTags = function(){
	    
	    for( var i = arguments.length; i--; ) this.removeTag( arguments[i] );
	};
	
	/**
	 * @method removeTag
	 * @memberof GameObject
	 * @brief removes tag from GameObject
	 * @param Component component
	 */
	GameObject.prototype.removeTag = function( tag ){
	    if( !tag ){
		console.warn( this +".removeTag: tag is not defined");
		return;
	    }
	    
	    var tags = this.tags,
		index = tags.indexOf( tag );
	    
	    if( index > -1 ) tags.splice( index, 1 );
	};
	
	/**
	 * @method hasTag
	 * @memberof GameObject
	 * @brief checks if GameObject has tag
	 * @param String tag
	 */
	GameObject.prototype.hasTag = function( tag ){
	    
	    return this.tags.indexOf( tag ) > -1;
	};
	
	/**
	 * @method clear
	 * @memberof GameObject
	 * @brief clears all tags and components from object
	 */
	GameObject.prototype.clear = function( type ){
	    var components = this.components,
		tags = this.tags,
		i;
	    
	    for( i = tags.length; i--; ) this.removeTag( tags[i] );
	    for( i in components ) this.removeComponent( components[i] );
	};
	
	
	GameObject.prototype.toJSON = function(){
	    var json = this._JSON,
		components = this.components, component,
		tags = this.tags,
		i;
	    
	    json._class = this._class;
	    json._SERVER_ID = this._id;
	    
	    json.components = json.components || [];
	    json.components.length = 0;
	    
	    for( i in components ){
		component = components[i];
		if( component instanceof SharedObject ) json.components.push( component.toJSON() );
	    }
	    
	    json.tags = json.tags || [];
	    json.tags.length = 0;
	    
	    for( i = tags.length; i--; ) json.tags[i] = tags[i];
	    
	    return json;
	};
	
	
	GameObject.prototype.fromJSON = function( json ){
	    var components = json.components, component,
		i;
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
	    for( i = components.length; i--; ){
		component = components[i];
		this.addComponent( new Class.types[ component._class ]().fromJSON( component ) );
	    }
	    
	    this.addTags.apply( this, json.tags );
	    
	    return this;
	};
	
        
        return GameObject;
    }
);