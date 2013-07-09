if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	var splitter = /\s*[\s,]\s*/,
	    createShader;
	
	/**
	 * @class Dom
	 * @brief dom functions
	 */
	function Dom(){}
	
	/**
	 * @method addEvent
	 * @memberof Dom
	 * @brief adds event to object
	 * @param Object context object to add event to
	 * @param String name event name or list of events separated by a space
	 * @param Function callback event handler function
	 * @param Object ctx context of callback
	 */
	Dom.prototype.addEvent = function( context, name, callback, ctx ){
	    var names = name.split( splitter ), i, il,
		scope = ctx || context,
		afn = function( e ){
		    e = e || window.event;
		    
		    if( callback ){
			callback.call( scope, e );
		    }
		};
            
	    for( i = 0, il = names.length; i < il; i++ ){
		name = names[i];
		
		if( context.attachEvent ){
		    context.attachEvent( "on" + name, afn );
		}
		else{
		    context.addEventListener( name, afn, false );
		}
	    }
	};
	
	/**
	 * @method removeEvent
	 * @memberof Dom
	 * @brief removes event from object
	 * @param Object context object to remove event from
	 * @param String name event name or list of events separated by a space
	 * @param Function callback event handler function
	 * @param Object ctx context of callback
	 */
	Dom.prototype.removeEvent = function( context, name, callback, ctx ){
	    var names = name.split( splitter ), i, il,
		scope = ctx || context,
		afn = function( e ){
		    e = e || window.event;
		    
		    if( callback ){
			callback.call( scope, e );
		    }
		};
            
	    for( i = 0, il = names.length; i < il; i++ ){
		name = names[i];
		
		if( context.detachEvent ){
		    context.detachEvent( "on" + name, afn );
		}
		else{
		    context.removeEventListener( name, afn, false );
		}
	    }
	};
	
	/**
	 * @method addMeta
	 * @memberof Dom
	 * @brief removes event from object
	 * @param String id id of the element
	 * @param String name meta name
	 * @param String content content of meta
	 */
	Dom.prototype.addMeta = function( id, name, content ){
	    var meta = document.createElement("meta"),
		head = document.getElementsByTagName("head")[0];
	    
	    if( id ) meta.id = id;
	    if( name ) meta.name = name;
	    if( content ) meta.content = content;
	    
	    head.insertBefore( meta, head.firstChild );
        };
	
	/**
	 * @property Object audioContext
	 * @memberof Dom
	 * @brief audio context of dom
	 */
	Dom.prototype.audioContext = function(){
	    return (
		window.audioContext || 
		window.webkitAudioContext || 
		window.mozAudioContext || 
		window.oAudioContext || 
		window.msAudioContext
	    );
	}();
	
	/**
	 * @method requestAnimFrame
	 * @memberof Dom
	 * @brief request Animation Frame
	 * @param Function callback function to be called
	 */
	Dom.prototype.requestAnimFrame = function(){
	    var request = (
		window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
		function( callback, element ){
		    window.setTimeout(function(){
			callback( Date.now() );
		    }, 50/3 );
		}
	    );
	    
	    return function( callback, element ){
		request.call( window, callback, element );
	    };
	}();
	
	/**
	 * @method cancelAnimFrame
	 * @memberof Dom
	 * @brief cancel Animation Frame
	 */
	Dom.prototype.cancelAnimFrame = function( id ){
	    window.clearTimeout( id );
	};
	
	/**
	 * @method getWebGLContext
	 * @memberof Dom
	 * @brief gets webgl context from canvas
	 * @param HTMLCanvasElement canvas html canvas element
	 * @param Object attributes webgl attributes list
	 */
	Dom.prototype.getWebGLContext = function(){
	    var defaultAttributes = {
		alpha: true,
		antialias: true,
		depth: true,
		premultipliedAlpha: true,
		preserveDrawingBuffer: false,
		stencil: true
	    },
	    names = ["webgl", "webkit-3d", "moz-webgl", "experimental-webgl", "3d"];
	    
	    return function( canvas, attributes ){
		attributes = !!attributes ? attributes : defaultAttributes;
		
		var gl, i = 0, name;
		    
		for( i; i < names.length; i++ ){
		    
		    gl = canvas.getContext( names[i], attributes );
		    
		    if( !!gl ){
			break;
		    }
		}
		
		if( !gl ){
		    throw new Error("Dom.getWebGLContext: WebGL Context Creation Failed" );
		}
		
		return gl;
	    };
	}();
	
	/**
	 * @method get2DContext
	 * @memberof Dom
	 * @brief gets 2d context of canvas
	 * @param HTMLCanvasElement canvas html canvas element
	 */
	Dom.prototype.get2DContext = function( canvas ){
	    var gl = canvas.getContext("2d");
	    
	    if( !gl ){
		throw new Error("Dom.get2DContext: Canvas 2D Context Creation Failed" );
	    }
	    
	    return gl;
	};
	
	/**
	 * @method createShader
	 * @memberof Dom
	 * @brief creates shader from string
	 * @param Object gl webgl context
	 * @param Object type webgl shader type( gl.FRAGMENT_SHADER or gl.VERTEX_SHADER )
	 * @param String source shader source
	 */
        Dom.prototype.createShader = createShader = function( gl, type, source ){
            var shader;
            
            if( type === "fragment" ){
                shader = gl.createShader( gl.FRAGMENT_SHADER );
            }
            else if( type === "vertex" ){
                shader = gl.createShader( gl.VERTEX_SHADER );
            }
	    else{
		throw new Error("Dom.createShader: no shader with type "+ type );
	    }
            
            gl.shaderSource( shader, source );
            gl.compileShader( shader );
            
            if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ){
                throw Error("Dom.createShader: problem compiling shader "+ gl.getShaderInfoLog( shader ) );
                gl.deleteShader( shader );
                return undefined;
            }
            
            return shader;
        };
        
        /**
	 * @method createProgram
	 * @memberof Dom
	 * @brief creates program from vertex shader and fragment shader
	 * @param Object gl webgl context
	 * @param String vertex vertex shader source
	 * @param String fragment fragment shader source
	 */
        Dom.prototype.createProgram = function( gl, vertex, fragment ){
            var program = gl.createProgram(),
                shader;
            
	    shader = createShader( gl, "vertex", vertex );
	    gl.attachShader( program, shader );
	    gl.deleteShader( shader );
	    
	    shader = createShader( gl, "fragment", fragment );
	    gl.attachShader( program, shader );
	    gl.deleteShader( shader );
            
            gl.linkProgram( program );
            gl.validateProgram( program );
            gl.useProgram( program );
            
            if( !gl.getProgramParameter( program, gl.LINK_STATUS ) ){
                throw Error("Dom.createProgram: problem compiling Program "+ gl.getProgramInfoLog( program ) );
                gl.deleteProgram( program );
                return undefined;
            }
            
            return program;
        };
	
	
	return new Dom;
    }
);