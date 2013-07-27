if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
        "use strict";
	
        /**
	 * @class Config
	 * @brief configuration for Game
	 */
	function Config(){
	    
	    /**
	    * @property Boolean debug
	    * @brief is debug on
	    * @memberof Config
	    */
	    this.debug = false;
	    
	    /**
	    * @property Boolean forceCanvas
	    * @brief force Canvas renderering, affects clients only
	    * @memberof Config
	    */
	    this.forceCanvas = false;
	    
	    /**
	    * @property String host
	    * @brief server's host url, defaults to machines localhost
	    * @memberof Config
	    */
	    this.host = "127.0.0.1";
	    
	    /**
	    * @property Number port
	    * @brief server's port, defaults to 3000
	    * @memberof Config
	    */
	    this.port = 3000;
	}
	
	
	return new Config;
    }
);