if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	var random = Math.random,
	    floor = Math.floor,
	    abs = Math.abs,
	    atan2 = Math.atan2,
	    EPSILON = 0.000001,
	    PI = 3.1415926535897932384626433832795028841968,
	    TWO_PI = PI * 2,
	    HALF_PI = PI * 0.5,
	    TO_RADS = PI / 180,
	    TO_DEGS = 180 / PI,
	    modulo, clamp01, standardRadian, standardAngle, randFloat;
	    
	/**
	 * @class Mathf
	 * @brief collection of common math functions
	 */
	function Mathf(){
	    
	    /**
	    * @property Number PI
	    * @brief The infamous 3.1415926535897
	    * @memberof Mathf
	    */
	    this.PI = PI;
	    
	    /**
	    * @property Number TWO_PI
	    * @brief 2 * PI
	    * @memberof Mathf
	    */
	    this.TWO_PI = TWO_PI;
	    
	    /**
	    * @property Number HALF_PI
	    * @brief PI / 2
	    * @memberof Mathf
	    */
	    this.HALF_PI = HALF_PI;
	    
	    /**
	    * @property Number EPSILON
	    * @brief A small number value
	    * @memberof Mathf
	    */
	    this.EPSILON = EPSILON;
	    
	    /**
	    * @property Number TO_RADS
	    * @brief Degrees to radians conversion constant 
	    * @memberof Mathf
	    */
	    this.TO_RADS = TO_RADS;
	    
	    /**
	    * @property Number TO_DEGS
	    * @brief Radians to degrees conversion constant 
	    * @memberof Mathf
	    */
	    this.TO_DEGS = TO_DEGS;
	}
	
	
	Mathf.prototype.acos = Math.acos;
	Mathf.prototype.asin = Math.asin;
	Mathf.prototype.atan = Math.atan;
	Mathf.prototype.atan2 = Math.atan2;
	
	Mathf.prototype.cos = Math.cos;
	Mathf.prototype.sin = Math.sin;
	Mathf.prototype.tan = Math.tan;
	
	Mathf.prototype.abs = Math.abs;
	Mathf.prototype.ceil = Math.ceil;
	Mathf.prototype.exp = Math.exp;
	Mathf.prototype.floor = Math.floor;
	Mathf.prototype.log = Math.log;
	Mathf.prototype.max = Math.max;
	Mathf.prototype.min = Math.min;
	Mathf.prototype.pow = Math.pow;
	Mathf.prototype.random = Math.random;
	Mathf.prototype.round = Math.round;
	Mathf.prototype.sqrt = Math.sqrt;
	
	/**
	 * @method equals
	 * @memberof Mathf
	 * @brief returns if a = b within EPSILON
	 * @param Number a
	 * @param Number b
	 * @param Number EPSILON
	 * @return Boolean
	 */
	Mathf.prototype.equals = function( a, b, e ){
	    
	    return abs( a - b ) <= ( e || EPSILON );
	};
	
	/**
	 * @method modulo
	 * @memberof Mathf
	 * @brief returns remainder of a / b
	 * @param Number a
	 * @param Number b
	 * @return Number
	 */
	Mathf.prototype.modulo = modulo = function( a, b ){
            var r = a % b;
            
            return ( r * b < 0 ) ? r + b : r;
        };
	
	/**
	 * @method standardRadian
	 * @memberof Mathf
	 * @brief convertes x to standard radian 0 <= x < 2PI
	 * @param Number x
	 * @return Number
	 */
	Mathf.prototype.standardRadian = standardRadian = function( x ){
	    
	    return modulo( x, TWO_PI );
	};
	
	/**
	 * @method standardAngle
	 * @memberof Mathf
	 * @brief convertes x to standard angle 0 <= x < 360
	 * @param Number x
	 * @return Number
	 */
	Mathf.prototype.standardAngle = standardAngle = function( x ){
	    
	    return modulo( x, 360 );
	};
	
	/**
	 * @method sign
	 * @memberof Mathf
	 * @brief gets sign of x
	 * @param Number x
	 * @return Number
	 */
	Mathf.prototype.sign = function( x ){
	    
	    return x ? x < 0 ? -1 : 1 : 0;
	};
	
	/**
	 * @method clamp
	 * @memberof Mathf
	 * @brief clamp x between min and max
	 * @param Number x
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
	Mathf.prototype.clamp = function( x, min, max ){
	    
	    return x < min ? min : x > max ? max : x;
	};
	
	/**
	 * @method clampBottom
	 * @memberof Mathf
	 * @brief clamp x between min and Infinity
	 * @param Number x
	 * @param Number min
	 * @return Number
	 */
	Mathf.prototype.clampBottom = function( x, min ){
	    
	    return x < min ? min : x;
	};
	
	/**
	 * @method clampTop
	 * @memberof Mathf
	 * @brief clamp x between -Infinity and max
	 * @param Number x
	 * @param Number max
	 * @return Number
	 */
	Mathf.prototype.clampTop = function( x, max ){
	    
	    return x > max ? max : x;
	};
	
	/**
	 * @method clamp01
	 * @memberof Mathf
	 * @brief clamp x between 0 and 1
	 * @param Number x
	 * @return Number
	 */
	Mathf.prototype.clamp01 = clamp01 = function( x ){
	    
	    return x < 0 ? 0 : x > 1 ? 1 : x;
	};
	
	/**
	 * @method lerp
	 * @memberof Mathf
	 * @brief linear interpolation between a and b by t
	 * @param Number a
	 * @param Number b
	 * @param Number t
	 * @return Number
	 */
	Mathf.prototype.lerp = function( a, b, t ){
	    
	    return a + ( b - a ) * t;
	};
	
	/**
	 * @method lerp
	 * @memberof Mathf
	 * @brief linear interpolation between a and b by t makes sure return value is within 0 <= x < 2PI
	 * @param Number a
	 * @param Number b
	 * @param Number t
	 * @return Number
	 */
	Mathf.prototype.lerpAngle = function( a, b, t ){
	    
	    return standardRadian( a + ( b - a ) * clamp01( t ) );
	};
	
	/**
	 * @method smoothStep
	 * @memberof Mathf
	 * @brief smooth step
	 * @param Number x
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
	Mathf.prototype.smoothStep = function( x, min, max ){
            x = ( clamp01( x ) - min ) / ( max - min );
            
            return x * x * ( 3 - 2 * x );
        };
        
        /**
	 * @method smootherStep
	 * @memberof Mathf
	 * @brief smoother step
	 * @param Number x
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
        Mathf.prototype.smootherStep = function( x, min, max ){
            x = ( clamp01( x ) - min ) / ( max - min );
            
            return x * x * x * ( x * ( x * 6 - 15 ) + 10 );
        };
        
        /**
	 * @method pingPong
	 * @memberof Mathf
	 * @brief PingPongs the value t, so that it is never larger than length and never smaller than 0.
	 * @param Number t
	 * @param Number length
	 * @return Number
	 */
        Mathf.prototype.pingPong = function( t, length ){
	    length || ( length = 1 );
	    
	    return length - abs( t % ( 2 * length ) - length );
        };
        
        /**
	 * @method degsToRads
	 * @memberof Mathf
	 * @brief convertes degrees to radians
	 * @param Number x
	 * @return Number
	 */
        Mathf.prototype.degsToRads = function( x ){
	    
	    return standardRadian( x * TO_RADS );
        };
        
        /**
	 * @method radsToDegs
	 * @memberof Mathf
	 * @brief convertes radians to degrees
	 * @param Number x
	 * @return Number
	 */
        Mathf.prototype.radsToDegs = function( x ){
	    
	    return standardAngle( x * TO_DEGS );
        };
	
        /**
	 * @method randInt
	 * @memberof Mathf
	 * @brief returns random number between min and max
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
        Mathf.prototype.randInt = function( min, max ){
	    
	    return floor( randFloat( min, max + 1 ) );
        };
        
        /**
	 * @method randFloat
	 * @memberof Mathf
	 * @brief returns random number between min and max
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
        Mathf.prototype.randFloat = randFloat = function( min, max ){
	    
	    return min + ( random() * ( max - min ) );
        };
        
        /**
	 * @method randChoice
	 * @memberof Mathf
	 * @brief returns random item from array
	 * @param Array array
	 * @return Number
	 */
        Mathf.prototype.randChoice = function( array ){
	    
	    return array[ floor( random() * array.length ) ];
        };
        
        /**
	 * @method randBool
	 * @memberof Mathf
	 * @brief returns a random boolean
	 * @return Boolean
	 */
        Mathf.prototype.randBool = function(){
	    
	    return random() <= 0.5 ? false : true;
        };
        
        /**
	 * @method isPowerOfTwo
	 * @memberof Mathf
	 * @brief checks if x is a power of 2
	 * @param Number x
	 * @return Number
	 */
        Mathf.prototype.isPowerOfTwo = function( x ){
	    
	    return ( x & -x ) === x;
        };
        
        /**
	 * @method toPowerOfTwo
	 * @memberof Mathf
	 * @brief returns x to its next power of 2
	 * @param Number x
	 * @return Number
	 */
        Mathf.prototype.toPowerOfTwo = function( x ){
	    var i = 2;
	    
	    while( i < x ){
		i *= 2;
	    }
	    
	    return i;
        };
        
        /**
	 * @method direction
	 * @memberof Mathf
	 * @brief returns direction of x and y
	 * @param Number x
	 * @param Number y
	 * @return Number
	 */
        Mathf.prototype.direction = function( x, y ){
	    
	    if( abs( x ) >= abs( y ) ){
		
		return x > 0 ? "right" : "left"
	    }
	    
	    return y > 0 ? "up" : "down"
	};
	
	
	return new Mathf;
    }
);