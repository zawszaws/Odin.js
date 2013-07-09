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
	"math/mat32"
    ],
    function( Class, Dom, Device, Time, Canvas, Color, Mat32 ){
	"use strict";
	
	var now = Time.now,
	    PI = Math.PI,
	    TWO_PI = PI * 2,
	    HALF_PI = PI * 0.5,
	    defaultImage = new Image;
	
	defaultImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
	
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
	    * @property Boolean debug
	    * @brief games debug value
	    * @memberof CanvasRenderer2D
	    */
	    this.debug = opts.debug !== undefined ? !!opts.debug : false;
	    
	    /**
	    * @property Number pixelRatio
	    * @brief ratio of pixels/meter
	    * @memberof CanvasRenderer2D
	    */
	    this.pixelRatio = opts.pixelRatio !== undefined ? opts.pixelRatio : 128;
	    this._invPixelRatio = 1 / this.pixelRatio;
	    
	    /**
	    * @property Canvas canvas
	    * @brief Canvas Class
	    * @memberof CanvasRenderer2D
	    */
            this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas( opts.width, opts.height );
	    
	    /**
	    * @property CanvasRenderingContext2D context
	    * @brief this Canvas's Context
	    * @memberof CanvasRenderer2D
	    */
            this.context = Dom.get2DContext( this.canvas.element );
            
	    /**
	    * @property Boolean autoClear
	    * @brief if true clears ever frame
	    * @memberof CanvasRenderer2D
	    */
            this.autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
	    
	    /**
	    * @property Number time
	    * @brief How long in seconds it took to render last frame
	    * @memberof CanvasRenderer2D
	    */
	    this.time = 0;
	    
	    this._data = {
		images: {
		    "default": defaultImage
		}
	    };
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
		    background = scene.world.background,
		    ctx = this.context,
		    renderable, renderables = scene._renderables,
		    rigidbody, rigidbodies = scene._rigidbodies,
		    start = now(),
		    i;
		
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
		    
		    camera.setSize( w, h );
		    
		    if( this.canvas.fullScreen ){
			this.canvas.off("resize");
			this.canvas.on("resize", function(){
			    var ipr = 1 / self.pixelRatio,
				w = this.width * ipr,
				h = this.height * ipr,
				hw = this.width * 0.5,
				hh = this.height * 0.5;
			    
			    ctx.translate( hw, hh );
			    ctx.scale( hw, hh );
			    
			    camera.setSize( w, h );
			});
		    }
		    
		    lastCamera = camera;
		}
		
		if( this.autoClear ) this.clear();
		
		if( this.debug ){
		    for( i = rigidbodies.length; i--; ){
			rigidbody = rigidbodies[i];
			
			this.renderComponent( rigidbody, camera );
		    }
		}
		
		for( i = renderables.length; i--; ){
		    renderable = renderables[i];
		    
		    if( renderable.visible ) this.renderComponent( renderable, camera );
		}
		
		this.time = now() - start;
	    };
        }();
        
        
        CanvasRenderer2D.prototype.renderComponent = function(){
	    var modelViewProj = new Mat32,
		mvp = modelViewProj.elements;
	    
	    return function( component, camera ){
		var ctx = this.context,
		    images = this._data.images,
		    gameObject = component.gameObject,
		    offset = component.offset,
		    imageSrc = component.image,
		    radius = component.radius,
		    extents = component.extents,
		    vertices = component.vertices,
		    body = component.body, sleepState,
		    image = images[ imageSrc ],
		    vertex, x, y, i;
		
		if( !image && imageSrc ){
		    if( imageSrc === "default" ){
			image = images["default"];
		    }
		    else{
			image = new Image();
			image.src = imageSrc;
			images[ imageSrc ] = image;
		    }
		}
		
		gameObject.matrixModelView.mmul( gameObject.matrixWorld, camera.matrixWorldInverse );
		modelViewProj.mmul( gameObject.matrixModelView, camera.matrixProjection );
		
		ctx.save();
		
		ctx.transform( mvp[0], -mvp[2], -mvp[1], mvp[3], mvp[4], mvp[5] );
		ctx.scale( 1, -1 );
		
		if( component.image ){
		    ctx.drawImage(
			image,
			component.x, component.y,
			component.w, component.h,
			offset.x - component.width * 0.5,
			component.height * -0.5 - offset.y,
			component.width, component.height
		    );
		}
		if( radius || extents || vertices ){
		    if( body ) sleepState = body.sleepState;
		    
		    if( component.fill ) ctx.fillStyle = component.color ? component.color.rgba() : "#000000";
		    ctx.globalAlpha = component.alpha;
		    
		    if( sleepState === 3 ){
			ctx.globalAlpha *= 0.5;
		    }
		    
		    if( component.line ){
			ctx.strokeStyle = component.lineColor ? component.lineColor.rgba() : "#000000";
			ctx.lineWidth = component.lineWidth || this._invPixelRatio;
		    }
		    ctx.beginPath();
		    
		    if( radius ){
			if( component.body ){
			    ctx.lineTo( 0, 0 );
			}
			ctx.arc( 0, 0, radius, 0, TWO_PI );
		    }
		    else if( extents ){
			x = extents.x; y = extents.y;
			ctx.lineTo( x, y );
			ctx.lineTo( -x, y );
			ctx.lineTo( -x, -y );
			ctx.lineTo( x, -y );
		    }
		    else if( vertices ){
			for( i = vertices.length; i--; ){
			    vertex = vertices[i];
			    ctx.lineTo( vertex.x, vertex.y );
			}
		    }
		    
		    ctx.closePath();
		    if( component.fill ) ctx.fill();
		    if( component.line ){
			ctx.globalAlpha = 1;
			ctx.stroke();
		    }
		}
		
		ctx.restore();
	    };
	}();
	
        
        return CanvasRenderer2D;
    }
);