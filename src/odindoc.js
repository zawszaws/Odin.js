if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function( require ){
	"use strict";
	
	/**
	* @library Odin.js
	* @version 0.0.12
	* @brief Node.js Canvas/WebGL Javascript Game Engine
	*/
	
	/**
	 * @class Odin
	 * @brief Holds all Classes
	 */
	var Odin = {};
	
	/**
	 * @method globalize
	 * @memberof Odin
	 * @brief globalizes Odin Classes
	 */
	Odin.globalize = function(){
	    
	    for( var key in this ){
		window[ key ] = this[ key ];
	    }
	    window.Odin = this;
	};
	
	/**
	 * @method test
	 * @memberof Odin
	 * @brief test function a nth numeber of times and console.logs the time it took
	 * @param String name
	 * @param Number times
	 * @param Function fn
	 */
	Odin.test = function(){
	    var now = Date.now,
		start, i;
	    
	    return function( name, times, fn ){
		start = now();
		
		for( i = 0; i < times; i++ ){
		    fn();
		}
		
		console.log( name +": "+ ( now() - start ) +"ms");
	    };
	}();
	
	Odin.Class = require("base/class");
	Odin.Device = require("base/device");
	Odin.Dom = require("base/dom");
	Odin.ObjectPool = require("base/objectpool");
	Odin.Time = require("base/time");
	Odin.Utils = require("base/utils");
	
	Odin.AABB2 = require("math/aabb2");
	Odin.AABB3 = require("math/aabb3");
	Odin.Color = require("math/color");
	Odin.Line2 = require("math/line2");
	Odin.Mat2 = require("math/mat2");
	Odin.Mat3 = require("math/mat3");
	Odin.Mat32 = require("math/mat32");
	Odin.Mat4 = require("math/mat4");
	Odin.Mathf = require("math/mathf");
	Odin.Quat = require("math/quat");
	Odin.Vec2 = require("math/vec2");
	Odin.Vec3 = require("math/vec3");
	Odin.Vec4 = require("math/vec4");
	
	Odin.Asset = require("core/assets/asset");
	Odin.Assets = require("core/assets/assets");
	Odin.ImageAsset = require("core/assets/imageasset");
	Odin.SpriteSheetAsset = require("core/assets/spritesheetasset");
	
	Odin.Camera2D = require("core/components/camera2d");
	Odin.Component = require("core/components/component");
	Odin.Rigidbody2D = require("core/components/rigidbody2d");
	Odin.Sprite2D = require("core/components/sprite2d");
	Odin.Transform2D = require("core/components/transform2d");
	
	Odin.CanvasRenderer2D = require("core/renderers/canvasrenderer2d");
	Odin.WebGLRenderer2D = require("core/renderers/webglrenderer2d");
	
	Odin.World = require("core/world/world");
	
	Odin.Client = require("core/game/client");
	Odin.ClientGame = require("core/game/clientgame");
	Odin.Config = require("core/game/config");
	Odin.Game = require("core/game/game");
	Odin.ServerGame = require("core/game/servergame");
	
	Odin.Input = require("core/input/input");
	
	Odin.Canvas = require("core/canvas");
	Odin.GameObject = require("core/gameobject");
	Odin.Scene = require("core/scene");
	
	Odin.Phys2D = require("phys2d/phys2d");
	
	return Odin;
    }
);