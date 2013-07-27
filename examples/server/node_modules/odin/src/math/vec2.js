if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf"
    ],
    function( Mathf ){
	"use strict";
	
	
	var abs = Math.abs,
	    sqrt = Math.sqrt,
	    acos = Math.acos,
	    sin = Math.sin,
	    cos = Math.cos,
	    lerp = Mathf.lerp,
	    clamp = Mathf.clamp,
	    equals= Mathf.equals;
	
	/**
	 * @class Vec2
	 * @brief 2D vector
	 * @param Number x
	 * @param Number y
	 */
	function Vec2( x, y ){
	    
	    /**
	    * @property Number x
	    * @memberof Vec2
	    */
	    this.x = 0;
	    
	    /**
	    * @property Number y
	    * @memberof Vec2
	    */
	    this.y = 0;
	    
	    
	    if( x && x.x ){
		this.x = x.x || 0;
		this.y = x.y || 0;
	    }
	    else{
		this.x = x || 0;
		this.y = y || 0;
	    }
	}
        
        /**
	 * @method clone
	 * @memberof Vec2
	 * @brief returns new copy of this
	 * @return Vec2
	 */
        Vec2.prototype.clone = function(){
            
            return new Vec2( this.x, this.y );
        };
        
        /**
	 * @method copy
	 * @memberof Vec2
	 * @brief copies other vector
	 * @param Vec2 other vector to be copied
	 * @return Vec2
	 */
        Vec2.prototype.copy = function( other ){
            
            this.x = other.x;
            this.y = other.y;
            
            return this;
        };
        
        /**
	 * @method set
	 * @memberof Vec2
	 * @brief sets x and y of this vector
	 * @param Number x
	 * @param Number y
	 * @return Vec2
	 */
        Vec2.prototype.set = function( x, y ){
            
            this.x = x;
            this.y = y;
            
            return this;
        };
        
        /**
	 * @method vadd
	 * @memberof Vec2
	 * @brief adds a + b saves it in this
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Vec2
	 */
        Vec2.prototype.vadd = function( a, b ){
            
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            
            return this;
        };
        
        /**
	 * @method add
	 * @memberof Vec2
	 * @brief adds this + other
	 * @param Vec2 other
	 * @return Vec2
	 */
        Vec2.prototype.add = function( other ){
            
            this.x += other.x;
	    this.y += other.y;
            
            return this;
        };
        
        /**
	 * @method sadd
	 * @memberof Vec2
	 * @brief adds this + scalar
	 * @param Number s
	 * @return Vec2
	 */
        Vec2.prototype.sadd = function( s ){
            
            this.x += s;
            this.y += s;
            
            return this;
        };
        
        /**
	 * @method vsub
	 * @memberof Vec2
	 * @brief subtracts a - b saves it in this
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Vec2
	 */
        Vec2.prototype.vsub = function( a, b ){
            
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            
            return this;
        };
        
        /**
	 * @method sub
	 * @memberof Vec2
	 * @brief subtracts this - other
	 * @param Vec2 other
	 * @return Vec2
	 */
        Vec2.prototype.sub = function( other ){
            
            this.x -= other.x;
	    this.y -= other.y;
            
            return this;
        };
        
        /**
	 * @method ssub
	 * @memberof Vec2
	 * @brief subtracts this - scalar
	 * @param Number s
	 * @return Vec2
	 */
        Vec2.prototype.ssub = function( s ){
            
            this.x -= s;
            this.y -= s;
            
            return this;
        };
        
        /**
	 * @method vmul
	 * @memberof Vec2
	 * @brief multiples a * b saves it in this
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Vec2
	 */
        Vec2.prototype.vmul = function( a, b ){
            
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            
            return this;
        };
        
        /**
	 * @method mul
	 * @memberof Vec2
	 * @brief multiples this * other
	 * @param Vec2 other
	 * @return Vec2
	 */
        Vec2.prototype.mul = function( other ){
            
            this.x *= other.x;
	    this.y *= other.y;
            
            return this;
        };
        
        /**
	 * @method smul
	 * @memberof Vec2
	 * @brief multiples this * scalar
	 * @param Number s
	 * @return Vec2
	 */
        Vec2.prototype.smul = function( s ){
            
            this.x *= s;
            this.y *= s;
            
            return this;
        };
        
        /**
	 * @method vdiv
	 * @memberof Vec2
	 * @brief divides a / b saves it in this
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Vec2
	 */
        Vec2.prototype.vdiv = function( a, b ){
            var x = b.x, y = b.y;
            
	    this.x = x !== 0 ? a.x / x : 0;
	    this.y = y !== 0 ? a.y / y : 0;
            
            return this;
        };
        
        /**
	 * @method div
	 * @memberof Vec2
	 * @brief divides this / other
	 * @param Vec2 other
	 * @return Vec2
	 */
        Vec2.prototype.div = function( other ){
            var x = other.x, y = other.y;
            
	    this.x = x !== 0 ? this.x / x : 0;
	    this.y = y !== 0 ? this.y / y : 0;
            
            return this;
        };
        
        /**
	 * @method sdiv
	 * @memberof Vec2
	 * @brief divides this / scalar
	 * @param Number s
	 * @return Vec2
	 */
        Vec2.prototype.sdiv = function( s ){
	    s = s !== 0 ? 1 / s : 0;
	    
	    this.x *= s;
	    this.y *= s;
            
            return this;
        };
        
        /**
	 * @method vdot
	 * @memberof Vec2
	 * @brief gets dot product of a vector and b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Number
	 */
        Vec2.vdot = Vec2.prototype.vdot = function( a, b ){
            
            return a.x * b.x + a.y * b.y;
        };
        
        /**
	 * @method dot
	 * @memberof Vec2
	 * @brief gets dot product of this vector and other vector
	 * @param Vec2 other
	 * @return Number
	 */
        Vec2.prototype.dot = function( other ){
            
	    return this.x * other.x + this.y * other.y;
        };
        
        /**
	 * @method vlerp
	 * @memberof Vec2
	 * @brief linear interpolation between a vector and b vector by t
	 * @param Vec2 a
	 * @param Vec2 b
	 * @param Number t between 0 and 1
	 * @return Vec2
	 */
        Vec2.prototype.vlerp = function( a, b, t ){
            
            this.x = lerp( a.x, b.x, t );
            this.y = lerp( a.y, b.y, t );
            
            return this;
        };
        
        /**
	 * @method lerp
	 * @memberof Vec2
	 * @brief linear interpolation between this vector and other vector by t
	 * @param Vec2 other
	 * @param Number t between 0 and 1
	 * @return Vec2
	 */
        Vec2.prototype.lerp = function( other, t ){
            
            this.x = lerp( this.x, other.x, t );
            this.y = lerp( this.y, other.y, t );
            
            return this;
        };
        
        /**
	 * @method vslerp
	 * @memberof Vec2
	 * @brief angular interpolation between a vector and b vector by t
	 * @param Vec2 a
	 * @param Vec2 b
	 * @param Number t between 0 and 1
	 * @return Vec2
	 */
        Vec2.prototype.vslerp = function(){
	    var start = new Vec2(),
		end = new Vec2(),
		vec = new Vec2(),
		relative = new Vec2();
	    
	    return function( a, b, t ){
		var dot = clamp( a.dot( b ), -1, 1 ),
		    theta = acos( dot ) * t;
		
		start.copy( a );
		end.copy( b );
		
		vec.copy( start );
		relative.vsub( end, vec.smul( dot ) );
		
		relative.norm();
		
		return this.vadd(
		    start.smul( cos( theta ) ),
		    relative.smul( sin( theta ) )
		);
	    };
	}();
        
        /**
	 * @method slerp
	 * @memberof Vec2
	 * @brief angular interpolation between this vector and other vector by t
	 * @param Vec2 other
	 * @param Number t between 0 and 1
	 * @return Vec2
	 */
        Vec2.prototype.slerp = function(){
	    var start = new Vec2(),
		end = new Vec2(),
		vec = new Vec2(),
		relative = new Vec2();
	    
	    return function( other, t ){
		var dot = clamp( this.dot( other ), -1, 1 ),
		    theta = acos( dot ) * t;
		
		start.copy( this );
		end.copy( other );
		
		vec.copy( start );
		relative.vsub( end, vec.smul( dot ) );
		
		relative.norm();
		
		return this.vadd(
		    start.smul( cos( theta ) ),
		    relative.smul( sin( theta ) )
		);
	    };
	}();
        
        /**
	 * @method vcross
	 * @memberof Vec2
	 * @brief cross product between a vector and b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Number
	 */
        Vec2.vcross = Vec2.prototype.vcross = function( a, b ){
	    
            return a.x * b.y - a.y * b.x;
        };
        
        /**
	 * @method cross
	 * @memberof Vec2
	 * @brief cross product between this vector and other vector
	 * @param Vec2 other
	 * @return Number
	 */
        Vec2.prototype.cross = function( other ){
	    
	    return this.x * other.y - this.y * other.x;
        };
        
        /**
	 * @method applyMat2
	 * @memberof Vec2
	 * @brief multiply this vector by Mat2
	 * @param Mat2 m
	 * @return Vec2
	 */
        Vec2.prototype.applyMat2 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y;
            
            this.x = x * me[0] + y * me[2];
            this.y = x * me[1] + y * me[3];
            
            return this;
        };
        
        /**
	 * @method applyMat32
	 * @memberof Vec2
	 * @brief multiply this vector by Mat32
	 * @param Mat32 m
	 * @return Vec2
	 */
        Vec2.prototype.applyMat32 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y;
            
            this.x = x * me[0] + y * me[2] + me[4];
            this.y = x * me[1] + y * me[3] + me[5];
            
            return this;
        };
        
        /**
	 * @method applyMat3
	 * @memberof Vec2
	 * @brief multiply this vector by Mat3
	 * @param Mat3 m
	 * @return Vec2
	 */
        Vec2.prototype.applyMat3 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y;
            
            this.x = x * me[0] + y * me[3] + me[6];
            this.y = x * me[1] + y * me[4] + me[7];
            
            return this;
        };
        
        /**
	 * @method applyMat4
	 * @memberof Vec2
	 * @brief multiply this vector by Mat4
	 * @param Mat4 m
	 * @return Vec2
	 */
        Vec2.prototype.applyMat4 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y;
            
            this.x = x * me[0] + y * me[4] + me[8] + me[12];
            this.y = x * me[1] + y * me[5] + me[9] + me[13];
            
            return this;
        };
        
        /**
	 * @method applyProj
	 * @memberof Vec2
	 * @brief multiply this vector by projection matrix
	 * @param Mat4 m
	 * @return Vec2
	 */
        Vec2.prototype.applyProj = function( m ){
            var me = m.elements,
		x = this.x, y = this.y,
                d = 1 / ( x * me[3] + y * me[7] + me[11] + me[15] );
	    
            this.x = ( me[0] * x + me[4] * y + me[8] + me[12] ) * d;
            this.y = ( me[1] * x + me[5] * y + me[9] + me[13] ) * d;
            
            return this;
        };
        
        /**
	 * @method applyQuat
	 * @memberof Vec2
	 * @brief multiply this vector by quaternion
	 * @param Quat q
	 * @return Vec2
	 */
        Vec2.prototype.applyQuat = function( q ){
            var x = this.x, y = this.y,
		
		qx = q.x, qy = q.y, qz = q.z, qw = q.w,
		
		ix =  qw * x + qy - qz * y,
		iy =  qw * y + qz * x - qx,
		iz =  qw + qx * y - qy * x,
		iw = -qx * x - qy * y - qz;
	    
	    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    
	    return this;
        };
        
        /**
	 * @method getPositionMat32
	 * @memberof Vec2
	 * @brief gets position from Mat32
	 * @param Mat32 m
	 * @return Vec2
	 */
        Vec2.prototype.getPositionMat32 = function( m ){
            var me = m.elements
	    
            this.x = me[4];
            this.y = me[5];
            
            return this;
        };
        
        /**
	 * @method getPositionMat4
	 * @memberof Vec2
	 * @brief gets position from Mat4
	 * @param Mat4 m
	 * @return Vec2
	 */
        Vec2.prototype.getPositionMat4 = function( m ){
            var me = m.elements;
	    
            this.x = me[12];
            this.y = me[13];
            
            return this;
        };
        
        /**
	 * @method getScaleMat32
	 * @memberof Vec2
	 * @brief gets scale from Mat32
	 * @param Mat32 m
	 * @return Vec2
	 */
        Vec2.prototype.getScaleMat32 = function( m ){
            var me = m.elements,
		sx = this.set( m[0], m[1] ).len(),
                sy = this.set( m[2], m[3] ).len();
            
            this.x = sx;
            this.y = sy;
            
            return this;
        };
        
        /**
	 * @method getScaleMat3
	 * @memberof Vec2
	 * @brief gets scale from Mat3
	 * @param Mat3 m
	 * @return Vec2
	 */
        Vec2.prototype.getScaleMat3 = function( m ){
            var me = m.elements,
                sx = this.set( me[0], me[1], me[2] ).len(),
                sy = this.set( me[3], me[4], me[5] ).len();
            
            this.x = sx;
            this.y = sy;
            
            return this;
        };
        
        /**
	 * @method getScaleMat4
	 * @memberof Vec2
	 * @brief gets scale from Mat4
	 * @param Mat4 m
	 * @return Vec2
	 */
        Vec2.prototype.getScaleMat4 = function( m ){
            var me = m.elements,
                sx = this.set( me[0], me[1], me[2] ).len(),
                sy = this.set( me[4], me[5], me[6] ).len();
            
            this.x = sx;
            this.y = sy;
            
            return this;
        };
        
        /**
	 * @method lenSq
	 * @memberof Vec2
	 * @brief gets squared length of this
	 * @return Number
	 */
        Vec2.prototype.lenSq = function(){
            var x = this.x, y = this.y;
	    
            return x * x + y * y;
        };
        
        /**
	 * @method len
	 * @memberof Vec2
	 * @brief gets length of this
	 * @return Number
	 */
        Vec2.prototype.len = function(){
	    var x = this.x, y = this.y;
	    
            return sqrt( x * x + y * y );
        };
        
        /**
	 * @method norm
	 * @memberof Vec2
	 * @brief normalizes this vector so length is equal to 1
	 * @return Vec2
	 */
        Vec2.prototype.norm = function(){
            var x = this.x, y = this.y,
		l = x * x + y * y;
	    
	    l = l !== 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x *= l;
	    this.y *= l;
	    
            return this;
        };
        
        /**
	 * @method negate
	 * @memberof Vec2
	 * @brief negates x and y values
	 * @return Vec2
	 */
        Vec2.prototype.negate = function(){
            
	    this.x = -this.x;
	    this.y = -this.y;
	    
            return this;
        };
        
        /**
	 * @method perpL
	 * @memberof Vec2
	 * @brief gets perpendicular vector on the left side
	 * @return Vec2
	 */
        Vec2.prototype.perpL = function(){
            var x = this.x, y = this.y;
	    
	    this.x = -y;
	    this.y = x;
	    
            return this;
        };
        
        /**
	 * @method perpR
	 * @memberof Vec2
	 * @brief gets perpendicular vector on the right side
	 * @return Vec2
	 */
        Vec2.prototype.perpR = function(){
            var x = this.x, y = this.y;
	    
	    this.x = y;
	    this.y = -x;
	    
            return this;
        };
        
        /**
	 * @method abs
	 * @memberof Vec2
	 * @brief gets absolute values of vector
	 * @return Vec2
	 */
        Vec2.prototype.abs = function(){
	    
	    this.x = abs( this.x );
	    this.y = abs( this.y );
            
            return this;
        };
        
        /**
	 * @method rotate
	 * @memberof Vec2
	 * @brief rotates vector by angle
	 * @param Number a angle to rotate by
	 * @return Vec2
	 */
        Vec2.prototype.rotate = function( a ){
            var x = this.x, y = this.y,
		c = cos( a ), s = sin( a );
	    
	    this.x = x * c - y * s;
	    this.y = x * s + y * c;
	    
            return this;
        };
        
        /**
	 * @method rotateAround
	 * @memberof Vec2
	 * @brief rotates vector around vector by angle
	 * @param Number a angle to rotate by
	 * @param Vec2 v vector to rotate around
	 * @return Vec2
	 */
        Vec2.prototype.rotateAround = function( a, v ){
	    
	    return this.sub( v ).rotate( a ).add( v );
	};
        
        /**
	 * @method min
	 * @memberof Vec2
	 * @brief returns min values from this and other vector
	 * @param Vec2 other
	 * @return Vec2
	 */
        Vec2.prototype.min = function( other ){
            var x = other.x, y = other.y;
            
	    this.x = x < this.x ? x : this.x;
	    this.y = y < this.y ? y : this.y;
            
            return this;
        };
        
        /**
	 * @method max
	 * @memberof Vec2
	 * @brief returns max values from this and other vector
	 * @param Vec2 other
	 * @return Vec2
	 */
        Vec2.prototype.max = function( other ){
            var x = other.x, y = other.y;
            
	    this.x = x > this.x ? x : this.x;
	    this.y = y > this.y ? y : this.y;
            
            return this;
        };
	
        /**
	 * @method clamp
	 * @memberof Vec2
	 * @brief clamps this vector between min and max vector's values
	 * @param Vec2 min
	 * @param Vec2 max
	 * @return Vec2
	 */
        Vec2.prototype.clamp = function( min, max ){
            
            this.x = clamp( this.x, min.x, max.x );
            this.y = clamp( this.y, min.y, max.y );
            
            return this;
        };
        
        /**
	 * @method distSq
	 * @memberof Vec2
	 * @brief gets squared distance between a vector and b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Number
	 */
        Vec2.distSq = Vec2.prototype.distSq = function( a, b ){
	    var x = b.x - a.x,
		y = b.y - a.y;
	    
	    return x * x + y * y;
	};
        
        /**
	 * @method dist
	 * @memberof Vec2
	 * @brief gets distance between a vector and b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Number
	 */
        Vec2.dist = Vec2.prototype.dist = function( a, b ){
            var x = b.x - a.x,
		y = b.y - a.y,
		d = x * x + y * y;
	    
	    return d !== 0 ? sqrt( d ) : 0;
        };
        
        /**
	 * @method toString
	 * @memberof Vec2
	 * @brief returns string of this vector - "Vec2( 0, 0 )"
	 * @return String
	 */
        Vec2.prototype.toString = function(){
            
            return "Vec2( "+ this.x +", "+ this.y +" )";
        };
	
        /**
	 * @method equals
	 * @memberof Vec2
	 * @brief checks if this vector equals other vector
	 * @param Vec2 other
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
        Vec2.prototype.equals = function( other, e ){
            
            return !(
                !equals( this.x, other.x, e ) ||
                !equals( this.y, other.y, e )
            );
        };
        
        /**
	 * @method Vec2.equals
	 * @memberof Vec2
	 * @brief checks if a vector equals b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
        Vec2.equals = function( a, b, e ){
	    
            return !(
                !equals( a.x, b.x, e ) ||
                !equals( a.y, b.y, e )
            );
        };
	
	
	return Vec2;
    }
);