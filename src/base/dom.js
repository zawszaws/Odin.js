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
	 * @brief DOM helper functions
	 */
	function Dom(){}
	
	/**
	 * @method addEvent
	 * @memberof Dom
	 * @brief adds event to object
	 * @param Object obj
	 * @param String name
	 * @param Function callback
	 * @param Object ctx
	 */
	Dom.prototype.addEvent = function( obj, name, callback, ctx ){
	    var names = name.split( splitter ), i,
		scope = ctx || obj,
		afn = function( e ){
		    e = e || window.event;
		    
		    if( callback ){
			callback.call( scope, e );
		    }
		};
            
	    for( i = names.length; i--; ){
		name = names[i];
		
		if( obj.attachEvent ){
		    obj.attachEvent( "on" + name, afn );
		}
		else{
		    obj.addEventListener( name, afn, false );
		}
	    }
	};
	
	/**
	 * @method removeEvent
	 * @memberof Dom
	 * @brief removes event from object
	 * @param Object obj
	 * @param String name
	 * @param Function callback
	 * @param Object ctx
	 */
	Dom.prototype.removeEvent = function( obj, name, callback, ctx ){
	    var names = name.split( splitter ), i, il,
		scope = ctx || obj,
		afn = function( e ){
		    e = e || window.event;
		    
		    if( callback ){
			callback.call( scope, e );
		    }
		};
            
	    for( i = 0, il = names.length; i < il; i++ ){
		name = names[i];
		
		if( obj.detachEvent ){
		    obj.detachEvent( "on" + name, afn );
		}
		else{
		    obj.removeEventListener( name, afn, false );
		}
	    }
	};
	
	/**
	 * @method addMeta
	 * @memberof Dom
	 * @brief adds meta data to header
	 * @param String id
	 * @param String name
	 * @param String content
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
	 * @brief request animation frame
	 * @param Function callback
	 */
	Dom.prototype.requestAnimationFrame = function(){
	    var request = (
		window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
		function( callback ){
		    window.setTimeout( callback, 50 / 3 );
		}
	    );
	    
	    return function( callback ){
		return request( callback );
	    }
	}();
	
	/**
	 * @method ajax
	 * @memberof Dom
	 * @brief ajax call helper
	 * @param String url
	 * @param Function callback
	 */
	Dom.prototype.ajax = function( url, callback ){
	    var request = new XMLHttpRequest;
	    
	    request.onreadystatechange = function(){
                
                if( request.readyState === 1 ){
                    request.send();
                }
                
                if( request.readyState === 4 ){
                    if( request.status === 404 ){
                        console.warn("Dom.ajax: 404 - file not found");
                    }
                    else{
                        callback( request.responseText );
                    }
                }
            }
            
            request.open("GET", url, true );
	}
	
	/**
	 * @method getWebGLContext
	 * @memberof Dom
	 * @brief gets webgl context from canvas
	 * @param HTMLCanvasElement canvas
	 * @param Object attributes
	 */
	Dom.prototype.getWebGLContext = function(){
	    var names = ["webgl", "webkit-3d", "moz-webgl", "experimental-webgl", "3d"],
		defaultAttributes = {
		    alpha: true,
		    antialias: true,
		    depth: true,
		    premultipliedAlpha: true,
		    preserveDrawingBuffer: false,
		    stencil: true
		};
	    
	    return function( canvas, attributes ){
		var key, value, gl, i = 0, name;
		
		attributes || ( attributes = {} );
		
		for( key in defaultAttributes ){
		    if( typeof attributes[ key ] === "undefined" ){
			attributes[ key ] = defaultAttributes[ key ];
		    }
		}
		
		for( i = names.length; i--; ){
		    gl = canvas.getContext( names[i], attributes );
		    
		    if( gl ) break;
		}
		
		if( !gl ) console.warn("Dom.getWebGLContext: could not get webgl context" );
		
		return gl;
	    };
	}();
	
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
		console.warn("Dom.createShader: no shader with type "+ type );
	    }
            
            gl.shaderSource( shader, source );
            gl.compileShader( shader );
            
            if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ){
                console.warn("Dom.createShader: problem compiling shader "+ gl.getShaderInfoLog( shader ) );
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
                console.warn("Dom.createProgram: problem compiling Program "+ gl.getProgramInfoLog( program ) );
                gl.deleteProgram( program );
                return undefined;
            }
            
            return program;
        };
	
	
	return new Dom;
    }
);