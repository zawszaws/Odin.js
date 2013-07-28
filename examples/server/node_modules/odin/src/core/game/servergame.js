if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"require",
	"base/class",
	"base/time",
	"core/sharedobject",
	"core/game/config",
	"core/game/client"
    ],
    function( require, Class, Time, SharedObject, Config, Client ){
	"use strict";
	
	var now = Time.now,
	    stamp = Time.stamp,
	    MIN_DELTA = 0.000001, MAX_DELTA = 1,
	    
	    http = require("http"),
	    url = require("url"),
	    path = require("path"),
	    fs = require("fs"),
	    io = require("socket.io");
	
	
	function log(){
	    if( Config.debug ) console.log.apply( console, arguments );
	}
	
	/**
	 * @class ServerGame
	 * @extends Class
	 * @brief used for server side game
	 * @param Object opts sets Class properties from passed Object
	 * @event update called before update
	 * @event lateUpdate called after update
	 */
	function ServerGame( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    Config.host = opts.host !== undefined ? opts.host : Config.host;
	    Config.port = opts.port !== undefined ? opts.port : Config.port;
	    
	    Config.debug = opts.debug !== undefined ? !!opts.debug : Config.debug;
	    Config.forceCanvas = opts.forceCanvas !== undefined ? !!opts.forceCanvas : Config.forceCanvas;
	    
	    /**
	    * @property Config config
	    * @brief game config
	    * @memberof ServerGame
	    */
	    this.config = Config;
	    
	    /**
	    * @property Array scenes
	    * @brief game's list of all scenes
	    * @memberof ServerGame
	    */
	    this.scenes = [];
	    
	    /**
	    * @property Object clients
	    * @brief game's list of all clients
	    * @memberof ServerGame
	    */
	    this.clients = {};
	    
	    /**
	    * @property Object server
	    * @brief reference to http server
	    * @memberof ServerGame
	    */
	    this.server = http.createServer( this._onRequest.bind( this ) );
	    this.server.listen( Config.port, Config.host );
	    
	    /**
	    * @property Object io
	    * @brief reference to socket.io
	    * @memberof ServerGame
	    */
	    this.io = io.listen( this.server );
	    
	    
	    var self = this;
	    
	    this.io.configure(function(){
		self.io.set("log level", ( Config.debug ? 2 : 0 ) );
		
		self.io.set("authorization", function( handshakeData, callback ){
		    callback( null, true );
		});
	    });
	    
	    
	    this.io.sockets.on("connection", function( socket ){
		var clients = self.clients, client,
		    id = socket.id;
		
		socket.emit("server_connection", id, Assets );
		
		socket.on("client_connected", function( device ){
		    client = clients[ id ] = new Client({
			id: id,
			socket: socket,
			device: device,
			game: self
		    });
		    
		    socket.emit("server_syncScenes", self.scenes );
		    log("ServerGame: new Client id: "+ id +" user-agent: "+ device.userAgent );
		    
		    socket.on("disconnect", function(){
			self.trigger("client_disconnect", id );
			log("ServerGame: Client id: "+ id +" disconnected");
		    });
		    
		    socket.on("client_syncScenes", function(){
			self.trigger("client_init", id );
		    });
		    
		    socket.on("client_syncInput", function( Input, timeStamp ){
			var clientInput = client.Input;
			
			client.lag = stamp() - timeStamp;
			
			clientInput.buttons = Input.buttons;
			clientInput.mousePosition.copy( Input.mousePosition );
			clientInput.mouseDelta.copy( Input.mouseDelta );
			clientInput.mouseWheel = Input.mouseWheel;
			
			clientInput.touches = Input.touches;
		    });
		});
	    });
	    
	    if( opts.scenes ) this.addScenes.apply( this, opts.scenes );
	}
        
	Class.extend( ServerGame, Class );
	
	/**
	 * @method init
	 * @memberof ServerGame
	 * @brief call this to start game
	 */
	ServerGame.prototype.init = function(){
	    
	    this.trigger("init");
	    this.animate();
	    
	    log("Game started at "+ Config.host +":"+ Config.port );
	};
	
	/**
	 * @method update
	 * @memberof ServerGame
	 * @brief updates scenes and Time
	 */
	ServerGame.prototype.update = function(){
	    var scenes = this.scenes, scene,
		i;
	    
	    for( i = scenes.length; i--; ) scenes[i].update();
	};
	
	/**
	 * @method animate
	 * @memberof ServerGame
	 * @brief starts the game loop called in ServerGame.init
	 */
	ServerGame.prototype.animate = function(){
	    var frameCount = 0, last = 0, time = 0, delta = 0,
		lastUpdate = 0, timeStamp = 0;
		
	    return function(){
		var sockets = this.io.sockets,
		    clients = this.clients, client,
		    scenes = this.scenes, scene,
		    i;
		
		Time.frameCount = frameCount++;
		
		last = time;
		time = now();
		
		delta = ( time - last ) * Time.scale;
		Time.delta = delta < MIN_DELTA ? MIN_DELTA : delta > MAX_DELTA ? MAX_DELTA : delta;
		
		Time.time = time * Time.scale;
		Time.sinceStart = time;
		
		if( lastUpdate + 0.1 <= time ){
		    timeStamp = stamp();
		    
		    sockets.emit("server_syncInput", timeStamp );
		    lastUpdate = time;
		    
		    for( i in clients ){
			client = clients[i];
			if( client.scene ) client.socket.emit("server_syncScene", client.scene.serverSync(), timeStamp );
		    }
		}
		
		for( i in clients ) clients[i].update();
		
		this.update();
		
		setTimeout( this.animate.bind( this ), 1/60 );
	    };
	}();
        
        /**
	 * @method setScene
	 * @memberof ServerGame
	 * @brief sets client's active scene
	 * @param Client client
	 * @param Scene scene
	 */
        ServerGame.prototype.setScene = function( client, scene ){
	    if( !client ){
		console.warn( this +".setScene: Client is not defined");
		return;
	    }
	    if( !scene ){
		console.warn( this +".setCamera: Scene is not defined");
		return;
	    }
	    
            var index = this.scenes.indexOf( scene ),
		socket = this.io.sockets.sockets[ client.id ];
	    
	    if( index === -1 ){
		console.warn("ServerGame.setScene: scene not added to Game, adding it...");
		this.addScene( scene );
	    }
	    
	    client.scene = scene;
	    socket.emit("server_setScene", scene._id );
        };
        
        /**
	 * @method setCamera
	 * @memberof ServerGame
	 * @brief sets client's active camera from gameObjects camera2d or camera3d component
	 * @param Client client
	 * @param GameObject gameObject
	 */
        ServerGame.prototype.setCamera = function( client, gameObject ){
	    if( !client ){
		console.warn( this +".setCamera: Client is not defined");
		return;
	    }
	    if( !gameObject ){
		console.warn( this +".setCamera: GameObject is not defined");
		return;
	    }
	    if( !client.scene ){
		console.warn( this +".setCamera: Client needs an active Scene");
		return;
	    }
	    
            var scene = client.scene, camera,
		index = scene.gameObjects.indexOf( gameObject ),
		socket = this.io.sockets.sockets[ client.id ];
	    
	    if( index === -1 ){
		console.warn("ServerGame.setCamera: camera not added to scene, adding it...");
		scene.add( gameObject );
	    }
	    
	    camera = gameObject.camera2d || gameObject.camera3d;
	    
	    if( camera ){
		client.camera = camera;
		socket.emit("server_setCamera", gameObject._id );
	    }
	    else{
		console.warn( this +".setCamera: GameObject does not have a Camera2D or Camera3D Component");
	    }
        };
	
	/**
	 * @method addScenes
	 * @memberof ServerGame
	 * @brief adds all Scenes in arguments to Game
	 */
	ServerGame.prototype.addScenes = function(){
	    
	    for( var i = arguments.length; i--; ) this.addScene( arguments[i] );
	};
	
	/**
	 * @method addScene
	 * @memberof ServerGame
	 * @brief adds Scene to Game
	 * @param Scene scene
	 */
	ServerGame.prototype.addScene = function( scene ){
	    if( !scene ){
		console.warn( this +".addScene: scene is not defined");
		return;
	    }
	    
	    var sockets = this.io.sockets,
		scenes = this.scenes,
		index = scenes.indexOf( scene );
	    
	    if( index < 0 ){
		if( scene.game ) scene.destroy();
		
		scene.game = this;
		scenes.push( scene );
		
		scene.on("addGameObject", function( gameObject ){
		    
		    sockets.emit("server_addGameObject", scene._id, gameObject );
		    
		    gameObject.on("addComponent", function( component ){
			
			if( component instanceof SharedObject ) sockets.emit("server_addComponent", scene._id, gameObject._id, component );
		    });
		});
		
		scene.on("removeGameObject", function( gameObject ){
		    
		    gameObject.off("addComponent");
		    gameObject.off("removeComponent");
		    
		    sockets.emit("server_removeGameObject", scene._id, gameObject._id );
		    
		    gameObject.on("removeComponent", function( component ){
			
			if( component instanceof SharedObject ) sockets.emit("server_removeComponent", scene._id, gameObject._id, component._class );
		    });
		});
		
		sockets.emit("server_addScene", scene );
	    }
	    else{
		console.warn( this +".addScene: Scene is already added to Game");
	    }
	};
	
	/**
	 * @method add
	 * @memberof ServerGame
	 * @brief same as addScenes
	 */
	ServerGame.prototype.add = ServerGame.prototype.addScenes;
	
	/**
	 * @method removeScenes
	 * @memberof ServerGame
	 * @brief removes all Scenes in arguments from Game
	 */
	ServerGame.prototype.removeScenes = function(){
	    
	    for( var i = arguments.length; i--; ) this.removeScene( arguments[i] );
	};
	
	/**
	 * @method removeScene
	 * @memberof ServerGame
	 * @brief removes Scene from ServerGame
	 * @param Scene scene
	 */
	ServerGame.prototype.removeScene = function( scene ){
	    if( !scene ){
		console.warn( this +".removeScene: scene is not defined");
		return;
	    }
	    
	    var scenes = this.scenes,
		index = scenes.indexOf( scene );
	    
	    if( index > -1 ){
		scene.game = undefined;
		scenes.splice( index, 1 );
		
		scene.off("addGameObject");
		scene.off("removeGameObject");
		
		sockets.emit("server_removeScene", scene._id );
	    }
	    else{
		console.warn( this +".removeScene: Scene is not a member of Game");
	    }
	};
	
	/**
	 * @method remove
	 * @memberof ServerGame
	 * @brief same as removeScenes
	 */
	ServerGame.prototype.remove = ServerGame.prototype.removeScenes;
	
	
	ServerGame.prototype._onRequest = function(){
	    var mimeTypes = {
		"txt": "text/plain",
		"html": "text/html",
		"css": "text/css",
		"xml": "application/xml",
		"json": "application/json",
		"js": "application/javascript",
		"jpg": "image/jpeg",
		"jpeg": "image/jpeg",
		"gif": "image/gif",
		"png": "image/png",
		"svg": "image/svg+xml"
	    };
	    
	    return function( req, res ){
		var uri = url.parse( req.url ).pathname,
		    filename = path.join( process.cwd(), uri ),
		    mime = mimeTypes[ uri.split(".").pop() ] || "text/plain";
		    
		fs.exists( filename, function( exists ){
		    
		    if( !exists ){
			res.writeHead( 404, {"Content-Type": "text/plain"});
			res.write("404 Not Found");
			res.end();
			return;
		    }
		    
		    if( fs.statSync( filename ).isDirectory() ){
			filename += "index.html";
			mime = "text/html";
		    }
		    
		    fs.readFile( filename, function( error, file ){
			log( req.method +": "+ filename +" "+ mime );
			
			if( error ){
			    res.writeHead( 500, {"Content-Type": "text/plain"});
			    res.write( err + "\n");
			    res.end();
			    return;
			}
			
			res.writeHead( 200, {"Content-Type": mime });
			res.write( file, mime );
			res.end();
		    });
		});
	    };
	}();
	
	
	return ServerGame;
    }
);