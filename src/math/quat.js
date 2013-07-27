if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf",
	"math/vec3"
    ],
    function( Mathf, Vec3 ){
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
	 * @class Quat
	 * @brief Quaterian for 3D rotations
	 * @param Number x
	 * @param Number y
	 * @param Number x
	 * @param Number w
	 */
	function Quat( x, y, z, w ){
	    
	    /**
	    * @property Number x
	    * @memberof Quat
	    */
	    this.x = x || 0;
	    
	    /**
	    * @property Number y
	    * @memberof Quat
	    */
	    this.y = y || 0;
	    
	    /**
	    * @property Number z
	    * @memberof Quat
	    */
	    this.z = z || 0;
	    
	    /**
	    * @property Number w
	    * @memberof Quat
	    */
	    this.w = w || 1;
	    
	    
	    if( x && x.x ){
		this.x = x.x || 0;
		this.y = x.y || 0;
		this.z = x.z || 0;
		this.w = x.w || 1;
	    }
	    else{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 1;
	    }
	}
        
        /**
	 * @method clone
	 * @memberof Quat
	 * @brief returns new copy of this
	 * @return Quat
	 */
        Quat.prototype.clone = function(){
            
            return new Quat( this.x, this.y, this.z, this.w );
        };
        
        /**
	 * @method copy
	 * @memberof Quat
	 * @brief copies other quaterian
	 * @return Quat
	 */
        Quat.prototype.copy = function( other ){
            
            this.x = other.x;
            this.y = other.y;
            this.z = other.z;
            this.w = other.w;
            
            return this;
        };
        
        /**
	 * @method set
	 * @memberof Quat
	 * @brief sets x y z w components, use is not recommended unless you really know what you doing
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 * @param Number w
	 * @return Quat
	 */
        Quat.prototype.set = function( x, y, z, w ){
            
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            
            return this;
        };
        
        /**
	 * @method qmul
	 * @memberof Quat
	 * @brief multiples a quat by b quat
	 * @param Quat a
	 * @param Quat b
	 * @return Quat
	 */
        Quat.prototype.qmul = function( a, b ){
            var ax = a.x, ay = a.y, az = a.z, aw = a.w,
                bx = b.x, by = b.y, bz = b.z, bw = b.w;
            
            this.x = ax * bw + aw * bx + ay * bz - az * by;
            this.y = ay * bw + aw * by + az * bx - ax * bz;
            this.z = az * bw + aw * bz + ax * by - ay * bx;
            this.w = aw * bw - ax * bx - ay * by - az * bz;
            
            return this;
        };
        
        /**
	 * @method mul
	 * @memberof Quat
	 * @brief multiples this quat by other quat
	 * @param Quat other
	 * @return Quat
	 */
        Quat.prototype.mul = function( other ){
            var ax = this.x, ay = this.y, az = this.z, aw = this.w,
                bx = other.x, by = other.y, bz = other.z, bw = other.w;
            
            this.x = ax * bw + aw * bx + ay * bz - az * by;
            this.y = ay * bw + aw * by + az * bx - ax * bz;
            this.z = az * bw + aw * bz + ax * by - ay * bx;
            this.w = aw * bw - ax * bx - ay * by - az * bz;
            
            return this;
        };
        
        /**
	 * @method smul
	 * @memberof Quat
	 * @brief multiples this quat by scalar
	 * @param Number s
	 * @return Quat
	 */
        Quat.prototype.smul = function( s ){
            
            this.x *= s;
            this.y *= s;
            this.z *= s;
            this.w *= s;
            
            return this;
        };
        
        /**
	 * @method sdiv
	 * @memberof Quat
	 * @brief divides this quat by scalar
	 * @param Number s
	 * @return Quat
	 */
        Quat.prototype.sdiv = function( s ){
	    s = s !== 0 ? 1 / s : 0;
	    
	    this.x *= s;
            this.y *= s;
            this.z *= s;
            this.w *= s;
            
            return this;
        };
        
        /**
	 * @method qdot
	 * @memberof Quat
	 * @brief returns dot product of a and b
	 * @param Quat a
	 * @param Quat b
	 * @return Quat
	 */
        Quat.qdot = Quat.prototype.qdot = function( a, b ){
            
            return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        };
        
        /**
	 * @method dot
	 * @memberof Quat
	 * @brief returns dot product of this and other
	 * @param Quat other
	 * @return Quat
	 */
        Quat.prototype.dot = function( other ){
            
	    return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
        };
        
        /**
	 * @method qlerp
	 * @memberof Quat
	 * @brief linear interpolation between a and b by t
	 * @param Quat a
	 * @param Quat b
	 * @param Number t
	 * @return Quat
	 */
        Quat.prototype.qlerp = function( a, b, t ){
            
            this.x = lerp( a.x, b.x, t );
            this.y = lerp( a.y, b.y, t );
            this.z = lerp( a.z, b.z, t );
            this.w = lerp( a.w, b.w, t );
            
            return this;
        };
        
        /**
	 * @method lerp
	 * @memberof Quat
	 * @brief linear interpolation between this and other by t
	 * @param Quat other
	 * @param Number t
	 * @return Quat
	 */
        Quat.prototype.lerp = function( other, t ){
            
            this.x = lerp( this.x, other.x, t );
            this.y = lerp( this.y, other.y, t );
            this.z = lerp( this.z, other.z, t );
            this.w = lerp( this.w, other.w, t );
            
            return this;
        };
        
        /**
	 * @method qslerp
	 * @memberof Quat
	 * @brief angular interpolation between a and b by t
	 * @param Quat a
	 * @param Quat b
	 * @param Number t
	 * @return Quat
	 */
        Quat.prototype.qslerp = function(){
	    var start = new Quat(),
		end = new Quat(),
		quat = new Quat(),
		relative = new Quat();
	    
	    return function( a, b, t ){
		var dot = clamp( a.dot( b ), -1, 1 ),
		    theta = acos( dot ) * t;
		
		start.copy( a );
		end.copy( b );
		
		quat.copy( start );
		relative.vsub( end, quat.smul( dot ) );
		
		relative.norm();
		
		return this.vadd(
		    start.smul( cos( theta ) ),
		    relative.smul( sin( theta ) )
		);
	    };
	}();
        
        /**
	 * @method slerp
	 * @memberof Quat
	 * @brief angular interpolation between this and other by t
	 * @param Quat other
	 * @param Number t
	 * @return Quat
	 */
        Quat.prototype.slerp = function(){
	    var start = new Quat(),
		end = new Quat(),
		quat = new Quat(),
		relative = new Quat();
	    
	    return function( other, t ){
		var dot = clamp( this.dot( other ), -1, 1 ),
		    theta = acos( dot ) * t;
		
		start.copy( this );
		end.copy( other );
		
		quat.copy( start );
		relative.vsub( end, quat.smul( dot ) );
		
		relative.norm();
		
		return this.vadd(
		    start.smul( cos( theta ) ),
		    relative.smul( sin( theta ) )
		);
	    };
	}();
        
        /**
	 * @method lenSq
	 * @memberof Quat
	 * @brief returns squared length
	 * @return Number
	 */
        Quat.prototype.lenSq = function(){
            var x = this.x, y = this.y, z = this.z, w = this.w;
	    
            return x * x + y * y + z * z + w * w;
        };
        
        /**
	 * @method len
	 * @memberof Quat
	 * @brief returns length
	 * @return Number
	 */
        Quat.prototype.len = function(){
            var x = this.x, y = this.y, z = this.z, w = this.w;
	    
            return sqrt( x * x + y * y + z * z + w * w );
        };
        
        /**
	 * @method norm
	 * @memberof Quat
	 * @brief normalizes quat
	 * @return Quat
	 */
        Quat.prototype.norm = function(){
            var x = this.x, y = this.y, z = this.z, w = this.w,
		l = x * x + y * y + z * z + w * w;
	    
	    l = l !== 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x *= l;
	    this.y *= l;
	    this.z *= l;
	    this.w *= l;
	    
            return this;
        };
        
        /**
	 * @method qinv
	 * @memberof Quat
	 * @brief gets inverse of other quat
	 * @param Quat other
	 * @return Quat
	 */
        Quat.prototype.qinv = function( other ){
            var x = other.x, y = other.y, z = other.z, w = other.w,
		l = x * x + y * y + z * z + w * w;
		
	    l = l !== 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x = -x * l;
	    this.y = -y * l;
	    this.z = -z * l;
	    this.w = w * l;
	    
            return this;
        };
        
        /**
	 * @method inv
	 * @memberof Quat
	 * @brief gets inverse of quat
	 * @return Quat
	 */
        Quat.prototype.inv = function(){
            var x = this.x, y = this.y, z = this.z, w = this.w,
		l = x * x + y * y + z * z + w * w;
		
	    l = l !== 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x = -x * l;
	    this.y = -y * l;
	    this.z = -z * l;
	    this.w = w * l;
	    
            return this;
        };
        
        /**
	 * @method conjugate
	 * @memberof Quat
	 * @brief gets conjugate of quat
	 * @return Quat
	 */
        Quat.prototype.conjugate = function(){
            
	    this.x = -this.x;
	    this.y = -this.y;
	    this.z = -this.z;
	    
            return this;
        };
        
        /**
	 * @method calculateW
	 * @memberof Quat
	 * @brief calculates w component of quat
	 * @return Quat
	 */
        Quat.prototype.calculateW = function(){
            var x = this.x, y = this.y, z = this.z;
            
            this.w = -sqrt( abs( 1.0 - x * x - y * y - z * z ) );
            
            return this;
        };
        
        /**
	 * @method axisAngle
	 * @memberof Quat
	 * @brief sets quat's axis angle
	 * @param Vec3 axis
	 * @param Number angle
	 * @return Quat
	 */
        Quat.prototype.axisAngle = function( axis, angle ){
            var halfAngle = angle * 0.5,
                s = sin( halfAngle );
                
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = cos( halfAngle );
	    
            return this;
        };
        
        /**
	 * @method setVec3s
	 * @memberof Quat
	 * @brief sets quat from two vectors
	 * @param Vec3 u
	 * @param Vec3 v
	 * @return Quat
	 */
        Quat.prototype.setVec3s = function(){
	    var a = new Vec3;
	    
	    return function( u, v ){
		a.vcross( u, v );
		
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
		this.w = sqrt( u.lenSq() * v.lenSq() ) + u.dot( v );
		
		this.norm();
		
		return this;
	    };
	}();
        
        /**
	 * @method setRotationMat3
	 * @memberof Quat
	 * @brief sets rotation from Mat3
	 * @param Mat3 m
	 * @return Quat
	 */
        Quat.prototype.setRotationMat3 = function( m ){
            var te = m.elements,
                m11 = te[0], m12 = te[3], m13 = te[6],
                m21 = te[1], m22 = te[4], m23 = te[7],
                m31 = te[2], m32 = te[5], m33 = te[8],
                trace = m11 + m22 + m33,
                s;
                
            if( trace > 0 ){
                s = 0.5 / sqrt( trace + 1.0 );
                
                this.w = 0.25 / s;
                this.x = ( m32 - m23 ) * s;
                this.y = ( m13 - m31 ) * s;
                this.z = ( m21 - m12 ) * s;
            }
            else if( m11 > m22 && m11 > m33 ){
                s = 2.0 * sqrt( 1.0 + m11 - m22 - m33 );
                
                this.w = ( m32 - m23 ) / s;
                this.x = 0.25 * s;
                this.y = ( m12 + m21 ) / s;
                this.z = ( m13 + m31 ) / s;
            }
            else if( m22 > m33 ){
                s = 2.0 * sqrt( 1.0 + m22 - m11 - m33 );
                
                this.w = ( m13 - m31 ) / s;
                this.x = ( m12 + m21 ) / s;
                this.y = 0.25 * s;
                this.z = ( m23 + m32 ) / s;
            }
            else{
                s = 2.0 * sqrt( 1.0 + m33 - m11 - m22 );
                
                this.w = ( m21 - m12 ) / s;
                this.x = ( m13 + m31 ) / s;
                this.y = ( m23 + m32 ) / s;
                this.z = 0.25 * s;
            }
            
            return this;
        };
        
        /**
	 * @method setRotationMat4
	 * @memberof Quat
	 * @brief sets rotation from Mat4
	 * @param Mat4 m
	 * @return Quat
	 */
        Quat.prototype.setRotationMat4 = function( m ){
            var te = m.elements,
                m11 = te[0], m12 = te[4], m13 = te[8],
                m21 = te[1], m22 = te[5], m23 = te[9],
                m31 = te[2], m32 = te[6], m33 = te[10],
                trace = m11 + m22 + m33,
                s;
                
            if( trace > 0 ){
                s = 0.5 / sqrt( trace + 1.0 );
                
                this.w = 0.25 / s;
                this.x = ( m32 - m23 ) * s;
                this.y = ( m13 - m31 ) * s;
                this.z = ( m21 - m12 ) * s;
            }
            else if( m11 > m22 && m11 > m33 ){
                s = 2.0 * sqrt( 1.0 + m11 - m22 - m33 );
                
                this.w = ( m32 - m23 ) / s;
                this.x = 0.25 * s;
                this.y = ( m12 + m21 ) / s;
                this.z = ( m13 + m31 ) / s;
            }
            else if( m22 > m33 ){
                s = 2.0 * sqrt( 1.0 + m22 - m11 - m33 );
                
                this.w = ( m13 - m31 ) / s;
                this.x = ( m12 + m21 ) / s;
                this.y = 0.25 * s;
                this.z = ( m23 + m32 ) / s;
            }
            else{
                s = 2.0 * sqrt( 1.0 + m33 - m11 - m22 );
                
                this.w = ( m21 - m12 ) / s;
                this.x = ( m13 + m31 ) / s;
                this.y = ( m23 + m32 ) / s;
                this.z = 0.25 * s;
            }
            
            return this;
        };
        
        /**
	 * @method rotateX
	 * @memberof Quat
	 * @brief sets quat's x rotation
	 * @param Number angle
	 * @return Quat
	 */
        Quat.prototype.rotateX = function( angle ){
            var halfAngle = angle * 0.5,
		x = this.x, y = this.y, z = this.z, w = this.w,
                s = sin( halfAngle ), c = cos( halfAngle );
            
            this.x = x * c + w * s;
            this.y = y * c + z * s;
            this.z = z * c - y * s;
            this.w = w * c - x * s;
            
            return this;
        };
        
        /**
	 * @method rotateY
	 * @memberof Quat
	 * @brief sets quat's y rotation
	 * @param Number angle
	 * @return Quat
	 */
        Quat.prototype.rotateY = function( angle ){
            var halfAngle = angle * 0.5,
		x = this.x, y = this.y, z = this.z, w = this.w,
                s = sin( halfAngle ), c = cos( halfAngle );
            
            this.x = x * c - z * s;
            this.y = y * c + w * s;
            this.z = z * c + x * s;
            this.w = w * c - y * s;
            
            return this;
        };
        
        /**
	 * @method rotateZ
	 * @memberof Quat
	 * @brief sets quat's z rotation
	 * @param Number angle
	 * @return Quat
	 */
        Quat.prototype.rotateZ = function( angle ){
            var halfAngle = angle * 0.5,
		x = this.x, y = this.y, z = this.z, w = this.w,
                s = sin( halfAngle ), c = cos( halfAngle );
            
            this.x = x * c + y * s;
            this.y = y * c - x * s;
            this.z = z * c + w * s;
            this.w = w * c - z * s;
            
            return this;
        };
        
        /**
	 * @method rotate
	 * @memberof Quat
	 * @brief rotates quat by z then x then y in that order
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 * @return Quat
	 */
        Quat.prototype.rotate = function( x, y, z ){
            
	    this.rotateZ( z );
            this.rotateX( x );
            this.rotateY( y );
	    
	    return this;
        };
        
        /**
	 * @method toString
	 * @memberof Quat
	 * @brief returns string value of this "Quat( 0, 0, 0, 1 )"
	 * @return Quat
	 */
        Quat.prototype.toString = function(){
            
            return "Quat( "+ this.x +", "+ this.y +", "+ this.z +", "+ this.w +" )";
        };
	
        /**
	 * @method equals
	 * @memberof Quat
	 * @brief checks if this quat equals other quat
	 * @param Quat other
	 * @return Boolean
	 */
        Quat.prototype.equals = function( other ){
            
            return !(
                !equals( this.x, other.x ) ||
                !equals( this.y, other.y ) ||
                !equals( this.z, other.z ) ||
                !equals( this.w, other.w )
            );
        };
        
        /**
	 * @method Quat.equals
	 * @memberof Quat
	 * @brief checks if a quat equals b quat
	 * @param Quat a
	 * @param Quat b
	 * @return Boolean
	 */
        Quat.equals = function( a, b ){
	    
            return !(
                !equals( a.x, b.x ) ||
                !equals( a.y, b.y ) ||
                !equals( a.z, b.z ) ||
                !equals( a.w, b.w )
            );
        };
	
	
	return Quat;
    }
);