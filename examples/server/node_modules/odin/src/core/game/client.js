if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	var slice = Array.prototype.slice;
	
	/**
	 * @class Client
	 * @extends Class
	 * @brief client information used by ServerGame
	 * @param Object opts sets Class properties from passed Object
	 */
	function Client( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    /**
	    * @property Number id
	    * @brief unique id of this client
	    * @memberof Client
	    */
	    this.id = opts.id !== undefined ? opts.id : "";
	    
	    /**
	    * @property Object socket
	    * @brief reference to this client's socket
	    * @memberof Client
	    */
	    this.socket = opts.socket !== undefined ? opts.socket : undefined;
	    
	    /**
	    * @property Number connectTime
	    * @brief the time stamp this client connected
	    * @memberof Client
	    */
	    this.connectTime = opts.connectTime !== undefined ? opts.connectTime : 0;
	    
	    /**
	    * @property Scene scene
	    * @brief clients active scene 
	    * @memberof Client
	    */
	    this.scene = opts.scene !== undefined ? opts.scene : undefined;
	    
	    /**
	    * @property Camera camera
	    * @brief clients active camera 
	    * @memberof Client
	    */
	    this.camera = opts.camera !== undefined ? opts.camera : undefined;
	    
	    /**
	    * @property Object userData
	    * @brief clients custom data 
	    * @memberof Client
	    */
	    this.userData = opts.userData !== undefined ? opts.userData : {};
	    
	    /**
	    * @property Object device
	    * @brief clients device information
	    * @memberof Client
	    */
	    this.device = undefined;
	}
        
	Class.extend( Client, Class );
	
	/**
	 * @method log
	 * @memberof Client
	 * @brief sends console.log message to client, all arguments will be sent
	 */
	Client.prototype.log = function(){
	    if( !this.socket ) return;
	    
	    var args = Array.apply( null, arguments );
	    args.unshift("log");
	    
	    this.socket.emit.apply( this.socket, args );
	};
    
	
	return Client;
    }
);