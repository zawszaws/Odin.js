if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/sharedobject",
	"core/gameobject",
	"core/world/world"
    ],
    function( Class, SharedObject, GameObject, World ){
        "use strict";
	
        /**
	 * @class Scene
	 * @extends SharedObject
	 * @brief Scene manager for GameObjects
	 * @param Object opts sets Class properties from passed Object
	 */
        function Scene( opts ){
	    opts || ( opts = {} );
	    
            SharedObject.call( this );
	    
	    /**
	    * @property Game game
	    * @brief reference to game Scene is a member of
	    * @memberof Scene
	    */
	    this.game = undefined;
	    
	    /**
	    * @property Array gameObjects
	    * @memberof Scene
	    */
	    this.gameObjects = [];
	    
	    /**
	    * @property Object components
	    * @brief list of component types within scene
	    * @memberof Scene
	    */
	    this.components = {};
	    
	    this.camera2d = undefined;
	    this.emitter2d = undefined;
	    this.rigidbody2d = undefined;
	    this.sprite2d = undefined;
	    this.transform2d = undefined;
	    
	    /**
	    * @property Object sortFunctions
	    * @brief list of component sort functions, defaults to sorting by reference
	    * @memberof Scene
	    */
	    this.sortFunctions = {
		Sprite2D: function( a, b ){
		    return b.z - a.z;
		}
	    };
	    
	    /**
	    * @property Object addFunctions
	    * @brief list of functions for conponents when a GameObject is added to scene
	    * @memberof Scene
	    */
	    this.addFunctions = {
		Rigidbody2D: function( component ){
		    return this.world.add( component );
		}
	    };
	    
	    /**
	    * @property Object removeFunctions
	    * @brief list of functions for conponents when a GameObject is removed from scene
	    * @memberof Scene
	    */
	    this.removeFunctions = {
		Rigidbody2D: function( component ){
		    return this.world.remove( component );
		}
	    };
	    
	    /**
	    * @property World world
	    * @memberof Scene
	    */
	    this.world = opts.world !== undefined ? opts.world : new World( opts );
	    
	    if( opts.gameObjects ) this.addGameObjects.apply( this, opts.gameObjects );
	}
        
	Class.extend( Scene, SharedObject );
	
	/**
	 * @method init
	 * @memberof Scene
	 * @brief called when added to Game
	 */
	Scene.prototype.init = function(){
	    var gameObjects = this.gameObjects,
		i;
	    
	    for( i = gameObjects.length; i--; ){
		gameObjects[i].init();
	    }
	    
	    this.trigger("init");
	};
	
	/**
	 * @method update
	 * @memberof Scene
	 * @brief called every frame
	 */
	Scene.prototype.update = function(){
	    var gameObjects = this.gameObjects,
		i;
	    
	    this.world.update();
	    
	    for( i = gameObjects.length; i--; ) gameObjects[i].update();
	    
	    this.trigger("update");
	};
	
	/**
	 * @method destroy
	 * @memberof Scene
	 * @brief removes this from Game
	 */
	Scene.prototype.destroy = function(){
	    var game = this.game;
	    
	    if( game ){
		game.removeScene( this );
	    }
	    else{
		console.warn( this +".destroy: Scene is not added to Game");
	    }
	    
	    this.trigger("destroy");
	};
	
	/**
	 * @method addGameObjects
	 * @memberof Scene
	 * @brief adds all GameObjects in arguments to Scene
	 */
	Scene.prototype.addGameObjects = function(){
	    
	    for( var i = arguments.length; i--; ) this.addGameObject( arguments[i] );
	};
	
	/**
	 * @method addGameObject
	 * @memberof Scene
	 * @brief adds GameObject to Scene
	 * @param GameObject gameObject
	 */
	Scene.prototype.addGameObject = function( gameObject ){
	    if( !gameObject ){
		console.warn( this +".addGameObject: GameObject is not defined");
		return;
	    }
	    
	    var gameObjects = this.gameObjects,
		index = gameObjects.indexOf( gameObject ),
		sortFunctions = this.sortFunctions, addFunctions = this.addFunctions,
		components = this.components, types, comps, comp, lowerCaseComp,
		key;
	    
	    if( index < 0 ){
		if( gameObject.scene ) gameObject.destroy();
		
		gameObject.scene = this;
		gameObjects.push( gameObject );
		
		if( this.game ){
		    gameObject.init();
		}
		
		comps = gameObject.components;
		
		for( key in comps ){
		    comp = comps[ key ];
		    lowerCaseComp = key.toLowerCase();
		    
		    types = ( components[ key ] = components[ key ] || [] );
		    types.push( comp );
		    
		    if( !sortFunctions[ key ] ) sortFunctions[ key ] = this.sort;
		    types.sort( sortFunctions[ key ] );
		    
		    if( !this[ lowerCaseComp ] ) this[ lowerCaseComp ] = types;
		    
		    if( addFunctions[ key ] ) addFunctions[ key ].call( this, comp );
		}
		
		this.trigger("addGameObject", gameObject );
	    }
	    else{
		console.warn( this +".addGameObject: GameObject is already added to Scene");
	    }
	};
	
	/**
	 * @method add
	 * @memberof Scene
	 * @brief same as addGameObjects
	 */
	Scene.prototype.add = Scene.prototype.addGameObjects;
	
	/**
	 * @method clear
	 * @memberof Scene
	 * @brief removes all GameObjects in Scene
	 */
	Scene.prototype.clear = function(){
	    var gameObjects = this.gameObjects,
		i;
	    
	    for( i = gameObjects.length; i--; ) this.removeGameObject( gameObjects[i] );
	};
	
	/**
	 * @method removeGameObjects
	 * @memberof Scene
	 * @brief removes all GameObjects in arguments from Scene
	 */
	Scene.prototype.removeGameObjects = function(){
	    
	    for( var i = arguments.length; i--; ) this.removeGameObject( arguments[i] );
	};
	
	/**
	 * @method removeGameObject
	 * @memberof Scene
	 * @brief removes GameObject from Scene
	 * @param GameObject gameObject
	 */
	Scene.prototype.removeGameObject = function( gameObject ){
	    if( !gameObject ){
		console.warn( this +".removeGameObject: GameObject is not defined");
		return;
	    }
	    
	    var gameObjects = this.gameObjects,
		index = gameObjects.indexOf( gameObject ),
		sortFunctions = this.sortFunctions, removeFunctions = this.removeFunctions,
		components = this.components, types, comps, comp,
		key;
	    
	    if( index > -1 ){
		gameObject.scene = undefined;
		gameObjects.splice( index, 1 );
		
		comps = gameObject.components;
		
		for( key in comps ){
		    comp = comps[ key ];
		    types = ( components[ key ] = components[ key ] || [] );
		    types.splice( types.indexOf( comp ), 1 );
		    
		    types.sort( sortFunctions[ key ] );
		    
		    if( removeFunctions[ key ] ) removeFunctions[ key ].call( this, comp );
		}
		
		this.trigger("removeGameObject", gameObject );
	    }
	    else{
		console.warn( this +".removeGameObject: GameObject is not a member of Scene");
	    }
	};
	
	/**
	 * @method remove
	 * @memberof Scene
	 * @brief same as removeGameObjects
	 */
	Scene.prototype.remove = Scene.prototype.removeGameObjects;
	
	/**
	 * @method sort
	 * @memberof Scene
	 * @brief default sort function for all components
	 */
	Scene.prototype.sort = function( a, b ){
	    
	    return a === b ? 1 : -1;
	};
	
	/**
	 * @method findByTag
	 * @memberof Scene
	 * @brief finds GameObjects by tag
	 * @param String tag
	 * @param Array results
	 * @return Array
	 */
	Scene.prototype.findByTag = function(){
	    var array = [];
	    
	    return function( tag, results ){
		array.length = 0;
		results || ( results = array );
		
		var gameObjects = this.gameObjects,
		    gameObject, i;
		
		for( i = gameObjects.length; i--; ){
		    gameObject = gameObjects[i];
		    
		    if( gameObject.hasTag( tag ) ) results.push( gameObject );
		}
		
		return results;
	    };
	}();
	
	/**
	 * @method findById
	 * @memberof Scene
	 * @brief finds GameObject by id
	 * @param Number id
	 * @return GameObject
	 */
	Scene.prototype.findById = function( id ){
	    var gameObjects = this.gameObjects,
		gameObject, i;
	    
	    for( i = gameObjects.length; i--; ){
		gameObject = gameObjects[i];
		
		if( gameObject._id == id ) return gameObject;
	    }
	    
	    return undefined;
	};
	
	/**
	 * @method findByServerId
	 * @memberof Scene
	 * @brief finds GameObject by ServerGame's id
	 * @param Number id
	 * @return GameObject
	 */
	Scene.prototype.findByServerId = function( id ){
	    var gameObjects = this.gameObjects,
		gameObject, i;
	    
	    for( i = gameObjects.length; i--; ){
		gameObject = gameObjects[i];
		
		if( gameObject._SERVER_ID == id ) return gameObject;
	    }
	    
	    return undefined;
	};
	
	/**
	 * @method findComponentById
	 * @memberof Scene
	 * @brief finds Component by id
	 * @param String type
	 * @param Number id
	 * @return GameObject
	 */
	Scene.prototype.findComponentById = function( type, id ){
	    var components = this[ type ], component,
		i;
	    
	    if( !components ) return undefined;
	    
	    for( i = components.length; i--; ){
		component = components[i];
		
		if( component._id == id ) return component;
	    }
	    
	    return undefined;
	};
	
	/**
	 * @method findComponentByServerId
	 * @memberof Scene
	 * @brief finds Component by ServerGame's id
	 * @param String type
	 * @param Number id
	 * @return GameObject
	 */
	Scene.prototype.findComponentByServerId = function( type, id ){
	    var components = this[ type ], component,
		i;
	    
	    if( !components ) return undefined;
	    
	    for( i = components.length; i--; ){
		component = components[i];
		
		if( component._SERVER_ID == id ) return component;
	    }
	    
	    return undefined;
	};
	
	
	Scene.prototype.serverSync = function(){
	    var sync = this._SYNC,
		transform2d = this.transform2d, transform,
		camera2d = this.camera2d, camera,
		i;
	    
	    sync.transform2d = sync.transform2d || {};
	    for( i = transform2d.length; i--; ){
		transform = transform2d[i];
		sync.transform2d[ transform._id ] = transform.serverSync();
	    }
	    
	    sync.camera2d = sync.camera2d || {};
	    for( i = camera2d.length; i--; ){
		camera = camera2d[i];
		sync.camera2d[ camera._id ] = camera.serverSync();
	    }
	    
	    return sync;
	};
	
	
	Scene.prototype.clientSync = function( sync ){
	    var transform2d = sync.transform2d, transform, t,
		camera2d = sync.camera2d, camera, c,
		i;
	    
	    for( i in transform2d ){
		transform = transform2d[i];
		t = this.findComponentByServerId("transform2d", i );
		if( t ) t.clientSync( transform );
	    }
	    
	    for( i in camera2d ){
		camera = camera2d[i];
		c = this.findComponentByServerId("camera2d", i );
		if( c ) c.clientSync( camera );
	    }
	};
	
	
	Scene.prototype.toJSON = function(){
	    var json = this._JSON,
		gameObjects = this.gameObjects,
		i;
	    
	    json._class = this._class;
	    json._SERVER_ID = this._id;
	    
	    json.gameObjects = json.gameObjects || [];
	    json.gameObjects.length = 0;
	    
	    for( i = gameObjects.length; i--; ){
		json.gameObjects[i] = gameObjects[i].toJSON();
	    }
	    
	    return json;
	};
	
	
	Scene.prototype.fromJSON = function( json ){
	    var gameObjects = json.gameObjects,
		i;
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
	    for( i = gameObjects.length; i--; ){
		this.addGameObject( new GameObject().fromJSON( gameObjects[i] ) );
	    }
	    
	    return this;
	};
	
        
        return Scene;
    }
);