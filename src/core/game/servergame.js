if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"require",
	"base/class",
	"base/time",
	"core/game/client",
	"core/scene/scene2d"
    ],
    function( require, Class, Time, Client, Scene2D ){
	"use strict";
	
	var http = require("http"),
	    url = require("url"),
	    path = require("path"),
	    fs = require("fs"),
	    io = require("socket.io"),
	    scenesList = [];
	
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
	    
	    /**
	    * @property Array scenes
	    * @brief list of scenes
	    * @memberof ServerGame
	    */
	    this.scenes = [];
	    
	    /**
	    * @property Object clients
	    * @brief list of clients
	    * @memberof ServerGame
	    */
	    this.clients = {};
	    
	    /**
	    * @property String host
	    * @brief host address of game
	    * @memberof ServerGame
	    */
	    this.host = opts.host || "127.0.0.1";
	    
	    /**
	    * @property String port
	    * @brief port of game
	    * @memberof ServerGame
	    */
	    this.port = opts.port || 3000;
	    
	    /**
	    * @property Object server
	    * @brief reference to http server
	    * @memberof ServerGame
	    */
	    this.server = http.createServer( this._onRequest.bind( this ) );
	    this.server.listen( this.port, this.host );
	    
	    /**
	    * @property Object io
	    * @brief reference to socket.io
	    * @memberof ServerGame
	    */
	    this.io = io.listen( this.server );
	    this.io.set("log level", opts.logLevel || 2 );
	    
	    var self = this;
	    this.io.sockets.on("connection", function( socket ){
		var scenes = self.scenes,
		    client = new Client({
			id: socket.id,
			socket: socket,
			connectTime: Time.stamp()
		    }),
		    id = socket.id,
		    i;
		
		scenesList.length = 0;
		
		for( i = scenes.length; i--; ){
		    scenesList[i] = scenes[i].toJSON();
		}
		
		self.clients[ id ] = client;
		
		socket.emit("connection", id, scenesList );
		
		socket.on("disconnect", function(){
		    self.trigger("disconnect", id );
		    console.log("ServerGame: Client id: "+ id +" disconnected");
		});
		socket.on("error", function( error ){
		    console.log("ServerGame: Client id: "+ id +" to error: "+ error );
		});
		
		socket.on("device", function( device ){
		    client.device = device;
		    self.trigger("connection", id );
		    console.log("ServerGame: new Client id: "+ id +" "+ device.userAgent );
		});
		
		socket.on("clientOffset", function( offset ){
		    client.offset = offset;
		    
		    if( offset > 10 ){
			console.log("ServerGame: disconnected Client with id "+ id +" due to slow connection");
			self.trigger("disconnect", id );
			socket.disconnect();
		    }
		});
		
		socket.on("accelerometer", function( accelerometer ){ client.trigger("accelerometer", accelerometer ); });
		socket.on("orientation", function( orientation ){ client.trigger("orientation", orientation ); });
		socket.on("orientationchange", function( mode, orientation ){ client.trigger("orientationchange", mode, orientation ); });
		
		socket.on("keydown", function( key ){ client.trigger("keydown", key ); });
		socket.on("keyup", function( key ){ client.trigger("keyup", key ); });
		
		socket.on("touchstart", function( touch ){ client.trigger("touchstart", touch ); });
		socket.on("touchend", function( touch ){ client.trigger("touchend", touch ); });
		socket.on("touchmove", function( touch ){ client.trigger("touchmove", touch ); });
		
		socket.on("mousedown", function( Mouse ){ client.trigger("mousedown", Mouse ); });
		socket.on("mouseup", function( Mouse ){ client.trigger("mouseup", Mouse ); });
		socket.on("mouseout", function( Mouse ){ client.trigger("mouseout", Mouse ); });
		socket.on("mousemove", function( Mouse ){ client.trigger("mousemove", Mouse ); });
		socket.on("mousewheel", function( Mouse ){ client.trigger("mousewheel", Mouse ); });
	    });
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
	    
	    console.log("Game started at "+ this.host +":"+ this.port );
	};
	
	/**
	 * @method addScene
	 * @memberof ServerGame
	 * @brief adds all scenes in arguments to game
	 */
	ServerGame.prototype.addScene = function(){
            var scenes = this.scenes,
		sockets = this.io.sockets,
                scene, index, i;
            
            for( i = arguments.length; i--; ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index === -1 ){
		    scenes.push( scene );
		    scene.game = this;
		    
		    scene.trigger("addToGame");
		    this.trigger("addScene", scene );
		    sockets.emit("addScene", scene.toJSON() );
		    
		    scene.on("addGameObject", function( gameObject ){
			sockets.emit("addGameObject", this._id, gameObject.toJSON() );
			
			gameObject.on("addComponent", function( component ){
			    if( component._class !== "RigidBody2D" ){
				sockets.emit("addComponent", this.scene._id, this._id, component.toJSON() );
			    }
			});
			
			gameObject.on("removeComponent", function( component ){
			    if( component._class !== "RigidBody2D" ){
				sockets.emit("removeComponent", this.scene._id, this._id, component._class );
			    }
			});
			
			gameObject.on("zoom", function(){
			    sockets.emit("cameraZoom", this.scene._id, this._id, this.zoom );
			});
			gameObject.on("moved", function(){
			    sockets.emit("gameObjectMoved", this.scene._id, this._id, this.position );
			});
			gameObject.on("scaled", function(){
			    sockets.emit("gameObjectScaled", this.scene._id, this._id, this.scale );
			});
			gameObject.on("rotated", function(){
			    sockets.emit("gameObjectRotated", this.scene._id, this._id, this.rotation );
			});
		    });
		    
		    scene.on("removeGameObject", function( gameObject ){
			sockets.emit("removeGameObject", this._id, gameObject._id );
		    });
                }
		else{
		    console.warn("ServerGame.add: "+ scene.name +" is already added to game");
		}
            }
        };
        
        /**
	 * @method addScene
	 * @memberof ServerGame
	 * @brief removes all scenes in arguments from game
	 */
        ServerGame.prototype.removeScene = function(){
            var scenes = this.scenes,
		sockets = this.io.sockets,
                scene, index, i;
            
            for( i = arguments.length; i--; ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index !== -1 ){
                    scenes.splice( index, 1 );
		    scene.game = undefined;
                    
                    scene.trigger("removeFromGame");
                    this.trigger("removeScene", scene );
		    sockets.emit("removeScene", scene._id );
                }
		else{
		    console.warn("ServerGame.remove: "+ scene.name +" is not in game");
		}
            }
        };
        
        /**
	 * @method setScene
	 * @memberof ServerGame
	 * @brief sets client's active scene
	 * @param Client client
	 * @param Scene scene
	 */
        ServerGame.prototype.setScene = function( client, scene ){
            var index = this.scenes.indexOf( scene ),
		socket = this.io.sockets.sockets[ client.id ];
	    
	    if( index === -1 ){
		console.warn("ServerGame.setScene: scene not added to Game, adding it...");
		this.addScene( scene );
	    }
	    
	    client.scene = scene;
	    socket.emit("setScene", scene._id );
	    
	    if( !client.scene ){
		console.warn("ServerGame.setScene: could not find scene in Game "+ scene );
	    }
        };
        
        /**
	 * @method setCamera
	 * @memberof ServerGame
	 * @brief sets client's active camera
	 * @param Client client
	 * @param Camera camera
	 */
        ServerGame.prototype.setCamera = function( client, camera ){
            var scene = client.scene,
		index = scene.children.indexOf( camera ),
		socket = this.io.sockets.sockets[ client.id ];
	    
	    if( index === -1 ){
		console.warn("ServerGame.setCamera: camera not added to scene, adding it...");
		scene.add( camera );
	    }
	    
	    client.camera = camera;
	    socket.emit("setCamera", camera._id );
	    
	    if( !client.camera ){
		console.warn("ServerGame.setCamera: could not find camera in scene "+ scene );
	    }
        };
	
	/**
	 * @method findSceneByName
	 * @memberof ServerGame
	 * @brief find scene by name
	 * @param String name
	 */
	ServerGame.prototype.findSceneByName = function( name ){
            var scenes = this.scenes,
                scene, i;
            
            for( i = scenes.length; i--; ){
                scene = scenes[i];
                
                if( scene.name === name ) return scene;
            }
            
            return undefined;
        };
        
        /**
	 * @method findSceneById
	 * @memberof ServerGame
	 * @brief find scene by id
	 * @param Number id
	 */
        ServerGame.prototype.findSceneById = function( id ){
            var scenes = this.scenes,
                scene, i;
            
            for( i = scenes.length; i--; ){
                scene = scenes[i];
                
                if( scene._id === id ) return scene;
            }
            
            return undefined;
        };
	
	/**
	 * @method update
	 * @memberof ServerGame
	 * @brief updates scenes and Time
	 */
	ServerGame.prototype.update = function(){
	    var scenes = this.scenes, scene, i;
	    
	    Time.sinceStart = Time.now();
	    Time.update();
	    
	    for( i = scenes.length; i--; ) scenes[i].update();
	    
	    this.io.sockets.emit("sync", Time.stamp() );
	};
	
	/**
	 * @method animate
	 * @memberof ServerGame
	 * @brief starts the game called in ServerGame.init
	 */
	ServerGame.prototype.animate = function(){
	    
	    this.update();
	    
	    setTimeout( this.animate.bind( this ), 0 );
	};
	
	
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
			console.log( req.method +": "+ filename +" "+ mime );
			
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