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
	 * @class SpriteSheetAsset
	 * @extends Asset
	 * @brief image asset
	 * @param Object opts sets Class properties from passed Object
	 */
        function SpriteSheetAsset( opts ){
	    opts || ( opts = {} );
	    
            Asset.call( this, opts );
	}
        
	Class.extend( SpriteSheetAsset, Asset );
	
	/**
	 * @method load
	 * @memberof SpriteSheetAsset
	 * @brief loads this asset's data
	 * @param Function callback
	 */
	SpriteSheetAsset.prototype.load = function( callback ){
	    var self = this,
		request = new XMLHttpRequest;
	    
	    request.onreadystatechange = function(){
                
                if( request.readyState === 1 ){
                    request.send();
                }
                
                if( request.readyState === 4 ){
                    if( request.status === 404 ){
                        console.warn("Dom.ajax: 404 - file not found");
                    }
                    else{
                        var res = JSON.parse( request.responseText );
			
			self.data = res;
			if( callback ) callback( self );
                    }
                }
            }
            
            request.open("GET", this.src, true );
	};
	
	
	SpriteSheetAsset.prototype.toJSON = function(){
	    var json = this._JSON,
		name;
	    
	    json._SERVER_ID = this._id;
	    json._class = "SpriteSheetAsset";
	    json.name = this.name;
	    json.src = this.src;
	    
	    return json;
	};
	
	
	SpriteSheetAsset.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    this.name = json.name;
	    this.src = json.src;
	    
	    return this;
	};
	
        
        return SpriteSheetAsset;
    }
);