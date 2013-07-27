if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/vec2",
	"core/assets/assets",
	"core/components/sharedcomponent"
    ],
    function( Class, Time, Vec2, Assets, SharedComponent ){
        "use strict";
	
        /**
	 * @class Sprite2D
	 * @extends SharedComponent
	 * @brief 2D Sprite Component
	 * @param Object opts sets Class properties from passed Object
	 */
        function Sprite2D( opts ){
            opts || ( opts = {} );
	    
            SharedComponent.call( this );
	    
	    /**
	    * @property Boolean visible
	    * @brief is the sprite visible to the renderer
	    * @memberof Sprite2D
	    */
	    this.visible = opts.visible !== undefined ? !!opts.visible : true;
	    
	    /**
	    * @property Number z
	    * @brief high numbers are rendered in front
	    * @memberof Sprite2D
	    */
	    this.z = opts.z !== undefined ? opts.z : 0;
	    
	    /**
	    * @property Number alpha
	    * @brief total alpha of sprite
	    * @memberof Sprite2D
	    */
	    this.alpha = opts.alpha !== undefined ? opts.alpha : 1;
	    
	    /**
	    * @property ImageAsset image
	    * @memberof Sprite2D
	    */
	    this.image = opts.image !== undefined ? opts.image : undefined;
	    
	    /**
	    * @property Number width
	    * @brief width of Sprite
	    * @memberof Sprite2D
	    */
	    this.width = opts.width || 1;
	    
	    /**
	    * @property Number height
	    * @brief height of Sprite
	    * @memberof Sprite2D
	    */
	    this.height = opts.height || 1;
	    
	    /**
	    * @property Number x
	    * @brief source x position of image
	    * @memberof Sprite2D
	    */
            this.x = opts.x || 0;
	    
	    /**
	    * @property Number y
	    * @brief source y position of image
	    * @memberof Sprite2D
	    */
            this.y = opts.y || 0;
            
	    /**
	    * @property Number w
	    * @brief source width of image
	    * @memberof Sprite2D
	    */
            this.w = opts.w || 64;
	    
	    /**
	    * @property Number h
	    * @brief source height of image
	    * @memberof Sprite2D
	    */
            this.h = opts.h || 64;
	    
	    /**
	    * @property SpriteSheetAsset animations
	    * @brief { "name": [ frame1 [ x, y, w, h, frameTime in seconds ], frame2, frame3... ] }
	    * @memberof Sprite2D
	    */
	    this.animations = opts.animations;
	    
	    /**
	    * @property String animation
	    * @brief active animation
	    * @memberof Sprite2D
	    */
	    this.animation = "idle";
	    
	    /**
	    * @property Enum mode
	    * @brief animation playback type ( 0 - Sprite2D.ONCE, 1 - Sprite2D.LOOP, or 2 - Sprite2D.PINGPONG )
	    * @memberof Sprite2D
	    */
	    this.mode = opts.mode !== undefined ? opts.mode : Sprite2D.LOOP;
	    
	    /**
	    * @property Number rate
	    * @brief animation playback rate, defaults to 1
	    * @memberof Sprite2D
	    */
	    this.rate = opts.rate !== undefined ? opts.rate : 1;
	    
	    this._time = 0;
	    this._frame = 0;
	    this._order = 1;
	    
	    /**
	    * @property Boolean playing
	    * @brief is playing animation
	    * @memberof Sprite2D
	    */
	    this.playing = this.animations ? true : false;
        }
        
	Class.extend( Sprite2D, SharedComponent );
	
	/**
	 * @method play
	 * @memberof Sprite2D
	 * @brief plays animation with name and playback mode
	 * @param String name
	 * @param Enum mode
	 */
	Sprite2D.prototype.play = function( name, mode, rate ){
	    
	    if( ( !this.playing || this.animation !== name ) && this.animations[ name ] ){
		this.animation = name;
		this.rate = rate || this.rate;
		
		if( this.mode === Sprite2D.ONCE ){
		    this._frame = 0;
		}
		
		switch( mode ){
		    
		    case Sprite2D.PINGPONG:
		    case "pingpong":
			this.mode = Sprite2D.PINGPONG;
			break;
		    
		    case Sprite2D.ONCE:
		    case "once":
			this.mode = Sprite2D.ONCE;
			this._frame = 0;
			break;
		    
		    case Sprite2D.LOOP:
		    case "loop":
		    default:
			this.mode = Sprite2D.LOOP;
		}
		
		this.playing = true;
		this.trigger("play", name );
	    }
	};
	
	/**
	 * @method stop
	 * @memberof Sprite2D
	 * @brief stops animation
	 */
	Sprite2D.prototype.stop = function(){
	    
	    if( this.playing ) this.trigger("stop");
	    this.playing = false;
	};
	
	/**
	 * @method update
	 * @memberof Sprite2D
	 * @brief called every frame
	 */
	Sprite2D.prototype.update = function(){
	    var animations = this.animations,
		animation = animations && animations.data ? animations.data[ this.animation ] : undefined;
	    
	    if( !animation ) return;
	    
	    var frame = this._frame, frames = animation.length - 1,
		order = this._order, mode = this.mode,
		currentFrame = animation[ frame ],
		frameTime = currentFrame[4],
		currentFrame;
	    
	    if( this.playing ){
		this._time += Time.delta * this.rate;
		
		if( this._time >= frameTime ){
		    this._time = 0;
		    
		    if( currentFrame ){
			this.x = currentFrame[0];
			this.y = currentFrame[1];
			this.w = currentFrame[2];
			this.h = currentFrame[3];
		    }
		    
		    if( mode === Sprite2D.PINGPONG ){
			if( order === 1 ){
			    if( frame >= frames ){
				this._order = -1;
			    }
			    else{
				this._frame++;
			    }
			}
			else{
			    if( frame <= 0 ){
				this._order = 1;
			    }
			    else{
				this._frame--;
			    }
			}
		    }
		    else{
			if( frame >= frames ){
			    if( mode === Sprite2D.LOOP ){
				this._frame = 0;
			    }
			    else if( mode === Sprite2D.ONCE ){
				this.stop();
			    }
			}
			else{
			    this._frame++;
			}
		    }
		}
	    }
	};
	
	
	Sprite2D.prototype.toJSON = function(){
	    var json = this._JSON,
		image = this.image,
		i;
	    
	    json._class = this._class;
	    json._SERVER_ID = this._id;
	    
	    json.image = image ? image.name : undefined;
	    
	    return json;
	};
	
	
	Sprite2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
	    this.image = json.image ? Assets.get( json.image ) : undefined;
	    
	    return this;
	};
	
	
	Sprite2D.ONCE = 1;
	Sprite2D.LOOP = 2;
	Sprite2D.PINGPONG = 3;
	
        
        return Sprite2D;
    }
);