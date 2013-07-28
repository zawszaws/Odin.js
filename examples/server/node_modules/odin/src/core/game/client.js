if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/mathf",
	"core/input/axis"
    ],
    function( Class, Time, Mathf, Axis ){
	"use strict";
	
	
	var min = Math.min,
	    max = Math.max,
	    abs = Math.abs,
	    
	    sign = Mathf.sign,
	    clamp = Mathf.clamp,
	    equals = Mathf.equals;
	
	/**
	 * @class Client
	 * @extends Class
	 * @brief client information used by ServerGame
	 * @param Object opts sets Class properties from passed Object
	 */
	function Client( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Number id
	    * @brief unique id of this client
	    * @memberof Client
	    */
	    this.id = opts.id;
	    
	    /**
	    * @property Object socket
	    * @brief reference to this client's socket
	    * @memberof Client
	    */
	    this.socket = opts.socket;
	    
	    /**
	    * @property Device device
	    * @brief clients device information
	    * @memberof Client
	    */
	    this.device = opts.device;
	    
	    /**
	    * @property ServerGame game
	    * @brief reference to game
	    * @memberof Client
	    */
	    this.game = opts.game;
	    
	    /**
	    * @property Scene scene
	    * @brief clients active scene 
	    * @memberof Client
	    */
	    this.scene = undefined;
	    
	    /**
	    * @property Camera camera
	    * @brief clients active camera 
	    * @memberof Client
	    */
	    this.camera = undefined;
	    
	    /**
	    * @property Object userData
	    * @brief custom data for client
	    * @memberof Client
	    */
	    this.userData = {};
	    
	    /**
	    * @property Number lag
	    * @memberof Client
	    */
	    this.lag = 0;
	    
	    /**
	    * @property Input Input
	    * @memberof Client
	    */
	    this.Input = {
		buttons: {},
		mousePosition: new Vec2,
		mouseDelta: new Vec2,
		mouseWheel: 0,
		touches: [],
		axes: {}
	    };
	    
	    this.addAxis({
		name: "horizontal",
		posButton: "right",
		negButton: "left",
		altPosButton: "d",
		altNegButton: "a",
		type: Axis.BUTTON
	    });
	    
	    this.addAxis({
		name: "vertical",
		posButton: "up",
		negButton: "down",
		altPosButton: "w",
		altNegButton: "s",
		type: Axis.BUTTON
	    });
	    
	    this.addAxis({
		name: "fire",
		posButton: "ctrl",
		negButton: "",
		altPosButton: "mouse0",
		altNegButton: "",
		type: Axis.BUTTON
	    });
	    
	    this.addAxis({
		name: "jump",
		posButton: "space",
		negButton: "",
		altPosButton: "mouse2",
		altNegButton: "",
		type: Axis.BUTTON
	    });
	    
	    this.addAxis({
		name: "mouseX",
		type: Axis.MOUSE,
		axis: "x"
	    });
	    
	    this.addAxis({
		name: "mouseY",
		type: Axis.MOUSE,
		axis: "y"
	    });
	    
	    this.addAxis({
		name: "mouseWheel",
		gravity: 3,
		type: Axis.MOUSE_WHEEL
	    });
	}
        
	Class.extend( Client, Class );
	
	/**
	 * @method addAxis
	 * @memberof Client
	 * @brief adds new axis to Input.axes
	 * @param Object opts
	 */
        Client.prototype.addAxis = function( opts ){
	    
	    this.Input.axes[ opts.name ] = new Axis( opts );
        };
	
	/**
	 * @method axis
	 * @memberof Client
	 * @brief returns the value of the virtual axis identified by axisName
	 * @param String axisName
	 */
        Client.prototype.axis = function( axisName ){
	    var axis = this.Input.axes[ axisName ];
	    
	    return ( axis && axis.value ) || 0;
        };
	
	/**
	 * @method touch
	 * @memberof Client
	 * @brief returns object representing status of a specific touch, if no touch returns undefined
	 * @param Number num
	 */
        Client.prototype.touch = function( num ){
	    var touch = this.Input.touches[ num ];
	    
	    return touch;
        };
	
	/**
	 * @method mouseButton
	 * @memberof Client
	 * @brief returns whether the given mouse button is held down
	 * @param Number buttonNum
	 */
        Client.prototype.mouseButton = function( buttonNum ){
	    var button = this.Input.buttons[ "mouse"+ buttonNum ];
	    
	    return button && button.value;
        };
	
	/**
	 * @method mouseButtonDown
	 * @memberof Client
	 * @brief returns true during the frame the user pressed the given mouse button
	 * @param Number buttonNum
	 */
        Client.prototype.mouseButtonDown = function( buttonNum ){
	    var button = this.Input.buttons[ "mouse"+ buttonNum ];
	    
	    return button && button.value && ( button.frameDown >= Time.frameCount );
        };
	
	/**
	 * @method mouseButtonUp
	 * @memberof Client
	 * @brief returns true during the frame the user releases the given mouse button
	 * @param Number buttonNum
	 */
        Client.prototype.mouseButtonUp = function( buttonNum ){
	    var button = this.Input.buttons[ "mouse"+ buttonNum ];
	    
	    return button && ( button.frameUp >= Time.frameCount );
        };
	
	/**
	 * @method key
	 * @memberof Client
	 * @brief returns true while the user holds down the key identified by name
	 * @param String name
	 */
        Client.prototype.key = function( name ){
	    var button = this.Input.buttons[ name ];
	    
	    return button && button.value;
        };
	
	/**
	 * @method keyDown
	 * @memberof Client
	 * @brief returns true during the frame the user starts pressing down the key identified by name
	 * @param String name
	 */
        Client.prototype.keyDown = function( name ){
	    var button = this.Input.buttons[ name ];
	    
	    return button && button.value && ( button.frameDown >= Time.frameCount );
        };
	
	/**
	 * @method keyUp
	 * @memberof Client
	 * @brief returns true during the frame the user releases the key identified by name
	 * @param String name
	 */
        Client.prototype.keyUp = function( name ){
	    var button = this.Input.buttons[ name ];
	    
	    return button && ( button.frameUp >= Time.frameCount );
        };
	
	/**
	 * @method update
	 * @memberof Client
	 * @brief called ever frame
	 */
        Client.prototype.update = function(){
	    var Input = this.Input, axes = Input.axes, buttons = Input.buttons, button, altButton,
		name, axis, value, pos, neg, tmp,
		dt = Time.delta;
	    
	    for( name in axes ){
		axis = axes[ name ];
		value = axis.value;
		
		switch( axis.type ){
		    
		    case Axis.BUTTON:
			
			button = buttons[ axis.negButton ];
			altButton = buttons[ axis.altNegButton ];
			neg = button && button.value || altButton && altButton.value;
			
			button = buttons[ axis.posButton ];
			altButton = buttons[ axis.altPosButton ];
			pos = button && button.value || altButton && altButton.value;
			
			break;
		    
		    case Axis.MOUSE:
			
			axis.value = Input.mouseDelta[ axis.axis ];
			continue;
			
			break;
		    
		    case Axis.MOUSE_WHEEL:
			
			value += Input.mouseWheel;
			
			break;
		}
		
		if( neg ) value -= axis.sensitivity * dt;
		if( pos ) value += axis.sensitivity * dt;
		
		if( !pos && !neg ){
		    tmp = abs( value );
		    value -= clamp( sign( value ) * axis.gravity * dt, -tmp, tmp );
		}
		
		value = clamp( value, -1, 1 );
		
		if(  abs( value ) <= axis.dead ) value = 0;
		
		axis.value = value;
	    }
        };
        
        /**
	 * @method setScene
	 * @memberof Client
	 * @brief sets client's active scene
	 * @param Scene scene
	 */
        Client.prototype.setScene = function( scene ){
	    if( !this.game ){
		console.warn( this +".setScene: Client is not a member of a ServerGame");
		return;
	    }
	    
	    this.game.setScene( this, scene );
        };
        
        /**
	 * @method setCamera
	 * @memberof Client
	 * @brief sets client's active camera from gameObjects camera2d or camera3d component
	 * @param GameObject gameObject
	 */
        Client.prototype.setCamera = function( gameObject ){
	    if( !this.game ){
		console.warn( this +".setCamera: Client is not a member of a ServerGame");
		return;
	    }
	    
	    this.game.setCamera( this, gameObject );
        };
    
	
	return Client;
    }
);