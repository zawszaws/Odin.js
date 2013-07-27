if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/mat32",
	"math/mat4",
	"core/components/sharedcomponent"
    ],
    function( Class, Mathf, Mat32, Mat4, SharedComponent ){
        "use strict";
	
	var EPSILON = Mathf.EPSILON;
	
        /**
	 * @class Camera2D
	 * @extends Component
	 * @brief camera is a device through which the player views the world
	 * @param Object opts sets Class properties from passed Object
	 */
        function Camera2D( opts ){
	    opts || ( opts = {} );
	    
            SharedComponent.call( this );
	    
	    /**
	    * @property Number clientWidth
	    * @brief client's screen width
	    * @memberof Camera2D
	    */
	    this.clientWidth = 960;
	    
	    /**
	    * @property Number clientHeight
	    * @brief client's screen height
	    * @memberof Camera2D
	    */
            this.clientHeight = 640;
            
	    /**
	    * @property Number zoom
	    * @brief zoom amount
	    * @memberof Camera2D
	    */
            this._zoom = opts.zoom !== undefined ? opts.zoom : 1;
	    
	    /**
	    * @property Number width
	    * @brief width of camera's lens
	    * @memberof Camera2D
	    */
	    this._width = this.clientWidth;
	    
	    /**
	    * @property Number height
	    * @brief height of camera's lens
	    * @memberof Camera2D
	    */
	    this._height = this.clientHeight;
	    
	    /**
	    * @property Number aspect
	    * @brief width / height
	    * @memberof Camera2D
	    */
	    this._aspect = this._width / this._height;
	    
	    /**
	    * @property Mat32 matrixProj
	    * @brief camera's projection matrix
	    * @memberof Camera2D
	    */
	    this.matrixProj = new Mat32;
	    this._matrixProj4 = new Mat4;
	    
	    /**
	    * @property Mat32 matrixProjInv
	    * @brief camera's inverse projection matrix
	    * @memberof Camera2D
	    */
	    this.matrixProjInv = new Mat32;
	    
	    /**
	    * @property Mat32 matrixWorldInv
	    * @brief camera's matrix world inverse
	    * @memberof Camera2D
	    */
	    this.matrixWorldInv = new Mat32;
	    
	    /**
	    * @property Mat32 matrixViewProj
	    * @brief camera's matrix view projection
	    * @memberof Camera2D
	    */
	    this.matrixViewProj = new Mat32;
	    
	    /**
	    * @property Mat32 matrixViewProjInv
	    * @brief camera's matrix view projection inverse
	    * @memberof Camera2D
	    */
	    this.matrixViewProjInv = new Mat32;
            
	    /**
	    * @property Mat32 needsUpdate
	    * @brief if true updates projection matrix
	    * @memberof Camera2D
	    */
            this.needsUpdate = true;
	}
        
	Class.extend( Camera2D, SharedComponent );
	
	
	Class.props( Camera2D.prototype, {
	    zoom: {
		get: function(){
		    return this._zoom;
		},
		set: function( value ){
		    this._zoom = value < EPSILON ? EPSILON : value;
		    this.needsUpdate = true;
		}
	    },
	    width: {
		get: function(){
		    return this._width;
		},
		set: function( value ){
		    this._width = value;
		    this._aspect = value / this._height;
		    this.needsUpdate = true;
		}
	    },
	    height: {
		get: function(){
		    return this._height;
		},
		set: function( value ){
		    this._height = value;
		    this._aspect = this._width / value;
		    this.needsUpdate = true;
		}
	    },
	    aspect: {
		get: function(){
		    return this._aspect;
		}
	    }
	});
	
	
	/**
	 * @method toWorld
	 * @memberof Camera2D
	 * @brief converts screen point to world space
	 * @param Vec2 v
	 */
	Camera2D.prototype.toWorld = function( v ){
	    
	    v.x = ( 2 * v.x / this.clientWidth ) - 1;
	    v.y = ( 2 * v.y / this.clientHeight ) - 1;
	    
	    v.applyMat32( this.matrixViewProjInv );
	};
	
	
	/**
	 * @method toScreen
	 * @memberof Camera2D
	 * @brief converts world point to screen space
	 * @param Vec2 v
	 */
	Camera2D.prototype.toScreen = function( v ){
	    v.applyMat32( this.matrixViewProj );
	    
	    v.x = ( ( v.x + 1 ) / 2 ) * this.clientWidth;
	    v.y = ( ( v.y + 1 ) / 2 ) * this.clientHeight;
	};
	
	
	/**
	 * @method init
	 * @memberof Camera2D
	 * @brief called when added to GameObject
	 */
	Camera2D.prototype.init = function(){
	    
	    this.update();
	};
	
	/**
	 * @method update
	 * @memberof Camera2D
	 * @brief called every frame
	 */
	Camera2D.prototype.update = function(){
	    var gameObject = this.gameObject,
		transform = gameObject.transform2d,
		matrixWorld = transform.matrixWorld,
		matrixProj = this.matrixProj,
		matrixProjInv = this.matrixProjInv;
	    
	    if( this.needsUpdate ){
		var zoom = this.zoom,
		    right = ( this.width * 0.5 ) * zoom,
		    left = -right,
		    top = ( this.height * 0.5 ) * zoom,
		    bottom = -top;
		    
		matrixProj.orthographic( left, right, top, bottom );
		matrixProjInv.minv( matrixProj );
		
		this._matrixProj4.orthographic( left, right, top, bottom, -1, 1 );
		
		this.needsUpdate = false;
	    }
	    
	    if( transform ){
		this.matrixWorldInv.minv( matrixWorld );
		this.matrixViewProj.mmul( this.matrixWorldInv, matrixProj );
		this.matrixViewProjInv.minv( this.matrixViewProj );
	    }
	};
	
	
	Camera2D.prototype.serverSync = function(){
	    var sync = this._SYNC;
	    
	    sync._class = this._class;
	    sync._SERVER_ID = this._id;
	    
	    sync.zoom = this.zoom;
	    
	    return sync;
	};
	
	
	Camera2D.prototype.clientSync = function( sync ){
	    
	    this._SERVER_ID = sync._SERVER_ID;
	    
	    this.zoom = sync.zoom;
	    
	    return this;
	};
	
	
	Camera2D.prototype.toJSON = function(){
	    var json = this._JSON,
		i;
	    
	    json._class = this._class;
	    json._SERVER_ID = this._id;
	    
	    json.zoom = this.zoom;
	    
	    return json;
	};
	
	
	Camera2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
	    this.zoom = json.zoom;
	    this.needsUpdate = true;
	    
	    return this;
	};
	
        
        return Camera2D;
    }
);