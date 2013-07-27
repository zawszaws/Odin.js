if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"phys2d/phys2d",
	"math/vec2",
	"core/components/component"
    ],
    function( Class, Phys2D, Vec2, Component ){
        "use strict";
	
        /**
	 * @class Rigidbody2D
	 * @extends Component
	 * @brief 2D Rigid Body Component
	 * @param Object opts sets Class properties from passed Object
	 */
        function Rigidbody2D( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    /**
	    * @property PRigidbody2D body
	    * @brief reference to physics body
	    * @memberof Rigidbody2D
	    */
	    this.body = new Phys2D.PRigidbody2D( opts );
        }
        
	Class.extend( Rigidbody2D, Component );
	
	/**
	 * @method init
	 * @memberof Rigidbody2D
	 * @brief called when added to GameObject
	 */
	Rigidbody2D.prototype.init = function(){
	    var body = this.body, shapes = body.shapes,
		gameObject = this.gameObject,
		transform = gameObject.transform2d || gameObject.transform3d,
		bpos = body.position, tpos = transform.position, trot = transform.rotation,
		i;
	    
	    bpos.x = tpos.x;
	    bpos.y = tpos.y;
	    
	    body.rotation = trot;
	};
	
	/**
	 * @method update
	 * @memberof Rigidbody2D
	 * @brief called every frame
	 */
	Rigidbody2D.prototype.update = function(){
	    var body = this.body,
		gameObject = this.gameObject,
		transform = gameObject.transform2d || gameObject.transform3d,
		bpos = body.position, brot = body.rotation, tpos = transform.position;
	    
	    tpos.x = bpos.x;
	    tpos.y = bpos.y;
	    
	    transform.rotation = brot;
	};
	
        
        return Rigidbody2D;
    }
);