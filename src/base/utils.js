if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	
	var objProto = Object.prototype,
	    toString = objProto.toString,
	    hasOwnProperty = objProto.hasOwnProperty;
	
	/**
	 * @class Utils
	 * @brief helper functions
	 */
	function Utils(){}
	
	/**
	 * @method has
	 * @memberof Utils
	 * @brief check if Object has property
	 * @param Object obj object to check
	 * @param String key property to check
	 */
	Utils.prototype.has = function( obj, key ){
	    
	    return hasOwnProperty.call( obj, key );
	};
	
	/**
	 * @method isFunction
	 * @memberof Utils
	 * @brief check if passed argument is a function
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isFunction = function( obj ){
	    
	    return typeof obj === "function";
	};
	
	/**
	 * @method isFinite
	 * @memberof Utils
	 * @brief check if passed argument is finite
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isFinite = function( obj ){
	    
	   return this.isFinite( obj ) && !this.isNaN( parseFloat( obj ) );
	};
	
	/**
	 * @method isNaN
	 * @memberof Utils
	 * @brief check if passed argument is NaN
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isNaN = function( obj ){
	    
	   return this.isNumber( obj ) && obj !== +obj;
	};
	
	/**
	 * @method isBoolean
	 * @memberof Utils
	 * @brief check if passed argument is Boolean
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isBoolean = function( obj ){
	    
	   return obj === true || obj === false || toString.call( obj ) === "[object Boolean]";
	};
	
	/**
	 * @method isNull
	 * @memberof Utils
	 * @brief check if passed argument is null
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isNull = function( obj ){
	    
	   return obj === void 0;
	};
	
	/**
	 * @method isUndefined
	 * @memberof Utils
	 * @brief check if passed argument is undefined
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isUndefined = function( obj ){
	    
	   return obj === null;
	};
	
	/**
	 * @method isArray
	 * @memberof Utils
	 * @brief check if passed argument is an Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isArray = function( obj ){
	    
	    return toString.call( obj ) === "[object Array]";
	};
	
	/**
	 * @method isArrayLike
	 * @memberof Utils
	 * @brief check if passed argument is Array like
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isArrayLike = function( obj ){
	    
	    return typeof obj === "object" && typeof obj.length === "number";
	};
	
	/**
	 * @method isObject
	 * @memberof Utils
	 * @brief check if passed argument is Object
	 * @return Boolean
	 */
	Utils.prototype.isObject = function( obj ){
	    
	    return obj === Object( obj );
	};
	
	/**
	 * @method isString
	 * @memberof Utils
	 * @brief check if passed argument is String
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isString = function( obj ){
	    
	    return typeof obj === "string";
	};
	
	/**
	 * @method isNumber
	 * @memberof Utils
	 * @brief check if passed argument is Number
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isNumber = function( obj ){
	    
	    return toString.call( obj ) === "[object Number]";
	};
	
	/**
	 * @method isArguments
	 * @memberof Utils
	 * @brief check if passed argument is arguments
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isArguments = function( obj ){
	    
	    return toString.call( obj ) === "[object Arguments]";
	};
	
	/**
	 * @method isDate
	 * @memberof Utils
	 * @brief check if passed argument is Date
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isDate = function( obj ){
	    
	    return toString.call( obj ) === "[object Date]";
	};
	
	/**
	 * @method isRegExp
	 * @memberof Utils
	 * @brief check if passed argument is RegExp
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isRegExp = function( obj ){
	    
	    return toString.call( obj ) === "[object RegExp]";
	};
	
	/**
	 * @method isFloat32Array
	 * @memberof Utils
	 * @brief check if passed argument is Float32Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isFloat32Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Float32Array]";
	};
	
	/**
	 * @method isFloat64Array
	 * @memberof Utils
	 * @brief check if passed argument is Float64Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isFloat64Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Float64Array]";
	};
	
	/**
	 * @method isInt32Array
	 * @memberof Utils
	 * @brief check if passed argument is Int32Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isInt32Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Int32Array]";
	};
	
	/**
	 * @method isInt16Array
	 * @memberof Utils
	 * @brief check if passed argument is Int16Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isInt16Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Int16Array]";
	};
	
	/**
	 * @method isInt8Array
	 * @memberof Utils
	 * @brief check if passed argument is Int8Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isInt8Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Int8Array]";
	};
	
	/**
	 * @method isUint32Array
	 * @memberof Utils
	 * @brief check if passed argument is Uint32Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isUint32Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Uint32Array]";
	};
	
	/**
	 * @method isUint16Array
	 * @memberof Utils
	 * @brief check if passed argument is Uint16Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isUint16Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Uint16Array]";
	};
	
	/**
	 * @method isUint8Array
	 * @memberof Utils
	 * @brief check if passed argument is Uint8Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
	Utils.prototype.isUint8Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Uint8Array]";
	};
	
	
	return new Utils;
    }
);