if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/sharedobject",
	"core/game/config"
    ],
    function( Class, Time, SharedObject, Config ){
        "use strict";
	
	
	var now = Time.now;
	
        /**
	 * @class Assets
	 * @extends SharedObject
	 * @brief class for handling assets
	 * @param Object opts sets Class properties from passed Object
	 */
        function Assets( opts ){
	    opts || ( opts = {} );
	    
            SharedObject.call( this );
	    
	    this._JSON = {};
	    
	    this.total = 0;
	    this.loadTime = 0;
	    this.loaded = 0;
	    this.loading = false;
	    
	    this.assets = {};
	}
        
	Class.extend( Assets, SharedObject );
	
	/**
	 * @method addAssets
	 * @memberof Assets
	 * @brief adds all Assets in arguments to Assets
	 */
	Assets.prototype.addAssets = function(){
	    
	    for( var i = arguments.length; i--; ) this.addAsset( arguments[i] );
	};
	
	/**
	 * @method addAsset
	 * @memberof Assets
	 * @brief adds Asset to Assets
	 * @param Asset asset
	 */
	Assets.prototype.addAsset = function( asset ){
	    if( !asset ){
		console.warn( this +".addAsset: Asset is not defined");
		return;
	    }
	    
	    var name = asset.name,
		assets = this.assets,
		index = assets[ name ];
	    
	    if( !index ){
		this.total++;
		assets[ name ] = asset;
	    }
	    else{
		console.warn( this +".addAsset: already has an asset with name "+ asset.name );
	    }
	};
	
	/**
	 * @method add
	 * @memberof Assets
	 * @brief same as addAssets
	 */
	Assets.prototype.add = Assets.prototype.addAssets;
	
	/**
	 * @method removeAssets
	 * @memberof Assets
	 * @brief removes all Assets in arguments from Assets
	 */
	Assets.prototype.removeAssets = function(){
	    
	    for( var i = arguments.length; i--; ) this.removeAsset( arguments[i] );
	};
	
	/**
	 * @method removeAsset
	 * @memberof Assets
	 * @brief removes Asset from Assets
	 * @param Asset asset
	 */
	Assets.prototype.removeAsset = function( asset ){
	    if( !asset ){
		console.warn( this +".removeAsset: Asset is not defined");
		return;
	    }
	    
	    var name = asset.name,
		assets = this.assets,
		index = assets[ name ];
	    
	    if( index ){
		this.total--;
		assets[ name ] = undefined;
	    }
	    else{
		console.warn( this +".removeAsset: Assets does not have asset "+ asset );
	    }
	};
	
	/**
	 * @method remove
	 * @memberof Assets
	 * @brief same as removeAssets
	 */
	Assets.prototype.remove = Assets.prototype.removeAssets;
	
	/**
	 * @method load
	 * @memberof Assets
	 * @brief loads all assets
	 * @param Function callback
	 */
	Assets.prototype.load = function( callback ){
	    if( this.total <= 0 ){
		if( callback ) callback();
		return;
	    }
	    
	    var self = this, assets = this.assets,
		asset, key, startTime = now();
	    
	    
	    self.trigger("load");
	    this.loading = true;
	    
	    for( key in assets ){
		asset = assets[ key ];
		
		if( asset && asset.src ){
		    asset.load(function( that ){
			if( Config.debug ) console.log("Assets.load: loading "+ that.name +" from "+ that.src );
			self.loaded++;
			
			if( self.loaded >= self.total ){
			    self.loadTime = now() - startTime;
			    if( Config.debug ) console.log("Assets.load: "+ self.loaded +" in "+ self.loadTime +"s");
			    
			    self.loading = false;
			    if( callback ) callback();
			    self.trigger("loaded");
			}
		    });
		}
		else{
		    self.loaded++;
		    
		    if( self.loaded >= self.total ){
			self.loadTime = now() - startTime;
			if( Config.debug ) console.log("Assets.load: "+ self.loaded +" in "+ self.loadTime +"s");
			
			self.loading = false;
			if( callback ) callback();
			self.trigger("loaded");
		    }
		}
	    }
	};
	
	/**
	 * @method get
	 * @memberof Assets
	 * @brief returns asset with given name
	 * @param String name
	 */
	Assets.prototype.get = function( name ){
	    var asset = this.assets[ name ];
	    
	    if( !asset ){
		console.warn( this +".get: Assets does not have an Asset named "+ name );
	    }
	    
	    return asset;
	};
	
	
	Assets.prototype.toJSON = function(){
	    var json = this._JSON,
		assets = this.assets,
		jsonAssets,
		name;
	    
	    json._SERVER_ID = this._id;
	    
	    json.assets || ( json.assets = {} );
	    jsonAssets = json.assets;
	    
	    for( name in assets ) jsonAssets[ name ] = assets[ name ].toJSON();
	    
	    return json;
	};
	
	
	Assets.prototype.fromJSON = function( json ){
	    var jsonAssets = json.assets,
		asset, name;
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
	    for( name in jsonAssets ){
		asset = jsonAssets[ name ];
		this.addAsset( new Class.types[ asset._class ]().fromJSON( asset ) );
	    }
	    
	    return this;
	};
	
        
        return new Assets;
    }
);