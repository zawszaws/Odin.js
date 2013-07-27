if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/device",
	"core/canvas",
	"math/mathf",
	"math/color",
	"math/mat32",
	"math/mat4",
	"core/components/sprite2d"
    ],
    function( Class, Dom, Device, Canvas, Mathf, Color, Mat32, Mat4, Sprite2D ){
	"use strict";
	
	var createProgram = Dom.createProgram,
	    isPowerOfTwo = Mathf.isPowerOfTwo,
	    toPowerOfTwo = Mathf.toPowerOfTwo,
	    
	    regAttribute = /attribute\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/,
	    regUniform = /uniform\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/;
	
	
	function parseUniformsAttributes( gl, shader ){
	    var src = shader.vertexShader + shader.fragmentShader,
		lines = src.split("\n"), matchAttributes, matchUniforms,
		name, length, line,
		i, j;
	    
	    for( i = lines.length; i--; ) {
		line = lines[i];
		matchAttributes = line.match( regAttribute );
		matchUniforms = line.match( regUniform );
		
		if( matchAttributes ){
		    name = matchAttributes[3];
		    shader.attributes[ name ] = gl.getAttribLocation( shader.program, name );
		}
		if( matchUniforms ){
		    name = matchUniforms[3];
		    length = parseInt( matchUniforms[5] );
		    
		    if( length ){
			shader.uniforms[ name ] = [];
			
			for( j = length; j--; ){
			    shader.uniforms[ name ][j] = gl.getUniformLocation( shader.program, name +"["+ j +"]" );
			}
		    }
		    else{
			shader.uniforms[ name ] = gl.getUniformLocation( shader.program, name );
		    }
		}
	    }
	}
	
	
	function buildTexture( renderer, imageAsset ){
	    if( !imageAsset.glData.needsUpdate ) return;
	    
	    var gl = renderer.context,
		gpu = renderer.gpu,
		ext = renderer.ext,
		assetGLData = imageAsset.glData,
		image = imageAsset.data,
		texture = gl.createTexture(),
		
		isPOT = isPowerOfTwo( image.width ) && isPowerOfTwo( image.height ),
		
		TEXTURE_2D = gl.TEXTURE_2D,
		MAG_FILTER = gl.LINEAR,
		MIN_FILTER = isPOT ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR,
		WRAP = isPOT ? gl.REPEAT : gl.CLAMP_TO_EDGE,
		RGBA = gl.RGBA;
	    
	    gl.bindTexture( TEXTURE_2D, texture );
	    
	    gl.texImage2D( TEXTURE_2D, 0, RGBA, RGBA, gl.UNSIGNED_BYTE, image );
	    
	    gl.texParameteri( TEXTURE_2D, gl.TEXTURE_MAG_FILTER, MAG_FILTER );
	    gl.texParameteri( TEXTURE_2D, gl.TEXTURE_MIN_FILTER, MIN_FILTER );
	    
	    gl.texParameteri( TEXTURE_2D, gl.TEXTURE_WRAP_S, WRAP );
	    gl.texParameteri( TEXTURE_2D, gl.TEXTURE_WRAP_T, WRAP );
	    
	    if( isPOT ) gl.generateMipmap( TEXTURE_2D );
	    
	    gl.bindTexture( TEXTURE_2D, null );
	    
	    assetGLData.texture = texture;
	    assetGLData.needsUpdate = false;
        }
	
	
	function spriteVertexShader( precision ){
	    
	    return [
		"precision "+ precision +" float;",
		
                "uniform mat4 uMatrix;",
                "uniform vec4 uCrop;",
                "uniform vec2 uScale;",
                
                "attribute vec2 aVertexPosition;",
                "attribute vec2 aVertexUv;",
		
                "varying vec2 vVertexUv;",
                
                "void main(){",
                    
		    "vVertexUv = vec2( aVertexUv.x * uCrop.z, aVertexUv.y * uCrop.w ) + uCrop.xy;",
		    
                    "gl_Position = uMatrix * vec4( aVertexPosition * uScale, 0.0, 1.0 );",
                "}"
	    ].join("\n");
	}
	
	
	function spriteFragmentShader( precision ){
	    
	    return [
		"precision "+ precision +" float;",
		
                "uniform float uAlpha;",
                "uniform sampler2D uTexture;",
		
                "varying vec2 vVertexUv;",
                
                "void main(){",
		    "vec4 finalColor = texture2D( uTexture, vVertexUv );",
		    "finalColor.w *= uAlpha;",
		    
                    "gl_FragColor = finalColor;",
                "}"
	    ].join("\n");
	}
	
	/**
	 * @class WebGLRenderer2D
	 * @extends Class
	 * @brief WebGL 2D Renderer
	 * @param Object opts sets Class properties from passed Object
	 */
        function WebGLRenderer2D( opts ){
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
	    * @property WebGLRenderingContext context
	    * @brief this Canvas's Context
	    * @memberof WebGLRenderer2D
	    */
	    opts.attributes || ( opts.attributes = {} );
	    opts.attributes.depth = false;
            this.context = Dom.getWebGLContext( this.canvas.element, opts.attributes );
            
	    /**
	    * @property Boolean autoClear
	    * @brief if true clears ever frame
	    * @memberof WebGLRenderer2D
	    */
            this.autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
	    
	    /**
	    * @property Object ext
	    * @brief WebGL extension's data
	    * @memberof WebGLRenderer2D
	    */
	    this.ext = {
		texture_filter_anisotropic: undefined,
		texture_float: undefined,
		standard_derivatives: undefined,
		compressed_texture_s3tc: undefined
	    };
	    
	    /**
	    * @property Object gpu
	    * @brief user's gpu information
	    * @memberof WebGLRenderer2D
	    */
	    this.gpu = {
		precision: "highp",
		maxAnisotropy: 16,
		maxTextures: 16,
		maxTextureSize: 16384,
		maxCubeTextureSize: 16384,
		maxRenderBufferSize: 16384
	    };
	    
	    this.glData = {
		sprite: {
		    vertexBuffer: undefined,
		    indexBuffer: undefined,
		    uvBuffer: undefined,
		    
		    vertexShader: undefined,
		    fragmentShader: undefined,
		    
		    program: undefined,
		    uniforms: {},
		    attributes: {}
		}
	    }
	    
            this.setDefault();
        }
        
	Class.extend( WebGLRenderer2D, Class );
        
        
        WebGLRenderer2D.prototype.getExtensions = function(){
	    var gl = this.context,
		ext = this.ext,
		
		texture_filter_anisotropic = gl.getExtension( "EXT_texture_filter_anisotropic" ) ||
		    gl.getExtension( "MOZ_EXT_texture_filter_anisotropic" ) ||
		    gl.getExtension( "WEBKIT_EXT_texture_filter_anisotropic" ),
		    
		compressed_texture_s3tc = gl.getExtension( "WEBGL_compressed_texture_s3tc" ) ||
		    gl.getExtension( "MOZ_WEBGL_compressed_texture_s3tc" ) ||
		    gl.getExtension( "WEBKIT_WEBGL_compressed_texture_s3tc" ),
		    
		standard_derivatives = gl.getExtension("OES_standard_derivatives"),
		
		texture_float = gl.getExtension("OES_texture_float");
		
	    ext.texture_filter_anisotropic = texture_filter_anisotropic;
	    ext.standard_derivatives = standard_derivatives;
	    ext.texture_float = texture_float;
	    ext.compressed_texture_s3tc = compressed_texture_s3tc;
        };
        
        
        WebGLRenderer2D.prototype.getGPUCapabilities = function(){
	    var gl = this.context,
		gpu = this.gpu, ext = this.ext,
		
		VERTEX_SHADER = gl.VERTEX_SHADER,
		FRAGMENT_SHADER = gl.FRAGMENT_SHADER,
		HIGH_FLOAT = gl.HIGH_FLOAT,
		MEDIUM_FLOAT = gl.MEDIUM_FLOAT,
		LOW_FLOAT = gl.LOW_FLOAT,
		
		shaderPrecision = typeof gl.getShaderPrecisionFormat !== "undefined",
		
		maxAnisotropy = ext.texture_filter_anisotropic ? gl.getParameter( ext.texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT ) : 1,
		
		maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS ),
		
		maxTextureSize = gl.getParameter( gl.MAX_TEXTURE_SIZE ),
		
		maxCubeTextureSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE ),
		
		maxRenderBufferSize = gl.getParameter( gl.MAX_RENDERBUFFER_SIZE ),
		
		vsHighpFloat = shaderPrecision ? gl.getShaderPrecisionFormat( VERTEX_SHADER, HIGH_FLOAT ) : 0,
		vsMediumpFloat = shaderPrecision ? gl.getShaderPrecisionFormat( VERTEX_SHADER, MEDIUM_FLOAT ) : 23,
		
		fsHighpFloat = shaderPrecision ? gl.getShaderPrecisionFormat( FRAGMENT_SHADER, HIGH_FLOAT ) : 0,
		fsMediumpFloat = shaderPrecision ? gl.getShaderPrecisionFormat( FRAGMENT_SHADER, MEDIUM_FLOAT ) : 23,
		
		highpAvailable = vsHighpFloat.precision > 0 && fsHighpFloat.precision > 0,
		mediumpAvailable = vsMediumpFloat.precision > 0 && fsMediumpFloat.precision > 0,
		
		precision = "highp";
	    
	    if( !highpAvailable || Device.mobile ){
		if( mediumpAvailable ){
		    precision = "mediump";
		}
		else{
		    precision = "lowp";
		}
	    }
	    
	    gpu.precision = precision;
	    gpu.maxAnisotropy = maxAnisotropy;
	    gpu.maxTextures = maxTextures;
	    gpu.maxTextureSize = maxTextureSize;
	    gpu.maxCubeTextureSize = maxCubeTextureSize;
	    gpu.maxRenderBufferSize = maxRenderBufferSize;
        };
	
	/**
	 * @method setDefault
	 * @memberof WebGLRenderer2D
	 * @brief sets WebGL context to default settings
	 */
        WebGLRenderer2D.prototype.setDefault = function(){
	    var spriteVertices = new Float32Array([
		    1, 1,
		    -1, 1,
		    -1, -1,
		    1, -1
		]),
		spriteUvs = new Float32Array([
		    1, 0,
		    0, 0,
		    0, 1,
		    1, 1
		]),
		spriteIndices = new Uint16Array([
		    0, 1, 2,
		    0, 2, 3
		]);
	    
	    return function(){
		var gl = this.context,
		    glData = this.glData,
		    gpu = this.gpu, precision,
		    particle = glData.particle,
		    sprite = glData.sprite;
		
		this.getExtensions();
		this.getGPUCapabilities();
		precision = gpu.precision;
		
		gl.clearColor( 0, 0, 0, 1 );
		gl.clearDepth( 0 );
		gl.clearStencil( 0 );
		
		gl.frontFace( gl.CCW );
		gl.cullFace( gl.BACK );
		gl.enable( gl.CULL_FACE );
		
		gl.enable( gl.BLEND );
		gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
		gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
		
		sprite.vertexBuffer = sprite.vertexBuffer || gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, sprite.vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, spriteVertices, gl.STATIC_DRAW );
		
		sprite.uvBuffer = sprite.uvBuffer || gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, sprite.uvBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, spriteUvs, gl.STATIC_DRAW );
		
		sprite.indexBuffer = sprite.indexBuffer || gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, sprite.indexBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, spriteIndices, gl.STATIC_DRAW );
		
		sprite.vertexShader = spriteVertexShader( precision );
		sprite.fragmentShader = spriteFragmentShader( precision );
		sprite.program = createProgram( gl, sprite.vertexShader, sprite.fragmentShader );
		parseUniformsAttributes( gl, sprite );
	    };
	}();
	
        /**
	 * @method setClearColor
	 * @memberof WebGLRenderer2D
	 * @brief sets background color
	 * @param Color color color to set background too
	 */
        WebGLRenderer2D.prototype.setClearColor = function( color ){
            
            if( color ){
                this.context.clearColor( color.r, color.g, color.b, color.a );
            }
            else{
                this.context.clearColor( 0, 0, 0, 1 );
            }
	};
	
        /**
	 * @method clear
	 * @memberof WebGLRenderer2D
	 * @brief clears canvas
	 */
        WebGLRenderer2D.prototype.clear = function(){
            var gl = this.context;
	    
            gl.clear( gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
	};
	
        /**
	 * @method setBlending
	 * @memberof WebGLRenderer2D
	 * @brief sets webgl blending mode( empty - default, 0 - none, 1 - additive, 2 - subtractive, or 3 - multiply  )
	 * @param Number blending 
	 */
        WebGLRenderer2D.prototype.setBlending = function(){
	    var lastBlending, gl;
	    
	    return function( blending ){
		gl = this.context;
		
		if( blending !== lastBlending ){
		    
		    switch( blending ){
			case WebGLRenderer2D.none:
			    gl.disable( gl.BLEND );
			    break;
			
			case WebGLRenderer2D.additive:
			    gl.enable( gl.BLEND );
			    gl.blendEquation( gl.FUNC_ADD );
			    gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
			    break;
			
			case WebGLRenderer2D.subtractive:
			    gl.enable( gl.BLEND );
			    gl.blendEquation( gl.FUNC_ADD );
			    gl.blendFunc( gl.ZERO, gl.ONE_MINUS_SRC_COLOR );
			    break;
			
			case WebGLRenderer2D.multiply:
			    gl.enable( gl.BLEND );
			    gl.blendEquation( gl.FUNC_ADD );
			    gl.blendFunc( gl.ZERO, gl.SRC_COLOR );
			    break;
			
			default:
			    gl.enable( gl.BLEND );
			    gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
			    gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
			    break;
		    }
		    
		    lastBlending = blending;
		}
	    };
	}();
        
        /**
	 * @method setLineWidth
	 * @memberof WebGLRenderer2D
	 * @brief sets webgl line width
	 * @param Number width 
	 */
        WebGLRenderer2D.prototype.setLineWidth = function(){
	    var lastLineWidth = 1;
	    
	    return function( width ){
		
		if( width !== lastLineWidth ){
		    this.context.lineWidth( width * this.pixelRatio );
		    lastLineWidth = width;
		}
	    };
	}();
        
        /**
	 * @method render
	 * @memberof WebGLRenderer2D
	 * @brief renders scene from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
        WebGLRenderer2D.prototype.render = function(){
	    var lastScene, lastCamera, lastBackground = new Color;
	    
	    return function( scene, camera ){
		var self = this,
		    gl = this.context,
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
			h = canvas.height * ipr;
		    
		    camera.width = w;
		    camera.height = h;
		    camera.clientWidth = canvas.width;
		    camera.clientHeight = canvas.height;
		    gl.viewport( 0, 0, canvas.width, canvas.height );
		    
		    if( canvas.fullScreen ){
			canvas.off("resize");
			canvas.on("resize", function(){
			    var ipr = 1 / self.pixelRatio,
				w = this.width * ipr,
				h = this.height * ipr;
			    
			    camera.width = w;
			    camera.height = h;
			    camera.clientWidth = this.width;
			    camera.clientHeight = this.height;
			    gl.viewport( 0, 0, this.width, this.height );
			});
		    }
		    
		    lastCamera = camera;
		}
		
		if( this.autoClear ) this.clear();
		
		this.renderComponents( scene, camera );
	    };
        }();
        
	var lastComponent;
        /**
	 * @method renderComponents
	 * @memberof WebGLRenderer2D
	 * @brief renders scene's components from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
        WebGLRenderer2D.prototype.renderComponents = function(){
	    var emptyArray = [],
		modelView = new Mat4,
		modelViewProj = new Mat4,
		mvp = modelViewProj.elements;
	    
	    return function( scene, camera ){
		var gl = this.context,
		    
		    sprites = scene.sprite2d || emptyArray, sprite,
		    transform,
		    i;
		
		for( i = sprites.length; i--; ){
		    sprite = sprites[i];
		    transform = sprite.gameObject.transform2d;
		    
		    if( !transform || !sprite.visible ) continue;
		    
		    transform.updateModelView( camera );
		    modelView.fromMat32( transform.matrixModelView );
		    modelViewProj.mmul( camera._matrixProj4, modelView );
		    
		    this.renderSprite( sprite, mvp );
		}
	    };
	}();
        
        
        WebGLRenderer2D.prototype.renderSprite = function( sprite, mvp ){
	    var gl = this.context,
		glData = this.glData,
		
		glSprite = glData.sprite,
		attributes = glSprite.attributes, uniforms = glSprite.uniforms,
		
		imageAsset = sprite.image, alpha = sprite.alpha,
		texture, image, width, height, w, h;
	    
	    if( !( lastComponent instanceof Sprite2D ) ){
		gl.useProgram( glSprite.program );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, glSprite.vertexBuffer );
		gl.enableVertexAttribArray( attributes.aVertexPosition );
		gl.vertexAttribPointer( attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0 );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, glSprite.uvBuffer );
		gl.enableVertexAttribArray( attributes.aVertexUv );
		gl.vertexAttribPointer( attributes.aVertexUv, 2, gl.FLOAT, false, 0, 0 );
		
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, glSprite.indexBuffer );
	    }
	    
	    if( imageAsset ){
		buildTexture( this, imageAsset );
		
		texture = imageAsset.glData.texture;
		image = imageAsset.data;
		
		width = sprite.width;
		height = sprite.height;
		w = 1 / image.width;
		h = 1 / image.height;
	    }
	    else{
		console.warn( this+".renderSprite: can\'t render sprite without an ImageAsset");
		return;
	    }
	    
	    gl.uniformMatrix4fv( uniforms.uMatrix, false, mvp );
	    
	    gl.activeTexture( gl.TEXTURE0 );
	    gl.bindTexture( gl.TEXTURE_2D, texture );
	    gl.uniform1i( uniforms.uTexture, 0 );
	    
	    gl.uniform4f( uniforms.uCrop, sprite.x * w, sprite.y * h, sprite.w * w, sprite.h * h );
	    
	    gl.uniform1f( uniforms.uAlpha, alpha );
	    gl.uniform2f( uniforms.uScale, width * 0.5, height * 0.5 );
	    
	    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
	    
	    lastComponent = sprite;
	};
	
	
	WebGLRenderer2D.none = 0;
	WebGLRenderer2D.additive = 1;
	WebGLRenderer2D.subtractive = 2;
	WebGLRenderer2D.multiply = 3;
	
        
        return WebGLRenderer2D;
    }
);