if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/sharedobject"
    ],
    function( Class, SharedObject ){
        "use strict";
	
        /**
	 * @class SharedComponent
	 * @extends SharedObject
	 * @brief Base class for all shared components
	 */
        function SharedComponent(){
	    
            SharedObject.call( this );
	    
	    this.gameObject = undefined;
	}
        
	Class.extend( SharedComponent, SharedObject );
	
	/**
	 * @method init
	 * @memberof SharedComponent
	 * @brief called when added to GameObject
	 */
	SharedComponent.prototype.init = function(){
	    
	};
	
	/**
	 * @method update
	 * @memberof SharedComponent
	 * @brief called every frame
	 */
	SharedComponent.prototype.update = function(){
	    
	};
	
	/**
	 * @method destroy
	 * @memberof SharedComponent
	 * @brief removes this from GameObject
	 */
	SharedComponent.prototype.destroy = function(){
	    var gameObject = this.gameObject;
	    
	    if( gameObject ){
		gameObject.removeSharedComponent( this );
	    }
	    else{
		console.warn( this +".destroy: SharedComponent is not added to a GameObject");
	    }
	    
	    this.trigger("destroy");
	};
	
        
        return SharedComponent;
    }
);