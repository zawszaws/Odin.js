if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"base/device",
	"core/input/input",
	"core/game/config",
	"core/game/game"
	
    ],
    function( Class, Time, Device, Input, Config, Game ){
	"use strict";
	
	
	var now = Time.now,
	    stamp = Time.stamp;
	
	/**
	 * @class ClientGame
	 * @extends Game
	 * @brief Client Game used to join ServerGame
	 * @param Object opts sets Class properties from passed Object
	 */
	function ClientGame( opts ){
	    opts || ( opts = {} );
	    
	    Game.call( this, opts );
	    
	    /**
	    * @property Number id
	    * @brief unique id of this client
	    * @memberof ClientGame
	    */
	    this.id = undefined;
	    
	    /**
	    * @property Number lag
	    * @memberof ClientGame
	    */
	    this.lag = 0.1;
	    
	    /**
	    * @property Object socket
	    * @brief reference to client's socket
	    * @memberof ClientGame
	    */
	    this.socket = undefined;
	    
	    
	    this._lerpTerm = 0;
	    this._state0 = {};
	    this._state = {};
	}
        
	Class.extend( ClientGame, Game );
	
	/**
	 * @method connect
	 * @memberof ClientGame
	 * @brief connects and syncs game with server
	 */
	ClientGame.prototype.connect = function(){
	    var self = this,
		states = this.states,
		socket, time, length,
		asset, serverObject,
		i;
	    
	    this.socket = socket = io.connect("http://"+ Config.host, { port: Config.port });
	    
	    socket.on("server_connection", function( id, assets ){
		self.id = id;
		socket.emit("client_connected", Device );
		
		Assets.fromJSON( assets );
		
		socket.on("server_syncScenes", function( scenes ){
		    
		    for( i = scenes.length; i--; ){
			self.addScene( new Scene().fromJSON( scenes[i] ) );
		    }
		    
		    socket.emit("client_syncScenes");
		    
		    Assets.load(function(){
			self.trigger("connect");
		    });
		});
		
		
		socket.on("server_addScene", function( scene ){
		    
		    self.addScene( new Scene().fromJSON( scene ) );
		});
		
		socket.on("server_addGameObject", function( scene_id, gameObject ){
		    var scene = self.findByServerId( scene_id );
		    if( !scene ) return;
		    
		    scene.addGameObject( new GameObject().fromJSON( gameObject ) );
		});
		
		socket.on("server_addComponent", function( scene_id, gameObject_id, component ){
		    var scene = self.findByServerId( scene_id );
		    if( !scene ) return;
		    
		    var gameObject = scene.findByServerId( gameObject_id );
		    if( !gameObject ) return;
		    
		    gameObject.addComponent( new Class.types[ gameObject._class ].fromJSON( gameObject ) );
		});
		
		
		socket.on("server_removeScene", function( scene_id ){
		    
		    self.removeScene( self.findByServerId( scene_id ) );
		});
		
		socket.on("server_removeGameObject", function( scene_id, gameObject_id ){
		    var scene = self.findByServerId( scene_id );
		    if( !scene ) return;
		    
		    scene.removeGameObject( scene.findByServerId( gameObject_id ) );
		});
		
		socket.on("server_removeComponent", function( scene_id, gameObject_id, componentType ){
		    var scene = self.findByServerId( scene_id );
		    if( !scene ) return;
		    
		    var gameObject = scene.findByServerId( gameObject_id );
		    if( !gameObject ) return;
		    
		    gameObject.removeComponent( gameObject.get( componentType ) );
		});
		
		
		socket.on("server_setScene", function( scene_id ){
		    
		    self.setScene( self.findByServerId( scene_id ) );
		});
		
		socket.on("server_setCamera", function( camera_id ){
		    if( !self.scene ) return;
		    
		    self.setCamera( self.scene.findByServerId( camera_id ) );
		});
		
		socket.on("server_syncInput", function(){
		    
		    socket.emit("client_syncInput", Input );
		});
		
		socket.on("server_syncScene", function( sync, timeStamp ){
		    
		    self._state0 = self._state || sync;
		    self._state = sync;
		    
		    self.lag = stamp() - timeStamp;
		    self._lerpTerm = 0;
		    
		    if( self.scene ) self.scene.clientSync( sync );
		});
	    });
	};
	
	/**
	 * @method update
	 * @memberof ClientGame
	 * @brief called every frame
	 */
	ClientGame.prototype.update = function(){
	    var scene = this.scene;
	    
	    if( scene ){
		Time.sinceSceneStart = now() - Time.sceneStart;
		
		this._lerpTerm += 10 * Time.delta;
		scene.predict( this._state0, this._state, this._lerpTerm );
		scene.update();
	    }
	};
	
	/**
	 * @method findByServerId
	 * @memberof ClientGame
	 * @brief finds Scene by ServerGame's id
	 * @param Number id
	 * @return Scene
	 */
	ClientGame.prototype.findByServerId = function( id ){
	    var scenes = this.scenes,
		scene, i;
	    
	    for( i = scenes.length; i--; ){
		scene = scenes[i];
		
		if( scene._SERVER_ID === id ) return scene;
	    }
	    
	    return undefined;
	};
	
	
	return ClientGame;
    }
);