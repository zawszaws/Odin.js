if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
        "use strict";
	
	var LOW = 0.000001, HIGH = 0.1;
	    
	
        /**
	 * @class Time
	 * @brief Object to get time information
	 */
	function Time(){
	    
	    /**
	    * @property Number _startTime
	    * @brief start time stamp of game
	    * @memberof Time
	    */
	    this._startTime = Date.now() * 0.001;
	    
	    /**
	    * @property Number sinceStart
	    * @brief time since start of game
	    * @memberof Time
	    */
	    this.sinceStart = 0;
	    
	    /**
	    * @property Number time
	    * @brief time that this frame started
	    * @memberof Time
	    */
	    this.time = 0;
	    
	    /**
	    * @property Number scale
	    * @brief scale at which the time is passing
	    * @memberof Time
	    */
	    this.scale = 1;
	    
	    /**
	    * @property Number fps
	    * @brief number of frames/second
	    * @memberof Time
	    */
	    this.fps = 60;
	    
	    /**
	    * @property Number delta
	    * @brief the time in seconds it took to complete the last frame
	    * @memberof Time
	    */
	    this.delta = 1/60;
	}
	
        /**
	 * @method update
	 * @memberof Time
	 * @brief called in game.update, updates Time properties
	 */
	Time.prototype.update = function(){
	    var frames = 0, time = 0, last = 0, delta = 0, ms = 0, msLast = 0;
	    
	    return function(){
		this.time = time = this.now();
		
		delta = ( time - last ) * this.scale;
		this.delta = delta < LOW ? LOW : delta > HIGH ? HIGH : delta;
		
		last = time;
		
		frames++;
		ms = time * 1000;
		
		if( msLast + 1000 < ms ){
		    this.fps = ( frames * 1000 ) / ( ms - msLast );
		    msLast = ms;
		    frames = 0;
		}
	    };
	}();
	
        /**
	 * @method now
	 * @memberof Time
	 * @brief get time in seconds since start of game
	 */
	Time.prototype.now = function(){
	    var startTime = Date.now(),
		w = typeof window !== "undefined" ? window : {},
		performance = typeof w.performance !== "undefined" ? w.performance : {
		    now: function(){
			return Date.now() - startTime;
		    }
		}
	    
	    return function(){
		
		return performance.now() * 0.001;
	    }
	}();
	
        /**
	 * @method stamp
	 * @memberof Time
	 * @brief get time stamp in seconds
	 */
	Time.prototype.stamp = function(){
	    
	    return Date.now() * 0.001;
	}
	
	
	return new Time;
    }
);