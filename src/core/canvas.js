if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/device",
	"base/dom",
    ],
    function( Class, Device, Dom ){
        "use strict";
        
	var addMeta = Dom.addMeta,
	    addEvent = Dom.addEvent;
	
        /**
	 * @class Canvas
	 * @extends Class
	 * @brief HTML5 Canvas Element Helper
	 * @param Number width the width of the Canvas in pixels
	 * @param Number height the height of the Cavnas in pixels
	 */
        function Canvas( width, height ){
            
            Class.call( this );
	    
	    /**
	    * @property String viewportId
	    * @brief id of this objects canvas element
	    * @memberof Canvas
	    */
	    this.viewportId = "viewport"+ this._id;
	    
	    addMeta( this.viewportId, "viewport", "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" );
	    addMeta( this.viewportId +"-width", "viewport", "width=device-width" );
	    addMeta( this.viewportId +"-height", "viewport", "height=device-height" );
	    
	    /**
	    * @property Object element
	    * @brief reference to Canvas Element
	    * @memberof Canvas
	    */
	    var element = document.createElement("canvas");
	    this.element = element; 
	    
	    /**
	    * @property Boolean fullScreen
	    * @brief if set to true canvas will adjust aspect to match screen 
	    * @memberof Canvas
	    */
	    this.fullScreen = false;
	    
	    /**
	    * @property Number width
	    * @brief the width of the Canvas Element
	    * @memberof Canvas
	    */
	    this.width = 960;
	    
	    /**
	    * @property Number height
	    * @brief the height of the Canvas Element
	    * @memberof Canvas
	    */
	    this.height = 640;
	    
	    if( !width && !height ){
		this.fullScreen = true;
		
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		
		this._aspect = window.innerWidth / window.innerHeight;
	    }
	    else{
		this.width = width !== undefined ? width : 960;
		this.height = height !== undefined ? height : 640;
	    }
	    
	    this._width = this.width;
	    this._height = this.height;
	    this._aspect = this._width / this._height;
	    
	    element.style.position = "absolute";
	    element.style.left = "50%";
	    element.style.top = "50%";
	    element.style.padding = "0px";
	    element.style.margin = "0px";
	    
	    element.marginLeft = -this.width * 0.5 +"px";
	    element.marginTop = -this.height * 0.5 +"px";
	    
	    element.style.width = Math.floor( this.width ) +"px";
	    element.style.height = Math.floor( this.height ) +"px";
	    element.width = this.width;
	    element.height = this.height;
	    
	    /**
	    * @property Object aspect
	    * @brief aspect ratio ( width / height )
	    * @memberof Canvas
	    */
	    this.aspect = this.width / this.height;
	    
	    element.oncontextmenu = function(){ return false; };
	    
	    document.body.appendChild( element );
	    
	    this.handleResize();
	    
	    addEvent( window, "resize orientationchange", this.handleResize, this );
        }
        
	Class.extend( Canvas, Class );
        
        /**
	 * @method set
	 * @memberof Canvas
	 * @brief sets width and height of the Canvas Element
	 * @param Number width the new width
	 * @param Number height the new height
	 */
	Canvas.prototype.set = function( width, height ){
	    if( !width || !height ){
		console.warn("Canvas.set: no width and or height specified using default width and height");
		return;
	    }
	    
	    width = width;
	    height = height;
	    
	    this.width = width;
	    this.height = height;
	    this.aspect = this.width / this.height;
	    
	    this.handleResize();
	};
	
	
        Canvas.prototype.handleResize = function(){
            var element = this.element,
		elementStyle = element.style,
		w = window.innerWidth,
		h = window.innerHeight,
		pixelRatio = Device.pixelRatio,
		aspect = w / h, width, height,
		id = "#"+ this.viewportId,
		viewportScale = document.querySelector( id ).getAttribute("content");
	    
	    
	    if( this.fullScreen ){
		this.aspect = w / h;
		
		if( this.aspect >= this._aspect ){
		    this.width = element.width = this._height * this.aspect;
		    this.height = element.height = this._height;
		}
		else{
		    this.width = element.width = this._width;
		    this.height = element.height = this._width / this.aspect;
		}
		
		width = w;
		height = h;
	    }
	    else{
		if( aspect >= this.aspect ){
		    width = h * this.aspect;
		    height = h;
		}
		else{
		    width = w;
		    height = w / this.aspect;
		}
	    }
	    
	    elementStyle.width = Math.floor( width ) +"px";
	    elementStyle.height = Math.floor( height ) +"px";
	    
	    elementStyle.marginLeft = -width * 0.5 +"px";
	    elementStyle.marginTop = -height * 0.5 +"px";
	    
	    document.querySelector( id ).setAttribute("content", viewportScale.replace(/-scale\s*=\s*[.0-9]+/g, "-scale=" + pixelRatio ) );
	    
	    document.querySelector( id +"-width").setAttribute("content", "width="+ w );
	    document.querySelector( id +"-height").setAttribute("content", "height="+ h );
	    
	    window.scrollTo( 0, 0 );
	    
	    this.trigger("resize");
        };
	
        
        return Canvas;
    }
);