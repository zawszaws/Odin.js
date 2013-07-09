if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf",
	"math/vec2"
    ],
    function( Mathf, Vec2 ){
        "use strict";
        
	var sqrt = Math.sqrt,
	    clamp01 = Mathf.clamp01,
	    equals = Mathf.equals;
	
        /**
	 * @class Line2
	 * @brief 2D line, start and end vectors
	 * @param Vec2 start
	 * @param Vec2 end
	 */
        function Line2( start, end ){
	    
	    /**
	    * @property Vec2 start
	    * @memberof Line2
	    */
            this.start = start instanceof Vec2 ? start : new Vec2;
	    
	    /**
	    * @property Vec2 end
	    * @memberof Line2
	    */
            this.end = end instanceof Vec2 ? end : new Vec2;
	}
        
	
        Line2.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        /**
	 * @method clone
	 * @memberof Line2
	 * @brief returns new copy of this
	 * @return Line2
	 */
        Line2.prototype.clone = function(){
            
            return new Line2(
		this.start.clone(),
		this.end.clone()
	    );
	};
        
        /**
	 * @method copy
	 * @memberof Line2
	 * @brief copies other line
	 * @return Line2
	 */
        Line2.prototype.copy = function( other ){
	    var ts = this.start, te = this.end,
		os = other.start, os = other.end;
	    
            ts.x = os.x;
            ts.y = os.y;
	    
            te.x = oe.x;
            te.y = oe.y;
            
            return this;
	};
        
        /**
	 * @method set
	 * @memberof Line2
	 * @brief sets start and end point
	 * @param Vec2 start
	 * @param Vec2 end
	 * @return Line2
	 */
        Line2.prototype.set = function( start, end ){
	    var ts = this.start, te = this.end;
	    
            ts.x = start.x;
            ts.y = start.y;
	    
            te.x = end.x;
            te.y = end.y;
            
            return this;
	};
        
        /**
	 * @method add
	 * @memberof Line2
	 * @brief adds this start and end to other start and end
	 * @param Line2 other
	 * @return Line2
	 */
        Line2.prototype.add = function( other ){
	    var ts = this.start, te = this.end,
		x = other.x, y = other.y;
	    
            ts.x += x;
            ts.y += y;
	    
            te.x += x;
            te.y += y;
            
            return this;
	};
        
        /**
	 * @method sadd
	 * @memberof Line2
	 * @brief adds scalar to this start and end
	 * @param Number s
	 * @return Line2
	 */
        Line2.prototype.sadd = function( s ){
	    var ts = this.start, te = this.end;
	    
            ts.x += s;
            ts.y += s;
	    
            te.x += s;
            te.y += s;
            
            return this;
	};
        
        /**
	 * @method sub
	 * @memberof Line2
	 * @brief subtracts other start and end from this start and end
	 * @param Line2 other
	 * @return Line2
	 */
        Line2.prototype.sub = function( other ){
	    var ts = this.start, te = this.end,
		x = other.x, y = other.y;
	    
            ts.x -= x;
            ts.y -= y;
	    
            te.x -= x;
            te.y -= y;
            
            return this;
	};
        
        /**
	 * @method sadd
	 * @memberof Line2
	 * @brief subtracts scalar from this start and end
	 * @param Number s
	 * @return Line2
	 */
        Line2.prototype.ssub = function( s ){
	    var ts = this.start, te = this.end;
	    
            ts.x -= s;
            ts.y -= s;
	    
            te.x -= s;
            te.y -= s;
            
            return this;
	};
        
        /**
	 * @method mul
	 * @memberof Line2
	 * @brief multiples this start and end by other start and end
	 * @param Line2 other
	 * @return Line2
	 */
        Line2.prototype.mul = function( other ){
	    var ts = this.start, te = this.end,
		x = other.x, y = other.y;
	    
            ts.x *= x;
            ts.y *= y;
	    
            te.x *= x;
            te.y *= y;
            
            return this;
	};
        
        /**
	 * @method smul
	 * @memberof Line2
	 * @brief multiples this start and end by scalar
	 * @param Number s
	 * @return Line2
	 */
        Line2.prototype.smul = function( s ){
	    var ts = this.start, te = this.end;
	    
            ts.x *= s;
            ts.y *= s;
	    
            te.x *= s;
            te.y *= s;
            
            return this;
	};
        
        /**
	 * @method div
	 * @memberof Line2
	 * @brief divides this start and end by other start and end
	 * @param Line2 other
	 * @return Line2
	 */
        Line2.prototype.div = function( other ){
	    var ts = this.start, te = this.end,
		x = other.x !== 0 ? 1 / other.x : 0,
		y = other.y !== 0 ? 1 / other.y : 0;
	    
            ts.x *= x;
            ts.y *= y;
	    
            te.x *= x;
            te.y *= y;
            
            return this;
	};
        
        /**
	 * @method sdiv
	 * @memberof Line2
	 * @brief divides this start and end by scalar
	 * @param Number s
	 * @return Line2
	 */
        Line2.prototype.sdiv = function( s ){
	    var ts = this.start, te = this.end;
	    
	    s = s !== 0 ? 1 / s : 0;
	    
            ts.x *= s;
            ts.y *= s;
	    
            te.x *= s;
            te.y *= s;
            
            return this;
	};
        
        /**
	 * @method ldotv
	 * @memberof Line2
	 * @brief returns dot of line and vector
	 * @param Line2 l
	 * @param Vec2 v
	 * @return Number
	 */
        Line2.prototype.ldotv = function( l, v ){
	    var start = l.start, end = l.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return x * v.x + y * v.y;
	};
        
        /**
	 * @method dot
	 * @memberof Line2
	 * @brief returns dot of this and vector
	 * @param Vec2 v
	 * @return Number
	 */
        Line2.prototype.dot = function( v ){
	    var start = this.start, end = this.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return x * v.x + y * v.y;
	};
        
        /**
	 * @method lenSq
	 * @memberof Line2
	 * @brief returns squared length
	 * @return Number
	 */
        Line2.prototype.lenSq = function(){
	    var start = this.start, end = this.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return x * x + y * y;
	};
        
        /**
	 * @method len
	 * @memberof Line2
	 * @brief returns length
	 * @return Number
	 */
        Line2.prototype.len = function(){
	    var start = this.start, end = this.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return sqrt( x * x + y * y );
	};
        
        /**
	 * @method center
	 * @memberof Line2
	 * @brief returns center of this line
	 * @param Vec2 target
	 * @return Vec2
	 */
        Line2.prototype.center = function( target ){
	    target = target || new Vec2;
	    
	    var start = this.start, end = this.end;
	    
	    target.x = ( start.x + end.x ) * 0.5;
	    target.y = ( start.y + end.y ) * 0.5;
	    
	    return target;
	};
        
        /**
	 * @method delta
	 * @memberof Line2
	 * @brief returns vector representing this line
	 * @param Vec2 target
	 * @return Vec2
	 */
        Line2.prototype.delta = function( target ){
	    target = target || new Vec2;
	    
	    var start = this.start, end = this.end;
	    
	    target.x = end.x - start.x;
	    target.y = end.y - start.y;
	    
	    return target;
	};
        
        /**
	 * @method norm
	 * @memberof Line2
	 * @brief normalizes line
	 * @return Line2
	 */
        Line2.prototype.norm = function(){
	    var start = this.start, end = this.end,
		sx = start.x, sy = start.y,
		sl = sx * sx + sy * sy,
		
		ex = end.x, ey = end.y,
		el = ex * ex + ey * ey;
	    
	    sl = sl !== 0 ? 1 / sqrt( sl ) : 0;
	    start.x *= sl;
	    start.y *= sl;
	    
	    el = el !== 0 ? 1 / sqrt( el ) : 0;
	    end.x *= el;
	    end.y *= el;
	    
	    return this;
	};
        
        /**
	 * @method closestPoint
	 * @memberof Line2
	 * @brief returns closest point on line to point
	 * @param Vec2 point
	 * @param Vec2 target
	 * @return Vec2
	 */
        Line2.prototype.closestPoint = function( point, target ){
	    target = target || new Vec2;
	    
	    var a = this.start, b = this.end,
		ax = a.x, ay = a.y,
		bx = b.x, by = b.y,
		
		ex = bx - ax,
		ey = by - ay,
		
		dx = point.x - ax,
		dy = point.y - ay,
		
		t = clamp01( ( ex * dx + ey * dy ) / ( ex * ex + ey * ey ) );
	    
	    target.x = ex * t + ax;
	    target.y = ey * t + ay;
	    
	    return target;
	};
        
        /**
	 * @method intersect
	 * @memberof Line2
	 * @brief checks if this intersects with other and returns intersection point
	 * @param Line2 other
	 * @param Vec2 target
	 * @return Vec2
	 */
        Line2.prototype.intersect = function( other, target ){
	    target = target || new Vec2;
	    
	    var as = this.start, ae = this.end,
		asx = as.x, asy = as.y, aex = ae.x, aey = ae.y,
		
		bs = other.start, be = other.end,
		bsx = bs.x, bsy = bs.y, bex = be.x, bey = be.y,
		
		d = ( asx - aex ) * ( bsy - bey ) - ( asy - aey ) * ( bsx - bex ),
		pre, post;
	    
	    if( d === 0 ) return target;
	    
	    pre = ( asx * aey - asy * aex );
	    post = ( bsx * bey - bsy * bex );
	    
	    target.x = ( pre * ( bsx - bey ) - ( asx - aex ) * post ) / d;
	    target.y = ( pre * ( bsy - bey ) - ( asy - aey ) * post ) / d;
	    
	    return target;
	};
        
        /**
	 * @method toString
	 * @memberof Line2
	 * @brief returns string of this "Line2( start: Vec2( 0, 0 ), end: Vec2( 0, 1 ) )"
	 * @return String
	 */
        Line2.prototype.toString = function(){
            var start = this.start, end = this.end;
	    
            return "Line2( start: "+ start.x +", "+ start.y +", end: "+ end.x +", "+ end.y +" )";
	};
        
        /**
	 * @method equals
	 * @memberof Line2
	 * @brief checks if this equals other
	 * @param Line2 other
	 * @return Boolean
	 */
        Line2.prototype.equals = function( other ){
            var astart = this.start, aend = this.end,
		bstart = other.start, bend = other.end;
	    
            return !(
                !equals( astart.x, bstart.x ) ||
                !equals( astart.y, bstart.y ) ||
                !equals( aend.x, bend.x ) ||
                !equals( aend.y, bend.y )
            );
	};
        
        /**
	 * @method Line2.equal
	 * @memberof Line2
	 * @brief checks if a equals b
	 * @param Line2 a
	 * @param Line2 b
	 * @return Boolean
	 */
        Line2.equals = function( a, b ){
            var astart = a.start, aend = a.end,
		bstart = b.start, bend = b.end;
	    
            return !(
                !equals( astart.x, bstart.x ) ||
                !equals( astart.y, bstart.y ) ||
                !equals( aend.x, bend.x ) ||
                !equals( aend.y, bend.y )
            );
	};
        
        /**
	 * @method Line2.intersect
	 * @memberof Line2
	 * @brief checks if a intersects with b and returns intersection point
	 * @param Line2 a
	 * @param Line2 b
	 * @param Vec2 target
	 * @return Vec2
	 */
        Line2.intersect = function( a, b, target ){
	    target = target || new Vec2;
	    
	    var as = a.start, ae = a.end,
		asx = as.x, asy = as.y, aex = ae.x, aey = ae.y,
		
		bs = b.start, be = b.end,
		bsx = bs.x, bsy = bs.y, bex = be.x, bey = be.y,
		
		d = ( asx - aex ) * ( bsy - bey ) - ( asy - aey ) * ( bsx - bex ),
		pre, post;
	    
	    if( d === 0 ) return target;
	    
	    pre = ( asx * aey - asy * aex );
	    post = ( bsx * bey - bsy * bex );
	    
	    target.x = ( pre * ( bsx - bey ) - ( asx - aex ) * post ) / d;
	    target.y = ( pre * ( bsy - bey ) - ( asy - aey ) * post ) / d;
	    
	    return target;
	};
        
        return Line2;
    }
);