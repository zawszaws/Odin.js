if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/time",
	"core/input/input",
	"core/assets/assets",
	"core/game/config",
	"core/renderers/canvasrenderer2d",
	"core/renderers/webglrenderer2d"
    ],
    function( Class, Dom, Time, Input, Assets, Config, CanvasRenderer2D, WebGLRenderer2D ){
        "use strict";
	
	
	var now = Time.now,
	    MIN_DELTA = 0.000001, MAX_DELTA = 1,
	    requestAnimationFrame = Dom.requestAnimationFrame;
	
        /**
	 * @class Game
	 * @extends Class
	 * @brief Base class for game app
	 * @param Object opts sets Class properties from passed Object
	 */
        function Game( opts ){
	    opts || ( opts = {} );
	    
            Class.call( this );
	    
	    Config.host = opts.host !== undefined ? opts.host : Config.host;
	    Config.port = opts.port !== undefined ? opts.port : Config.port;
	    
	    Config.debug = opts.debug !== undefined ? !!opts.debug : Config.debug;
	    Config.forceCanvas = opts.forceCanvas !== undefined ? !!opts.forceCanvas : Config.forceCanvas;
	    
	    /**
	    * @property Config config
	    * @brief game config
	    * @memberof Game
	    */
	    this.config = Config;
	    
	    /**
	    * @property Scene scene
	    * @brief game's active scene
	    * @memberof Game
	    */
	    this.scene = undefined;
	    
	    /**
	    * @property Camera camera
	    * @brief game's camera
	    * @memberof Game
	    */
	    this.camera = undefined;
	    
	    /**
	    * @property Array scenes
	    * @brief game's list of all scenes
	    * @memberof Game
	    */
	    this.scenes = [];
	    
	    /**
	    * @property WebGLRenderer2D WebGLRenderer2D
	    * @brief reference to WebGL 2D Renderer
	    * @memberof Game
	    */
	    this.WebGLRenderer2D = new WebGLRenderer2D( opts );
	    
	    /**
	    * @property CanvasRenderer2D CanvasRenderer2D
	    * @brief reference to Canvas 2D Renderer
	    * @memberof Game
	    */
	    this.CanvasRenderer2D = new CanvasRenderer2D( opts );
	    
	    /**
	    * @property Renderer renderer
	    * @brief reference to game's active renderer
	    * @memberof Game
	    */
	    this.renderer = undefined;
	    
	    if( opts.scenes ) this.addScenes.apply( this, opts.scenes );
	    if( opts.scene ) this.setScene( opts.scene );
	    if( opts.camera ) this.setCamera( opts.camera );
	}
        
	Class.extend( Game, Class );
	
	/**
	 * @method init
	 * @memberof Game
	 * @brief call to start game
	 */
	Game.prototype.init = function(){
	    var self = this;
	    
	    Assets.load(function(){
		self.trigger("init");
		self.animate();
	    })
	};
	
	/**
	 * @method update
	 * @memberof Game
	 * @brief called every frame
	 */
	Game.prototype.update = function(){
	    var scene = this.scene;
	    
	    if( scene ){
		Time.sinceSceneStart = now() - Time.sceneStart;
		scene.update();
	    }
	};
	
	/**
	 * @method render
	 * @memberof Game
	 * @brief called every frame
	 */
	Game.prototype.render = function(){
	    var scene = this.scene,
		camera = this.camera;
	    
	    if( scene && camera ) this.renderer.render( scene, camera );
	};
	
	/**
	 * @method animate
	 * @memberof Game
	 * @brief calls update and render
	 */
	Game.prototype.animate = function(){
	    var frameCount = 0, last = 0, time = 0, delta = 0,
		fpsDisplay = document.createElement("p"), frames = 0, fpsLast = 0, fpsTime;
	    
	    fpsDisplay.style.cssText = [
		"z-index: 1000;",
		"position: absolute;",
		"margin: 0px;",
		"padding: 0px;",
		"color: #ddd;",
		"text-shadow: 1px 1px #333;",
		"-webkit-touch-callout: none;",
		"-webkit-user-select: none;",
		"-khtml-user-select: none;",
		"-moz-user-select: moz-none;",
		"-ms-user-select: none;",
		"user-select: none;"
	    ].join("\n");
	    
	    document.body.appendChild( fpsDisplay );
	    
	    return function(){
		Time.frameCount = frameCount++;
		
		last = time;
		time = now();
		
		if( Config.debug ){
		    fpsTime = time * 1000;
		    frames++;
		    
		    if( fpsLast + 1000 < fpsTime ){
			fpsDisplay.innerHTML = ( ( frames * 1000 ) / ( fpsTime - fpsLast ) ).toFixed(3);
			
			fpsLast = fpsTime;
			frames = 0;
		    }
		}
		
		delta = ( time - last ) * Time.scale;
		Time.delta = delta < MIN_DELTA ? MIN_DELTA : delta > MAX_DELTA ? MAX_DELTA : delta;
		
		Time.time = time * Time.scale;
		Time.sinceStart = time;
		
		Input.update();
		
		this.update();
		this.render();
		
		requestAnimationFrame( this.animate.bind( this ) );
	    };
	}();
	
	/**
	 * @method updateRenderer
	 * @memberof Game
	 * @brief updates game's renderer based on scene and webgl capabilities
	 * @param Scene scene
	 */
	Game.prototype.updateRenderer = function( gameObject ){
	    this.CanvasRenderer2D.canvas.element.style.display = "none";
	    this.WebGLRenderer2D.canvas.element.style.display = "none";
	    
	    if( gameObject.camera2d ){
		if( Device.webgl && !Config.forceCanvas ){
		    this.renderer = this.WebGLRenderer2D;
		}
		else if( Device.canvas ){
		    this.renderer = this.CanvasRenderer2D;
		}
		else{
		    console.warn( this +".updateRenderer: Could not get a renderer for this device");
		}
	    }
	    
	    Input.clear();
	    Input.init( this.renderer.canvas.element );
	    
	    this.renderer.canvas.element.style.display = "block";
        };
	
	/**
	 * @method setScene
	 * @memberof Game
	 * @brief sets active scene
	 * @param Scene scene
	 */
	Game.prototype.setScene = function( scene ){
	    if( !scene ){
		console.warn( this +".setScene: Scene is not defined");
		return;
	    }
	    
	    var scenes = this.scenes,
		index = scenes.indexOf( scene );
	    
	    if( index < 0 ){
		console.warn( this +".setScene: Scene is not added to Game, adding it...");
		this.addScene( scene );
	    }
	    
	    Time.sceneStart = now();
	    
	    scene.init();
	    this.scene = scene;
	};
	
	/**
	 * @method setCamera
	 * @memberof Game
	 * @brief sets active camera from gameObjects camera2d or camera3d component
	 * @param GameObject gameObject
	 */
	Game.prototype.setCamera = function( gameObject ){
	    if( !this.scene ){
		console.warn( this +".setCamera: needs active scene for camera");
		return;
	    }
	    if( !gameObject ){
		console.warn( this +".setCamera: Camera is not defined");
		return;
	    }
	    
	    var scene = this.scene,
		gameObjects = scene.gameObjects,
		index = gameObjects.indexOf( gameObject ),
		camera;
	    
	    if( index < 0 ){
		console.warn( this +".setCamera: Camera is not added to Scene, adding it...");
		scene.addGameObject( gameObject );
	    }
	    
	    camera = gameObject.camera2d || gameObject.camera3d;
	    
	    if( camera ){
		this.camera = camera;
		this.updateRenderer( gameObject );
	    }
	    else{
		console.warn( this +".setCamera: GameObject does not have a Camera2D or Camera3D Component");
	    }
	};
	
	/**
	 * @method findById
	 * @memberof Game
	 * @brief finds Scene by id
	 * @param Number id
	 * @return Scene
	 */
	Game.prototype.findById = function( id ){
	    var scenes = this.scenes,
		scene, i;
	    
	    for( i = scenes.length; i--; ){
		scene = scenes[i];
		
		if( scene._id == id ) return scene;
	    }
	    
	    return undefined;
	};
	
	/**
	 * @method addScenes
	 * @memberof Game
	 * @brief adds all Scenes in arguments to Game
	 */
	Game.prototype.addScenes = function(){
	    
	    for( var i = arguments.length; i--; ) this.addScene( arguments[i] );
	};
	
	/**
	 * @method addScene
	 * @memberof Game
	 * @brief adds Scene to Game
	 * @param Scene scene
	 */
	Game.prototype.addScene = function( scene ){
	    if( !scene ){
		console.warn( this +".addScene: scene is not defined");
		return;
	    }
	    
	    var scenes = this.scenes,
		index = scenes.indexOf( scene );
	    
	    if( index < 0 ){
		if( scene.game ) scene.destroy();
		
		scene.game = this;
		scenes.push( scene );
	    }
	    else{
		console.warn( this +".addScene: Scene is already added to Game");
	    }
	};
	
	/**
	 * @method add
	 * @memberof Game
	 * @brief same as addScenes
	 */
	Game.prototype.add = Game.prototype.addScenes;
	
	/**
	 * @method removeScenes
	 * @memberof Game
	 * @brief removes all Scenes in arguments from Game
	 */
	Game.prototype.removeScenes = function(){
	    
	    for( var i = arguments.length; i--; ) this.removeScene( arguments[i] );
	};
	
	/**
	 * @method removeScene
	 * @memberof Game
	 * @brief removes Scene from Game
	 * @param Scene scene
	 */
	Game.prototype.removeScene = function( scene ){
	    if( !scene ){
		console.warn( this +".removeScene: scene is not defined");
		return;
	    }
	    
	    var scenes = this.scenes,
		index = scenes.indexOf( scene );
	    
	    if( index > -1 ){
		scene.game = undefined;
		scenes.splice( index, 1 );
	    }
	    else{
		console.warn( this +".removeScene: Scene is not a member of Game");
	    }
	};
	
	/**
	 * @method remove
	 * @memberof Game
	 * @brief same as removeScenes
	 */
	Game.prototype.remove = Game.prototype.removeScenes;
	
        
        return Game;
    }
);