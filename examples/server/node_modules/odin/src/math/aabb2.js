if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf",
	"math/vec2"
    ],
    function( Mathf, Vec2 ){
        "use strict";
        
	var equals = Mathf.equals,
	    abs = Math.abs,
	    cos = Math.cos,
	    sin = Math.sin;
	
        /**
	 * @class AABB2
	 * @brief 2D axis aligned bounding box
	 * @param Vec2 min
	 * @param Vec2 max
	 */
        function AABB2( min, max ){
	    
	    /**
	    * @property Vec2 min
	    * @memberof AABB2
	    */
            this.min = min instanceof Vec2 ? min : new Vec2;
	    
	    /**
	    * @property Vec2 max
	    * @memberof AABB2
	    */
            this.max = max instanceof Vec2 ? max : new Vec2;
	}
        
        
        AABB2.prototype.fromJSON = function( json ){
	    
	    this.copy( json );
	};
        
        /**
	 * @method clone
	 * @memberof AABB2
	 * @brief returns new copy of this
	 * @return AABB2
	 */
        AABB2.prototype.clone = function(){
            
            return new AABB2(
		this.min.clone(),
		this.max.clone()
	    );
	};
        
        /**
	 * @method copy
	 * @memberof AABB2
	 * @brief copies other AABB
	 * @param AABB2 other
	 * @return AABB2
	 */
        AABB2.prototype.copy = function( other ){
            var amin = this.min, bmin = other.min,
		amax = this.max, bmax = other.max;
	    
	    amin.x = bmin.x;
	    amin.y = bmin.y;
	    
	    amax.x = bmax.x;
	    amax.y = bmax.y;
            
            return this;
	};
        
        /**
	 * @method set
	 * @memberof AABB2
	 * @brief set min and max vectors
	 * @param Vec2 min
	 * @param Vec2 max
	 * @return AABB2
	 */
        AABB2.prototype.set = function( min, max ){
            
	    this.min.copy( min );
	    this.max.copy( max );
            
            return this;
        };
        
        /**
	 * @method setFromPoints
	 * @memberof AABB2
	 * @brief set min and max from array of vectors
	 * @param Array points
	 * @return AABB2
	 */
        AABB2.prototype.setFromPoints = function( points ){
            var v, i = points.length,
		minx, miny, maxx, maxy,
		min = this.min, max = this.max,
		x, y;
            
            if( i > 0 ){
                
		minx = miny = Infinity;
		maxx = maxy = -Infinity;
                
                for( ; i--; ){
                    v = points[i];
		    x = v.x; y = v.y;
		    
		    minx = minx > x ? x : minx;
		    miny = miny > y ? y : miny;
		    
		    maxx = maxx < x ? x : maxx;
		    maxy = maxy < y ? y : maxy;
                }
		
		min.x = minx; min.y = miny;
		max.x = maxx; max.y = maxy;
            }
            else{
                min.x = min.y = max.x = max.y = 0;
            }
            
            return this;
        };
        
        /**
	 * @method contains
	 * @memberof AABB2
	 * @brief checks if AABB contains point
	 * @param Vec2 point
	 * @return Boolean
	 */
        AABB2.prototype.contains = function( point ){
            var min = this.min, max = this.max,
		px = point.x, py = point.y;
	    
	    return !(
		px < min.x || px > max.x ||
                py < min.y || py > max.y
	    );
	};
        
        /**
	 * @method intersects
	 * @memberof AABB2
	 * @brief checks if AABB intersects AABB
	 * @param AABB2 other
	 * @return Boolean
	 */
        AABB2.prototype.intersects = function( other ){
            var aMin = this.min, aMax = this.max,
		bMin = other.min, bMax = other.max;
	    
	    return !(
		aMax.x < bMin.x || aMax.y < bMin.y || 
                aMin.x > bMax.x || aMin.y > bMax.y
	    );
	};
        
        /**
	 * @method toString
	 * @memberof AABB2
	 * @brief converts AABB to string "AABB2( min: Vec2( -1, -1 ), max: Vec2( 1, 1 ) )"
	 * @return String
	 */
        AABB2.prototype.toString = function(){
            var min = this.min, max = this.max;
	    
            return "AABB2( min: "+ min.x +", "+ min.y +", max: "+ max.x +", "+ max.y +" )";
	};
        
        /**
	 * @method equals
	 * @memberof AABB2
	 * @brief checks if AABB equals AABB
	 * @param AABB2 other
	 * @return Boolean
	 */
        AABB2.prototype.equals = function( other ){
            var amin = this.min, amax = this.max,
		bmin = other.min, bmax = other.max;
	    
            return !(
                !equals( amin.x, bmin.x ) ||
                !equals( amin.y, bmin.y ) ||
                !equals( amax.x, bmax.x ) ||
                !equals( amax.y, bmax.y )
            );
	};
        
        /**
	 * @method AABB2.intersects
	 * @memberof AABB2
	 * @brief checks if AABB intersects AABB
	 * @param AABB2 a
	 * @param AABB2 b
	 * @return Boolean
	 */
        AABB2.intersects = function( a, b ){
            var aMin = a.min, aMax = a.max,
		bMin = b.min, bMax = b.max;
	    
	    return !(
		aMax.x < bMin.x || aMax.y < bMin.y || 
                aMin.x > bMax.x || aMin.y > bMax.y
	    );
	};
        
        /**
	 * @method AABB2.equals
	 * @memberof AABB2
	 * @brief checks if AABB equals AABB
	 * @return Boolean
	 */
        AABB2.equals = function( a, b ){
            var amin = a.min, amax = a.max,
		bmin = b.min, bmax = b.max;
	    
            return !(
                !equals( amin.x, bmin.x ) ||
                !equals( amin.y, bmin.y ) ||
                !equals( amax.x, bmax.x ) ||
                !equals( amax.y, bmax.y )
            );
	};
	
        
        return AABB2;
    }
);