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
	 * @class Asset
	 * @extends SharedObject
	 * @brief Base class for all assets in game
	 * @param Object opts sets Class properties from passed Object
	 */
        function Asset( opts ){
	    opts || ( opts = {} );
	    
            SharedObject.call( this );
	    
	    /**
	    * @property String name
	    * @brief name of asset
	    * @memberof Asset
	    */
	    this.name = opts.name !== undefined ? opts.name : this._class + this._id;
	    
	    /**
	    * @property String src
	    * @brief url of the asset
	    * @memberof Asset
	    */
	    this.src = opts.src !== undefined ? opts.src : "";
	    
	    /**
	    * @property Object data
	    * @brief the data this asset recieved when loaded from src
	    * @memberof Asset
	    */
	    this.data = undefined;
	    
	    /**
	    * @property Object glData
	    * @brief webgl data created by renderers, stored here for speed
	    * @memberof Asset
	    */
	    this.glData = undefined;
	}
        
	Class.extend( Asset, SharedObject );
	
	/**
	 * @method load
	 * @memberof Asset
	 * @brief loads this asset
	 * @param Function callback
	 */
	Asset.prototype.load = function( callback ){
	    
	};
	
        
        return Asset;
    }
);