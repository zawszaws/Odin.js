var requirejs = require("requirejs");

requirejs.config({
    baseUrl: __dirname +"/"
});

if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
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
		global[ key ] = this[ key ];
	    }
	    global.Odin = this;
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
	
	Odin.Class = requirejs("base/class");
	Odin.ObjectPool = requirejs("base/objectpool");
	Odin.Time = requirejs("base/time");
	Odin.Utils = requirejs("base/utils");
	
	Odin.AABB2 = requirejs("math/aabb2");
	Odin.AABB3 = requirejs("math/aabb3");
	Odin.Color = requirejs("math/color");
	Odin.Line2 = requirejs("math/line2");
	Odin.Mat2 = requirejs("math/mat2");
	Odin.Mat3 = requirejs("math/mat3");
	Odin.Mat32 = requirejs("math/mat32");
	Odin.Mat4 = requirejs("math/mat4");
	Odin.Mathf = requirejs("math/mathf");
	Odin.Quat = requirejs("math/quat");
	Odin.Vec2 = requirejs("math/vec2");
	Odin.Vec3 = requirejs("math/vec3");
	Odin.Vec4 = requirejs("math/vec4");
	
	Odin.Asset = requirejs("core/assets/asset");
	Odin.Assets = requirejs("core/assets/assets");
	Odin.ImageAsset = requirejs("core/assets/imageasset");
	Odin.SpriteSheetAsset = requirejs("core/assets/spritesheetasset");
	
	Odin.Camera2D = requirejs("core/components/camera2d");
	Odin.Component = requirejs("core/components/component");
	Odin.Rigidbody2D = requirejs("core/components/rigidbody2d");
	Odin.Sprite2D = requirejs("core/components/sprite2d");
	Odin.Transform2D = requirejs("core/components/transform2d");
	
	Odin.World = requirejs("core/world/world");
	
	Odin.Client = requirejs("core/game/client");
	Odin.ServerGame = requirejs("core/game/servergame");
	Odin.Config = requirejs("core/game/config");
	
	Odin.GameObject = requirejs("core/gameobject");
	Odin.Scene = requirejs("core/scene");
	
	Odin.Phys2D = requirejs("phys2d/phys2d");
	
	return Odin;
    }
);