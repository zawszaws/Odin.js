if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf",
	"math/vec3"
    ],
    function( Mathf, Vec3 ){
        "use strict";
        
	var equals = Mathf.equals,
	    abs = Math.abs,
	    cos = Math.cos,
	    sin = Math.sin;
	
        /**
	 * @class AABB3
	 * @brief 3D axis aligned bounding box
	 * @param Vec3 min
	 * @param Vec3 max
	 */
        function AABB3( min, max ){
	    
	    /**
	    * @property Vec3 min
	    * @memberof AABB3
	    */
            this.min = new Vec3;
	    
	    /**
	    * @property Vec3 max
	    * @memberof AABB3
	    */
            this.max = new Vec3;
	    
	    if( min instanceof AABB3 ){
		this.copy( min );
	    }
	    else{
		if( min ) this.min.copy( min );
		if( max ) this.max.copy( max );
	    }
	}
        
        
        /**
	 * @method clone
	 * @memberof AABB3
	 * @brief returns new copy of this
	 * @return AABB3
	 */
        AABB3.prototype.clone = function(){
            
            return new AABB3(
		this.min.clone(),
		this.max.clone()
	    );
	};
        
        /**
	 * @method copy
	 * @memberof AABB3
	 * @brief copies other AABB
	 * @param AABB3 other
	 * @return AABB3
	 */
        AABB3.prototype.copy = function( other ){
            var amin = this.min, bmin = other.min,
		amax = this.max, bmax = other.max;
	    
	    amin.x = bmin.x;
	    amin.y = bmin.y;
	    amin.z = bmin.z;
	    
	    amax.x = bmax.x;
	    amax.y = bmax.y;
	    amax.z = bmax.z;
            
            return this;
	};
        
        /**
	 * @method set
	 * @memberof AABB3
	 * @brief set min and max vectors
	 * @param Vec3 min
	 * @param Vec3 max
	 * @return AABB3
	 */
        AABB3.prototype.set = function( min, max ){
            
            this.min.copy( min );
            this.max.copy( max );
            
            return this;
	};
        
        /**
	 * @method setFromPoints
	 * @memberof AABB3
	 * @brief set min and max from array of vectors
	 * @param Array points
	 * @return AABB3
	 */
        AABB3.prototype.setFromPoints = function( points ){
            var v, i = points.length,
		minx, miny, minz, maxx, maxy, maxz,
		min = this.min, max = this.max,
		x, y, z;
            
            if( il > 0 ){
                
		minx = miny = minz = Infinity;
		maxx = maxy = maxz = -Infinity;
                
                for( ; i--; ){
                    v = points[i];
		    x = v.x; y = v.y; z = v.z;
		    
		    minx = minx > x ? x : minx;
		    miny = miny > y ? y : miny;
		    minz = minz > z ? z : minz;
		    
		    maxx = maxx < x ? x : maxx;
		    maxy = maxy < y ? y : maxy;
		    maxz = maxz < z ? z : maxz;
                }
		
		min.x = minx; min.y = miny; min.x = minz;
		max.x = maxx; max.y = maxy; max.x = maxz;
            }
            else{
                min.x = min.y = min.z = max.x = max.y = max.z = 0;
            }
            
            return this;
        };
        
        /**
	 * @method union
	 * @memberof AABB3
	 * @brief joins this and another aabb
	 * @param AABB3 aabb
	 * @return AABB3
	 */
        AABB3.prototype.union = function( other ){
            
	    this.min.min( other.min );
	    this.max.max( other.max );
            
            return this;
        };
        
        /**
	 * @method contains
	 * @memberof AABB3
	 * @brief checks if AABB contains point
	 * @param Vec3 point
	 * @return Boolean
	 */
        AABB3.prototype.contains = function( point ){
            var min = this.min, max = this.max,
		px = point.x, py = point.y, pz = point.z;
	    
	    return !(
		px < this.min.x || px > this.max.x ||
                py < this.min.y || py > this.max.y ||
                pz < this.min.z || pz > this.max.z
	    );
	};
        
        /**
	 * @method intersects
	 * @memberof AABB3
	 * @brief checks if AABB intersects AABB
	 * @param AABB3 other
	 * @return Boolean
	 */
        AABB3.prototype.intersects = function( other ){
            var aMin = this.min, aMax = this.max,
		bMin = other.min, bMax = other.max;
	    
	    return !(
		aMax.x < bMin.x || aMax.y < bMin.y || 
                aMin.x > bMax.x || aMin.y > bMax.y || 
                aMin.z > bMax.z || aMin.z > bMax.z
	    );
	};
        
        /**
	 * @method toString
	 * @memberof AABB3
	 * @brief converts AABB to string "AABB3( min: Vec2( -1, -1, -1 ), max: Vec2( 1, 1, 1 ) )"
	 * @return String
	 */
        AABB3.prototype.toString = function(){
            var min = this.min, max = this.max;
	    
            return "AABB3( min: "+ min.x +", "+ min.y +", "+ min.z +", max: "+ max.x +", "+ max.y +", "+ max.z +" )";
	};
        
        /**
	 * @method equals
	 * @memberof AABB3
	 * @brief checks if AABB equals AABB
	 * @param AABB3 other
	 * @return Boolean
	 */
        AABB3.prototype.equals = function( other ){
            var amin = this.min, amax = this.max,
		bmin = other.min, bmax = other.max;
	    
            return !(
                !equals( amin.x, bmin.x ) ||
                !equals( amin.y, bmin.y ) ||
                !equals( amin.z, bmin.z ) ||
                !equals( amax.x, bmax.x ) ||
                !equals( amax.y, bmax.y ) ||
                !equals( amax.z, bmax.z )
            );
	};
        
        /**
	 * @method AABB3.intersects
	 * @memberof AABB3
	 * @brief checks if AABB intersects AABB
	 * @param AABB3 a
	 * @param AABB3 b
	 * @return Boolean
	 */
        AABB3.intersects = function( a, b ){
            var aMin = a.min, aMax = a.max,
		bMin = b.min, bMax = b.max;
	    
	    return !(
		aMax.x < bMin.x || aMax.y < bMin.y || aMax.z < bMin.z ||
                aMin.x > bMax.x || aMin.y > bMax.y || aMin.z > bMax.z
	    );
	};
        
        /**
	 * @method AABB3.equals
	 * @memberof AABB3
	 * @brief checks if AABB equals AABB
	 * @return Boolean
	 */
        AABB3.equals = function( a, b ){
            var amin = a.min, amax = a.max,
		bmin = b.min, bmax = b.max;
	    
            return !(
                !equals( amin.x, bmin.x ) ||
                !equals( amin.y, bmin.y ) ||
                !equals( amin.z, bmin.z ) ||
                !equals( amax.x, bmax.x ) ||
                !equals( amax.y, bmax.y ) ||
                !equals( amax.z, bmax.z )
            );
	};
        
        return AABB3;
    }
);