if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/assets/asset"
    ],
    function( Class, Asset ){
        "use strict";
	
        /**
	 * @class ImageAsset
	 * @extends Asset
	 * @brief image asset
	 * @param Object opts sets Class properties from passed Object
	 */
        function ImageAsset( opts ){
	    opts || ( opts = {} );
	    
            Asset.call( this, opts );
	    
	    this.glData = {
		needsUpdate: true,
		texture: undefined
	    };
	}
        
	Class.extend( ImageAsset, Asset );
	
	/**
	 * @method load
	 * @memberof ImageAsset
	 * @brief loads this asset's data
	 * @param Function callback
	 */
	ImageAsset.prototype.load = function( callback ){
	    var self = this, image = new Image;
	    
	    this.data = undefined;
	    
	    image.onload = function(){
		self.data = image;
		self.trigger("loaded");
		
		if( callback ) callback( self );
	    }
	    
	    image.src = this.src;
	};
	
	
	ImageAsset.prototype.toJSON = function(){
	    var json = this._JSON,
		name;
	    
	    json._SERVER_ID = this._id;
	    json._class = "ImageAsset";
	    json.name = this.name;
	    json.src = this.src;
	    
	    return json;
	};
	
	
	ImageAsset.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    this.name = json.name;
	    this.src = json.src;
	    
	    return this;
	};
	
        
        return ImageAsset;
    }
);