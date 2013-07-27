if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/time",
	"math/mathf",
	"math/vec2",
	"math/vec3",
	"core/sharedobject",
	"core/input/axis",
	"core/input/buttons"
    ],
    function( Class, Dom, Time, Mathf, Vec2, Vec3, SharedObject, Axis, Buttons ){
	"use strict";
        
	
        var min = Math.min,
	    max = Math.max,
	    abs = Math.abs,
	    
	    sign = Mathf.sign,
	    clamp = Mathf.clamp,
	    equals = Mathf.equals,
	    
	    addEvent = Dom.addEvent,
	    removeEvent = Dom.removeEvent;
	
        /**
	 * @class Input
	 * @extends SharedObject
	 * @brief Input Mananger
	 */
        function Input(){
            
            SharedObject.call( this );
	    
            /**
	    * @property HTMLElement element
	    * @brief DOM Element events are attached to
	    * @memberof Input
	    */
	    this.element = undefined;
	    
	    /**
	    * @property Object buttons
	    * @brief list of all buttons in use
	    * @memberof Input
	    */
	    this.buttons = Buttons;
	    
	    /**
	    * @property Vec2 mousePosition
	    * @brief mouse current position
	    * @memberof Input
	    */
	    this.mousePosition = new Vec2;
	    
	    /**
	    * @property Vec2 mouseDelta
	    * @brief mouse delta position
	    * @memberof Input
	    */
	    this.mouseDelta = new Vec2;
	    
	    /**
	    * @property Object axes
	    * @brief list of axes in use
	    * @memberof Input
	    */
	    this.axes = {};
	    
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
		gravity: 5,
		type: Axis.MOUSE_WHEEL
	    });
        };
        
	Class.extend( Input, SharedObject );
	
	/**
	 * @method init
	 * @memberof Input
	 * @brief attaches events to given element
	 * @param HTMLElement element
	 */
        Input.prototype.init = function( element ){
	    
	    this.element = element;
	    
	    addEvent( element, "mousedown mouseup mousemove mouseout mousewheel DOMMouseScroll", handleMouse, this );
	    addEvent( top, "keydown keyup", handleKeys, this );
        };
	
	/**
	 * @method clear
	 * @memberof Input
	 * @brief removes events from element
	 * @param HTMLElement element
	 */
        Input.prototype.clear = function(){
	    var element = this.element;
	    
	    if( element ){
		removeEvent( element, "mousedown mouseup mousemove mouseout mousewheel DOMMouseScroll", handleMouse, this );
		removeEvent( top, "keydown keyup", handleKeys, this );
	    }
	    
            this.element = undefined;
        };
	
	/**
	 * @method update
	 * @memberof Input
	 * @brief called ever frame
	 */
        Input.prototype.update = function(){
	    var axes = this.axes, list = Buttons.list, button, altButton,
		name, axis, value, pos, neg, tmp,
		dt = Time.delta;
	    
	    mouseMoveNeedsUpdate = true;
	    
	    for( name in axes ){
		axis = axes[ name ];
		value = axis.value;
		
		switch( axis.type ){
		    
		    case Axis.BUTTON:
			
			button = list[ axis.negButton ];
			altButton = list[ axis.altNegButton ];
			neg = button && button.value || altButton && altButton.value;
			
			button = list[ axis.posButton ];
			altButton = list[ axis.altPosButton ];
			pos = button && button.value || altButton && altButton.value;
			
			break;
		    
		    case Axis.MOUSE:
			
			axis.value = this.mouseDelta[ axis.axis ];
			continue;
		    
		    case Axis.MOUSE_WHEEL:
			
			value += mouseWheel;
			
			break;
		    
		    default:
			continue;
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
	    
	    mouseWheel = 0;
        };
	
	/**
	 * @method addAxis
	 * @memberof Input
	 * @brief adds new axis to axes
	 * @param Object opts
	 */
        Input.prototype.addAxis = function( opts ){
	    
	    this.axes[ opts.name ] = new Axis( opts );
        };
	
	/**
	 * @method axis
	 * @memberof Input
	 * @brief returns the value of the virtual axis identified by axisName
	 * @param String axisName
	 */
        Input.prototype.axis = function( axisName ){
	    var axis = this.axes[ axisName ];
	    
	    return ( axis && axis.value ) || 0;
        };
	
	/**
	 * @method mouseButton
	 * @memberof Input
	 * @brief returns whether the given mouse button is held down
	 * @param Number buttonNum
	 */
        Input.prototype.mouseButton = function( buttonNum ){
	    var button = Buttons.list[ "mouse"+ buttonNum ];
	    
	    return button && button.value;
        };
	
	/**
	 * @method mouseButtonDown
	 * @memberof Input
	 * @brief returns true during the frame the user pressed the given mouse button
	 * @param Number buttonNum
	 */
        Input.prototype.mouseButtonDown = function( buttonNum ){
	    var button = Buttons.list[ "mouse"+ buttonNum ];
	    
	    return button && button.value && ( button.frameDown >= Time.frameCount );
        };
	
	/**
	 * @method mouseButtonUp
	 * @memberof Input
	 * @brief returns true during the frame the user releases the given mouse button
	 * @param Number buttonNum
	 */
        Input.prototype.mouseButtonUp = function( buttonNum ){
	    var button = Buttons.list[ "mouse"+ buttonNum ];
	    
	    return button && ( button.frameUp >= Time.frameCount );
        };
	
	/**
	 * @method key
	 * @memberof Input
	 * @brief returns true while the user holds down the key identified by name
	 * @param String name
	 */
        Input.prototype.key = function( name ){
	    var button = Buttons.list[ name ];
	    
	    return button && button.value;
        };
	
	/**
	 * @method keyDown
	 * @memberof Input
	 * @brief returns true during the frame the user starts pressing down the key identified by name
	 * @param String name
	 */
        Input.prototype.keyDown = function( name ){
	    var button = Buttons.list[ name ];
	    
	    return button && button.value && ( button.frameDown >= Time.frameCount );
        };
	
	/**
	 * @method keyUp
	 * @memberof Input
	 * @brief returns true during the frame the user releases the key identified by name
	 * @param String name
	 */
        Input.prototype.keyUp = function( name ){
	    var button = Buttons.list[ name ];
	    
	    return button && ( button.frameUp >= Time.frameCount );
        };
	
	/**
	 * @method toJSON
	 * @memberof Input
	 */
        Input.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.buttons = this.buttons.list;
	    json.mousePosition = this.mousePosition;
	    json.mouseDelta = this.mouseDelta;
	    json.mouseWheel = mouseWheel;
	    
	    return json;
        };
	
	
	var mouseLast = new Vec2,
	    mouseWheel = 0,
	    mouseMoveNeedsUpdate = false;
	
        function handleMouse( e ){
	    e.preventDefault();
	    
	    switch( e.type ){
		
		case "mousedown":
		    
		    Buttons.on( "mouse"+ e.button );
		    break;
		
		case "mouseup":
		    
		    Buttons.off( "mouse"+ e.button );
		    break;
		
		case "mouseout":
		    
		    Buttons.off( "mouse"+ e.button );
		    break;
		
		case "mousewheel":
		case "DOMMouseScroll":
		    
		    mouseWheel = max( -1, min( 1, ( e.wheelDelta || -e.detail ) ) );
		    
		    break;
		
		case "mousemove":
		    
		    if( mouseMoveNeedsUpdate ){
			var position = this.mousePosition,
			    delta = this.mouseDelta,
			    element = e.target || e.srcElement,
			    offsetX = element.offsetLeft,
			    offsetY = element.offsetTop;
			
			mouseLast.x = position.x;
			mouseLast.y = position.y;
			
			position.x = ( e.pageX || e.clientX ) - offsetX;
			position.y = ( e.pageY || e.clientY ) - offsetY;
			
			delta.x = position.x - mouseLast.x;
			delta.y = position.y - mouseLast.y;
			
			mouseMoveNeedsUpdate = false;
		    }
		    
		    break;
	    }
        };
	
	
	function handleKeys( e ){
	    e.preventDefault();
	    
	    switch( e.type ){
		
		case "keydown":
		    
		    Buttons.on( keyCodes[ e.keyCode ] );
		    break;
		
		case "keyup":
		    
		    Buttons.off( keyCodes[ e.keyCode ] );
		    break;
	    }
        };
	
	
	var keyCodes = {
	    8: "backspace",
	    9: "tab",
	    13: "enter",
	    16: "shift",
	    17: "ctrl",
	    18: "alt",
	    19: "pause",
	    20: "capslock",
	    27: "escape",
	    32: "space",
	    33: "pageup",
	    34: "pagedown",
	    35: "end",
	    37: "left",
	    38: "up",
	    39: "right",
	    40: "down",
	    45: "insert",
	    46: "delete",
	    112: "f1",
	    113: "f2",
	    114: "f3",
	    115: "f4",
	    116: "f5",
	    117: "f6",
	    118: "f7",
	    119: "f8",
	    120: "f9",
	    121: "f10",
	    122: "f11",
	    123: "f12",
	    144: "numlock",
	    145: "scrolllock",
	    186: "semicolon",
	    187: "equal",
	    188: "comma",
	    189: "dash",
	    190: "period",
	    191: "slash",
	    192: "graveaccent",
	    219: "openbracket",
	    220: "backslash",
	    221: "closebraket",
	    222: "singlequote"
	};
	
	for( var i = 48; i <= 90; i++ ){
	    keyCodes[ i ] = String.fromCharCode( i ).toLowerCase();
	}
	
        
        return new Input;
    }
);