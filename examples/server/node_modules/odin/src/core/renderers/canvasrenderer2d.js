if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/device",
	"base/time",
	"core/canvas",
	"math/color",
	"math/mat32",
	"core/components/sprite2d"
    ],
    function( Class, Dom, Device, Time, Canvas, Color, Mat32, Sprite2D ){
	"use strict";
	
	/**
	 * @class CanvasRenderer2D
	 * @extends Class
	 * @brief Canvas 2D Renderer
	 * @param Object opts sets Class properties from passed Object
	 */
        function CanvasRenderer2D( opts ){
            opts || ( opts = {} );
            
            Class.call( this );
	    
	    /**
	    * @property Number pixelRatio
	    * @brief ratio of pixels/meter
	    * @memberof WebGLRenderer2D
	    */
	    this.pixelRatio = ( opts.pixelRatio !== undefined ? opts.pixelRatio : 128 ) * Device.pixelRatio;
            
	    /**
	    * @property Canvas canvas
	    * @brief Canvas Class
	    * @memberof WebGLRenderer2D
	    */
            this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas( opts.width, opts.height );
	    
	    /**
	    * @property CanvasRenderingContext2D context
	    * @brief this Canvas's Context
	    * @memberof CanvasRenderer2D
	    */
            this.context = this.canvas.element.getContext("2d");
            
	    /**
	    * @property Boolean autoClear
	    * @brief if true clears ever frame
	    * @memberof CanvasRenderer2D
	    */
            this.autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
        }
        
	Class.extend( CanvasRenderer2D, Class );
	
        /**
	 * @method setClearColor
	 * @memberof CanvasRenderer2D
	 * @brief sets background color
	 * @param Color color color to set background too
	 */
        CanvasRenderer2D.prototype.setClearColor = function( color ){
            
	    if( color ){
		this.canvas.element.style.background = color.hex();
	    }
	    else{
		this.canvas.element.style.background = "#000000";
	    }
	};
	
        /**
	 * @method clear
	 * @memberof CanvasRenderer2D
	 * @brief clears canvas
	 */
        CanvasRenderer2D.prototype.clear = function(){
	    
            this.context.clearRect( -1, -1, 2, 2 );
	};
        
        /**
	 * @method render
	 * @memberof CanvasRenderer2D
	 * @brief renders scene from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
        CanvasRenderer2D.prototype.render = function(){
	    var lastScene, lastCamera, lastBackground = new Color;
	    
	    return function( scene, camera ){
		var self = this,
		    ctx = this.context,
		    background = scene.world.background;
		
		if( !lastBackground.equals( background ) ){
		    this.setClearColor( background );
		    lastBackground.copy( background );
		}
		if( lastScene !== scene ){
		    this.setClearColor( background );
		    lastScene = scene;
		}
		if( lastCamera !== camera ){
		    var canvas = this.canvas,
			ipr = 1 / this.pixelRatio,
			w = canvas.width * ipr,
			h = canvas.height * ipr,
			hw = canvas.width * 0.5,
			hh = canvas.height * 0.5;
		    
		    ctx.translate( hw, hh );
		    ctx.scale( hw, hh );
		    
		    camera.width = w;
		    camera.height = h;
		    camera.clientWidth = canvas.width;
		    camera.clientHeight = canvas.height;
		    
		    if( canvas.fullScreen ){
			canvas.off("resize");
			canvas.on("resize", function(){
			    var ipr = 1 / self.pixelRatio,
				w = this.width * ipr,
				h = this.height * ipr,
				hw = this.width * 0.5,
				hh = this.height * 0.5;
			    
			    ctx.translate( hw, hh );
			    ctx.scale( hw, hh );
			    
			    camera.width = w;
			    camera.height = h;
			    camera.clientWidth = this.width;
			    camera.clientHeight = this.height;
			});
		    }
		    
		    lastCamera = camera;
		}
		
		if( this.autoClear ) this.clear();
		
		this.renderComponents( scene, camera );
	    };
        }();
        
         /**
	 * @method renderComponents
	 * @memberof CanvasRenderer2D
	 * @brief renders scene's components from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
        CanvasRenderer2D.prototype.renderComponents = function(){
	    var modelViewProj = new Mat32,
		mvp = modelViewProj.elements;
	    
	    return function( scene, camera ){
		var sprites = scene.sprite2d || emptyArray, sprite,
		    transform,
		    i;
		
		for( i = sprites.length; i--; ){
		    sprite = sprites[i];
		    transform = sprite.gameObject.transform2d;
		    
		    if( !transform || !sprite.visible ) continue;
		    
		    transform.updateModelView( camera );
		    modelViewProj.mmul( transform.matrixModelView, camera.matrixProj );
		    
		    this.renderSprite( sprite, mvp );
		}
	    };
	}();
	
	
	CanvasRenderer2D.prototype.renderSprite = function( sprite, mvp ){
	    var ctx = this.context,
		imageAsset = sprite.image, image;
	    
	    if( imageAsset ){
		image = imageAsset.data;
	    }
	    else{
		console.warn( this+".renderSprite: can\'t render sprite without an ImageAsset");
		return;
	    }
	    
	    ctx.save();
	    
	    ctx.transform( mvp[0], -mvp[2], -mvp[1], mvp[3], mvp[4], mvp[5] );
	    ctx.scale( 1, -1 );
	    
	    ctx.globalAlpha = sprite.alpha;
	    
	    ctx.drawImage(
		image,
		sprite.x, sprite.y,
		sprite.w, sprite.h,
		sprite.width * -0.5,
		sprite.height * -0.5,
		sprite.width,
		sprite.height
	    );
	    
	    ctx.restore();
	};
	
        
        return CanvasRenderer2D;
    }
);