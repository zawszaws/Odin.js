if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
        "use strict";
	
	var start = Date.now() * 0.001,
	    globalFixed = 1/60,
	    delta = 1/60;
	
	
        /**
	 * @class Time
	 * @brief Object to get time information
	 */
	function Time(){
	    
	    /**
	    * @property Number start
	    * @brief start time stamp of game
	    * @memberof Time
	    */
	    this.start = start;
	    
	    /**
	    * @property Number sinceStart
	    * @brief real time in seconds since the game started
	    * @memberof Time
	    */
	    this.sinceStart = 0;
	    
	    /**
	    * @property Number sceneStart
	    * @brief time the scene started
	    * @memberof Time
	    */
	    this.sceneStart = 0;
	    
	    /**
	    * @property Number sinceSceneStart
	    * @brief time since scene started
	    * @memberof Time
	    */
	    this.sinceSceneStart = 0;
	    
	    /**
	    * @property Number time
	    * @brief time that this frame started
	    * @memberof Time
	    */
	    this.time = 0;
	    
	    /**
	    * @property Number scale
	    * @brief scale at which time is passing
	    * @memberof Time
	    */
	    this._scale = 1;
	    
	    /**
	    * @property Number delta
	    * @brief time in seconds it took to complete the last frame
	    * @memberof Time
	    */
	    this.delta = delta;
	    
	    /**
	    * @property Number fixedDelta
	    * @brief interval in seconds at which physics and other fixed frame rate updates are performed
	    * @memberof Time
	    */
	    this._fixedDelta = globalFixed;
	    
	    /**
	    * @property Number frameCount
	    * @brief total number of frames that have passed since start
	    * @memberof Time
	    */
	    this.frameCount = 0;
	}
	
	
	Object.defineProperty( Time.prototype, "scale", {
	    get: function(){
		return this._scale;
	    },
	    set: function( value ){
		this._scale = value;
		this.fixedDelta = globalFixed * value
	    }
	});
	
	
	Object.defineProperty( Time.prototype, "fixedDelta", {
	    get: function(){
		return this._fixedDelta;
	    },
	    set: function( value ){
		globalFixed = value;
		this._fixedDelta = value;
	    }
	});
	
	/**
	* @property Number invDelta
	* @memberof Time
	*/
	Object.defineProperty( Time.prototype, "invDelta", {
	    get: function(){
		return 1 / this.delta;
	    }
	});
	
        /**
	 * @method now
	 * @memberof Time
	 * @brief returns time in seconds since start of game
	 * @return Number
	 */
	Time.prototype.now = function(){
	    var w = typeof window !== "undefined" ? window : {},
		performance = typeof w.performance !== "undefined" ? w.performance : {};
	    
	    performance.now = (
		performance.now ||
		performance.mozNow ||
		performance.msNow ||
		performance.oNow ||
		performance.webkitNow ||
		function(){
		    return Date.now() - start;
		}
	    );
	    
	    return function(){
		
		return performance.now() * 0.001;
	    }
	}();
	
        /**
	 * @method stamp
	 * @memberof Time
	 * @brief time stamp in seconds
	 * @return Number
	 */
	Time.prototype.stamp = function(){
	    
	    return Date.now() * 0.001;
	};
	
	
	return new Time;
    }
);