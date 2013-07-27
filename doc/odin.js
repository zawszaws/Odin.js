if ("function" != typeof define) var define = require("amdefine")(module);

define("base/class", [], function() {
    /**
	 * @class Class
	 * @brief Base class for all objects
	 */
    function Class() {
        /**
	    * @property Number _id
	    * @brief unique id of this object
	    * @memberof Class
	    */
        this._id = ++id;
        /**
	    * @property String _class
	    * @brief class name of object
	    * @memberof Class
	    */
        this._class = this.constructor.name;
        /**
	    * @property Object _events
	    * @brief event holder of object
	    * @memberof Class
	    */
        this._events = {};
    }
    var id = 0, shift = Array.prototype.shift, defineProperty = Object.defineProperty;
    /**
	 * @method clone
	 * @memberof Class
	 * @brief return a copy of this Object
	 */
    Class.prototype.clone = function() {
        var clone = new this.constructor();
        clone.copy(this);
        return clone;
    };
    /**
	 * @method copy
	 * @memberof Class
	 * @brief copies other object, override when extending
	 * @param Class other object to be copied
	 */
    Class.prototype.copy = function() {
        return this;
    };
    /**
	 * @method on
	 * @memberof Class
	 * @brief sets function to be called when event is triggered
	 * @param String name name of the event
	 * @param Function callback function to call on event
	 */
    Class.prototype.on = function(name, callback) {
        var events = this._events[name] || (this._events[name] = []);
        events.push(callback);
    };
    /**
	 * @method off
	 * @memberof Class
	 * @brief clears events under event name
	 * @param string name
	 */
    Class.prototype.off = function(name) {
        var events = this._events[name];
        events && (events.length = 0);
    };
    /**
	 * @method trigger
	 * @memberof Class
	 * @brief triggers event, arguments after the name will be passed to the event's callback
	 * @param String name
	 * @return Class
	 */
    Class.prototype.trigger = function(name) {
        var event, i, events = this._events[name];
        if (events && events.length) {
            shift.apply(arguments);
            for (i = events.length; i--; ) (event = events[i]).apply(this, arguments);
        }
    };
    /**
	 * @method toString
	 * @memberof Class
	 * @brief returns Class name
	 * @return String
	 */
    Class.prototype.toString = function() {
        return this._class;
    };
    /**
	 * @method Class.props
	 * @memberof Class
	 * @brief define properties, getter/setter functions
	 * @param Object obj object to add property too
	 * @param Object props properties to add
	 */
    Class.props = function(obj, props) {
        for (var key in props) defineProperty(obj, key, props[key]);
    };
    /**
	 * @method Class.extend
	 * @memberof Class
	 * @brief makes child inherit parent
	 */
    Class.extend = function(child, parent) {
        var key, parentProto = parent.prototype, childProto = child.prototype = Object.create(parentProto);
        for (key in parentProto) childProto[key] = parentProto[key];
        childProto.constructor = child;
        Class.types[childProto.constructor.name] = childProto.constructor;
    };
    Class.types = {
        Class: Class
    };
    return Class;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/device", [], function() {
    /**
	 * @class Device
	 * @brief user device info
	 */
    function Device() {
        /**
	    * @property String userAgent
	    * @brief user agent lower case string
	    * @memberof Device
	    */
        this.userAgent = userAgent;
        /**
	    * @property Number pixelRatio
	    * @brief device pixel ratio
	    * @memberof Device
	    */
        this.pixelRatio = 1 / (window.devicePixelRatio || 1);
        /**
	    * @property String browser
	    * @brief browser name
	    * @memberof Device
	    */
        this.browser = userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i)[1];
        /**
	    * @property Boolean touch
	    * @brief is touch device
	    * @memberof Device
	    */
        this.touch = "ontouchstart" in window;
        /**
	    * @property Boolean mobile
	    * @brief is mobile device
	    * @memberof Device
	    */
        this.mobile = /android|webos|iphone|ipad|ipod|blackberry/i.test(userAgent);
        /**
	    * @property Boolean webgl
	    * @brief does this device have webgl renderering
	    * @memberof Device
	    */
        this.webgl = "WebGLRenderingContext" in window;
        /**
	    * @property Boolean canvas
	    * @brief does this device have canvas renderering
	    * @memberof Device
	    */
        this.canvas = "CanvasRenderingContext2D" in window;
        /**
	    * @property Boolean gamepads
	    * @brief does this device support Gamepads
	    * @memberof Device
	    */
        this.gamepads = !!navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
        /**
	    * @property Boolean audioMpeg
	    * @brief can play mpeg
	    * @memberof Device
	    */
        this.audioMpeg = !!audio.canPlayType("audio/mpeg");
        /**
	    * @property Boolean audioMpeg
	    * @brief can play ogg
	    * @memberof Device
	    */
        this.audioOgg = !!audio.canPlayType("audio/ogg");
        /**
	    * @property Boolean audioMp4
	    * @brief can play mp4
	    * @memberof Device
	    */
        this.audioMp4 = !!audio.canPlayType("audio/mp4");
        /**
	    * @property Boolean videoWebm
	    * @brief can play video webm
	    * @memberof Device
	    */
        this.videoWebm = !!video.canPlayType("video/webm");
        /**
	    * @property Boolean videoOgg
	    * @brief can play video ogg
	    * @memberof Device
	    */
        this.videoOgg = !!video.canPlayType("video/ogg");
        /**
	    * @property Boolean videoMp4
	    * @brief can play video mp4
	    * @memberof Device
	    */
        this.videoMp4 = !!video.canPlayType("video/mp4");
    }
    var userAgent = navigator.userAgent.toLowerCase(), audio = new Audio(), video = document.createElement("video");
    return new Device();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/dom", [], function() {
    /**
	 * @class Dom
	 * @brief DOM helper functions
	 */
    function Dom() {}
    var createShader, splitter = /\s*[\s,]\s*/;
    /**
	 * @method addEvent
	 * @memberof Dom
	 * @brief adds event to object
	 * @param Object obj
	 * @param String name
	 * @param Function callback
	 * @param Object ctx
	 */
    Dom.prototype.addEvent = function(obj, name, callback, ctx) {
        var i, names = name.split(splitter), scope = ctx || obj, afn = function(e) {
            e = e || window.event;
            callback && callback.call(scope, e);
        };
        for (i = names.length; i--; ) {
            name = names[i];
            obj.attachEvent ? obj.attachEvent("on" + name, afn) : obj.addEventListener(name, afn, !1);
        }
    };
    /**
	 * @method removeEvent
	 * @memberof Dom
	 * @brief removes event from object
	 * @param Object obj
	 * @param String name
	 * @param Function callback
	 * @param Object ctx
	 */
    Dom.prototype.removeEvent = function(obj, name, callback, ctx) {
        var i, il, names = name.split(splitter), scope = ctx || obj, afn = function(e) {
            e = e || window.event;
            callback && callback.call(scope, e);
        };
        for (i = 0, il = names.length; il > i; i++) {
            name = names[i];
            obj.detachEvent ? obj.detachEvent("on" + name, afn) : obj.removeEventListener(name, afn, !1);
        }
    };
    /**
	 * @method addMeta
	 * @memberof Dom
	 * @brief adds meta data to header
	 * @param String id
	 * @param String name
	 * @param String content
	 */
    Dom.prototype.addMeta = function(id, name, content) {
        var meta = document.createElement("meta"), head = document.getElementsByTagName("head")[0];
        id && (meta.id = id);
        name && (meta.name = name);
        content && (meta.content = content);
        head.insertBefore(meta, head.firstChild);
    };
    /**
	 * @property Object audioContext
	 * @memberof Dom
	 * @brief audio context of dom
	 */
    Dom.prototype.audioContext = function() {
        return window.audioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext;
    }();
    /**
	 * @method requestAnimFrame
	 * @memberof Dom
	 * @brief request animation frame
	 * @param Function callback
	 */
    Dom.prototype.requestAnimationFrame = function() {
        var request = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 50 / 3);
        };
        return function(callback) {
            return request(callback);
        };
    }();
    /**
	 * @method ajax
	 * @memberof Dom
	 * @brief ajax call helper
	 * @param String url
	 * @param Function callback
	 */
    Dom.prototype.ajax = function(url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            1 === request.readyState && request.send();
            4 === request.readyState && (404 === request.status ? console.warn("Dom.ajax: 404 - file not found") : callback(request.responseText));
        };
        request.open("GET", url, !0);
    };
    /**
	 * @method getWebGLContext
	 * @memberof Dom
	 * @brief gets webgl context from canvas
	 * @param HTMLCanvasElement canvas
	 * @param Object attributes
	 */
    Dom.prototype.getWebGLContext = function() {
        var names = [ "webgl", "webkit-3d", "moz-webgl", "experimental-webgl", "3d" ], defaultAttributes = {
            alpha: !0,
            antialias: !0,
            depth: !0,
            premultipliedAlpha: !0,
            preserveDrawingBuffer: !1,
            stencil: !0
        };
        return function(canvas, attributes) {
            var key, gl, i = 0;
            attributes || (attributes = {});
            for (key in defaultAttributes) attributes[key] === void 0 && (attributes[key] = defaultAttributes[key]);
            for (i = names.length; i--; ) {
                gl = canvas.getContext(names[i], attributes);
                if (gl) break;
            }
            gl || console.warn("Dom.getWebGLContext: could not get webgl context");
            return gl;
        };
    }();
    /**
	 * @method createShader
	 * @memberof Dom
	 * @brief creates shader from string
	 * @param Object gl webgl context
	 * @param Object type webgl shader type( gl.FRAGMENT_SHADER or gl.VERTEX_SHADER )
	 * @param String source shader source
	 */
    Dom.prototype.createShader = createShader = function(gl, type, source) {
        var shader;
        "fragment" === type ? shader = gl.createShader(gl.FRAGMENT_SHADER) : "vertex" === type ? shader = gl.createShader(gl.VERTEX_SHADER) : console.warn("Dom.createShader: no shader with type " + type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.warn("Dom.createShader: problem compiling shader " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return void 0;
        }
        return shader;
    };
    /**
	 * @method createProgram
	 * @memberof Dom
	 * @brief creates program from vertex shader and fragment shader
	 * @param Object gl webgl context
	 * @param String vertex vertex shader source
	 * @param String fragment fragment shader source
	 */
    Dom.prototype.createProgram = function(gl, vertex, fragment) {
        var shader, program = gl.createProgram();
        shader = createShader(gl, "vertex", vertex);
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
        shader = createShader(gl, "fragment", fragment);
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
        gl.linkProgram(program);
        gl.validateProgram(program);
        gl.useProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.warn("Dom.createProgram: problem compiling Program " + gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return void 0;
        }
        return program;
    };
    return new Dom();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/objectpool", [], function() {
    /**
	 * @class ObjectPool
	 * @brief Object Pooling Helper
	 * @param Object constructor
	 */
    function ObjectPool(constructor) {
        /**
	    * @property Array pooled
	    * @brief array holding inactive objects
	    * @memberof ObjectPool
	    */
        this.pooled = [];
        /**
	    * @property Array objects
	    * @brief array holding active objects
	    * @memberof ObjectPool
	    */
        this.objects = [];
        /**
	    * @property Object constructor
	    * @brief reference to constructor object
	    * @memberof ObjectPool
	    */
        this.object = constructor;
    }
    /**
	 * @method create
	 * @memberof ObjectPool
	 * @brief creates new instance of this.object
	 */
    ObjectPool.prototype.create = function() {
        var pooled = this.pooled, object = pooled.length ? pooled.pop() : new this.object();
        this.objects.push(object);
        return object;
    };
    /**
	 * @method remove
	 * @memberof ObjectPool
	 * @brief removes passed object and pools it
	 * @param Object object
	 */
    ObjectPool.prototype.remove = function(object) {
        var objects = this.objects, pooled = this.pooled, index = objects.indexOf(object);
        if (index > -1) {
            pooled.push(object);
            objects.splice(index, 1);
        }
    };
    /**
	 * @method release
	 * @memberof ObjectPool
	 * @brief all arguments passed are removed and pooled
	 */
    ObjectPool.prototype.release = function() {
        for (var i = arguments.length; i--; ) this.remove(arguments[i]);
    };
    /**
	 * @method clear
	 * @memberof ObjectPool
	 * @brief removes all objects and pools them
	 */
    ObjectPool.prototype.clear = function() {
        var i, objects = this.objects, pooled = this.pooled;
        for (i = objects.length; i--; ) pooled.push(objects[i]);
        objects.length = 0;
    };
    return ObjectPool;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/time", [], function() {
    /**
	 * @class Time
	 * @brief Object to get time information
	 */
    function Time() {
        /**
	    * @property Number start
	    * @brief start time stamp of game
	    * @memberof Time
	    */
        this.start = start;
        /**
	    * @property Number sinceStart
	    * @brief real time in seconds since the game started
	    * @memberof Time
	    */
        this.sinceStart = 0;
        /**
	    * @property Number sceneStart
	    * @brief time the scene started
	    * @memberof Time
	    */
        this.sceneStart = 0;
        /**
	    * @property Number sinceSceneStart
	    * @brief time since scene started
	    * @memberof Time
	    */
        this.sinceSceneStart = 0;
        /**
	    * @property Number time
	    * @brief time that this frame started
	    * @memberof Time
	    */
        this.time = 0;
        /**
	    * @property Number scale
	    * @brief scale at which time is passing
	    * @memberof Time
	    */
        this._scale = 1;
        /**
	    * @property Number delta
	    * @brief time in seconds it took to complete the last frame
	    * @memberof Time
	    */
        this.delta = delta;
        /**
	    * @property Number fixedDelta
	    * @brief interval in seconds at which physics and other fixed frame rate updates are performed
	    * @memberof Time
	    */
        this._fixedDelta = globalFixed;
        /**
	    * @property Number frameCount
	    * @brief total number of frames that have passed since start
	    * @memberof Time
	    */
        this.frameCount = 0;
    }
    var start = .001 * Date.now(), globalFixed = 1 / 60, delta = 1 / 60;
    Object.defineProperty(Time.prototype, "scale", {
        get: function() {
            return this._scale;
        },
        set: function(value) {
            this._scale = value;
            this.fixedDelta = globalFixed * value;
        }
    });
    Object.defineProperty(Time.prototype, "fixedDelta", {
        get: function() {
            return this._fixedDelta;
        },
        set: function(value) {
            globalFixed = value;
            this._fixedDelta = value;
        }
    });
    /**
	* @property Number invDelta
	* @memberof Time
	*/
    Object.defineProperty(Time.prototype, "invDelta", {
        get: function() {
            return 1 / this.delta;
        }
    });
    /**
	 * @method now
	 * @memberof Time
	 * @brief returns time in seconds since start of game
	 * @return Number
	 */
    Time.prototype.now = function() {
        var w = "undefined" != typeof window ? window : {}, performance = w.performance !== void 0 ? w.performance : {};
        performance.now = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
            return Date.now() - start;
        };
        return function() {
            return .001 * performance.now();
        };
    }();
    /**
	 * @method stamp
	 * @memberof Time
	 * @brief time stamp in seconds
	 * @return Number
	 */
    Time.prototype.stamp = function() {
        return .001 * Date.now();
    };
    return new Time();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/utils", [], function() {
    /**
	 * @class Utils
	 * @brief helper functions
	 */
    function Utils() {}
    var objProto = Object.prototype, toString = objProto.toString, hasOwnProperty = objProto.hasOwnProperty;
    /**
	 * @method has
	 * @memberof Utils
	 * @brief check if Object has property
	 * @param Object obj object to check
	 * @param String key property to check
	 */
    Utils.prototype.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    /**
	 * @method isFunction
	 * @memberof Utils
	 * @brief check if passed argument is a function
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isFunction = function(obj) {
        return "function" == typeof obj;
    };
    /**
	 * @method isFinite
	 * @memberof Utils
	 * @brief check if passed argument is finite
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isFinite = function(obj) {
        return this.isFinite(obj) && !this.isNaN(parseFloat(obj));
    };
    /**
	 * @method isNaN
	 * @memberof Utils
	 * @brief check if passed argument is NaN
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isNaN = function(obj) {
        return this.isNumber(obj) && obj !== +obj;
    };
    /**
	 * @method isBoolean
	 * @memberof Utils
	 * @brief check if passed argument is Boolean
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isBoolean = function(obj) {
        return obj === !0 || obj === !1 || "[object Boolean]" === toString.call(obj);
    };
    /**
	 * @method isNull
	 * @memberof Utils
	 * @brief check if passed argument is null
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isNull = function(obj) {
        return void 0 === obj;
    };
    /**
	 * @method isUndefined
	 * @memberof Utils
	 * @brief check if passed argument is undefined
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isUndefined = function(obj) {
        return null === obj;
    };
    /**
	 * @method isArray
	 * @memberof Utils
	 * @brief check if passed argument is an Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isArray = function(obj) {
        return "[object Array]" === toString.call(obj);
    };
    /**
	 * @method isArrayLike
	 * @memberof Utils
	 * @brief check if passed argument is Array like
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isArrayLike = function(obj) {
        return "object" == typeof obj && "number" == typeof obj.length;
    };
    /**
	 * @method isObject
	 * @memberof Utils
	 * @brief check if passed argument is Object
	 * @return Boolean
	 */
    Utils.prototype.isObject = function(obj) {
        return obj === Object(obj);
    };
    /**
	 * @method isString
	 * @memberof Utils
	 * @brief check if passed argument is String
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isString = function(obj) {
        return "string" == typeof obj;
    };
    /**
	 * @method isNumber
	 * @memberof Utils
	 * @brief check if passed argument is Number
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isNumber = function(obj) {
        return "[object Number]" === toString.call(obj);
    };
    /**
	 * @method isArguments
	 * @memberof Utils
	 * @brief check if passed argument is arguments
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isArguments = function(obj) {
        return "[object Arguments]" === toString.call(obj);
    };
    /**
	 * @method isDate
	 * @memberof Utils
	 * @brief check if passed argument is Date
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isDate = function(obj) {
        return "[object Date]" === toString.call(obj);
    };
    /**
	 * @method isRegExp
	 * @memberof Utils
	 * @brief check if passed argument is RegExp
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isRegExp = function(obj) {
        return "[object RegExp]" === toString.call(obj);
    };
    /**
	 * @method isFloat32Array
	 * @memberof Utils
	 * @brief check if passed argument is Float32Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isFloat32Array = function(obj) {
        return "[object Float32Array]" === toString.call(obj);
    };
    /**
	 * @method isFloat64Array
	 * @memberof Utils
	 * @brief check if passed argument is Float64Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isFloat64Array = function(obj) {
        return "[object Float64Array]" === toString.call(obj);
    };
    /**
	 * @method isInt32Array
	 * @memberof Utils
	 * @brief check if passed argument is Int32Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isInt32Array = function(obj) {
        return "[object Int32Array]" === toString.call(obj);
    };
    /**
	 * @method isInt16Array
	 * @memberof Utils
	 * @brief check if passed argument is Int16Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isInt16Array = function(obj) {
        return "[object Int16Array]" === toString.call(obj);
    };
    /**
	 * @method isInt8Array
	 * @memberof Utils
	 * @brief check if passed argument is Int8Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isInt8Array = function(obj) {
        return "[object Int8Array]" === toString.call(obj);
    };
    /**
	 * @method isUint32Array
	 * @memberof Utils
	 * @brief check if passed argument is Uint32Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isUint32Array = function(obj) {
        return "[object Uint32Array]" === toString.call(obj);
    };
    /**
	 * @method isUint16Array
	 * @memberof Utils
	 * @brief check if passed argument is Uint16Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isUint16Array = function(obj) {
        return "[object Uint16Array]" === toString.call(obj);
    };
    /**
	 * @method isUint8Array
	 * @memberof Utils
	 * @brief check if passed argument is Uint8Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isUint8Array = function(obj) {
        return "[object Uint8Array]" === toString.call(obj);
    };
    return new Utils();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mathf", [], function() {
    /**
	 * @class Mathf
	 * @brief collection of common math functions
	 */
    function Mathf() {
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
    var modulo, clamp01, standardRadian, standardAngle, randFloat, random = Math.random, floor = Math.floor, abs = Math.abs, EPSILON = (Math.atan2, 
    1e-6), PI = 3.141592653589793, TWO_PI = 2 * PI, HALF_PI = .5 * PI, TO_RADS = PI / 180, TO_DEGS = 180 / PI;
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
    Mathf.prototype.equals = function(a, b, e) {
        return (e || EPSILON) >= abs(a - b);
    };
    /**
	 * @method modulo
	 * @memberof Mathf
	 * @brief returns remainder of a / b
	 * @param Number a
	 * @param Number b
	 * @return Number
	 */
    Mathf.prototype.modulo = modulo = function(a, b) {
        var r = a % b;
        return 0 > r * b ? r + b : r;
    };
    /**
	 * @method standardRadian
	 * @memberof Mathf
	 * @brief convertes x to standard radian 0 <= x < 2PI
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.standardRadian = standardRadian = function(x) {
        return modulo(x, TWO_PI);
    };
    /**
	 * @method standardAngle
	 * @memberof Mathf
	 * @brief convertes x to standard angle 0 <= x < 360
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.standardAngle = standardAngle = function(x) {
        return modulo(x, 360);
    };
    /**
	 * @method sign
	 * @memberof Mathf
	 * @brief gets sign of x
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.sign = function(x) {
        return x ? 0 > x ? -1 : 1 : 0;
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
    Mathf.prototype.clamp = function(x, min, max) {
        return min > x ? min : x > max ? max : x;
    };
    /**
	 * @method clampBottom
	 * @memberof Mathf
	 * @brief clamp x between min and Infinity
	 * @param Number x
	 * @param Number min
	 * @return Number
	 */
    Mathf.prototype.clampBottom = function(x, min) {
        return min > x ? min : x;
    };
    /**
	 * @method clampTop
	 * @memberof Mathf
	 * @brief clamp x between -Infinity and max
	 * @param Number x
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.clampTop = function(x, max) {
        return x > max ? max : x;
    };
    /**
	 * @method clamp01
	 * @memberof Mathf
	 * @brief clamp x between 0 and 1
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.clamp01 = clamp01 = function(x) {
        return 0 > x ? 0 : x > 1 ? 1 : x;
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
    Mathf.prototype.lerp = function(a, b, t) {
        return a + (b - a) * clamp01(t);
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
    Mathf.prototype.lerpAngle = function(a, b, t) {
        return standardRadian(a + (b - a) * clamp01(t));
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
    Mathf.prototype.smoothStep = function(x, min, max) {
        x = (clamp01(x) - min) / (max - min);
        return x * x * (3 - 2 * x);
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
    Mathf.prototype.smootherStep = function(x, min, max) {
        x = (clamp01(x) - min) / (max - min);
        return x * x * x * (x * (6 * x - 15) + 10);
    };
    /**
	 * @method pingPong
	 * @memberof Mathf
	 * @brief PingPongs the value t, so that it is never larger than length and never smaller than 0.
	 * @param Number t
	 * @param Number length
	 * @return Number
	 */
    Mathf.prototype.pingPong = function(t, length) {
        length || (length = 1);
        return length - abs(t % (2 * length) - length);
    };
    /**
	 * @method degsToRads
	 * @memberof Mathf
	 * @brief convertes degrees to radians
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.degsToRads = function(x) {
        return standardRadian(x * TO_RADS);
    };
    /**
	 * @method radsToDegs
	 * @memberof Mathf
	 * @brief convertes radians to degrees
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.radsToDegs = function(x) {
        return standardAngle(x * TO_DEGS);
    };
    /**
	 * @method randInt
	 * @memberof Mathf
	 * @brief returns random number between min and max
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.randInt = function(min, max) {
        return floor(randFloat(min, max + 1));
    };
    /**
	 * @method randFloat
	 * @memberof Mathf
	 * @brief returns random number between min and max
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.randFloat = randFloat = function(min, max) {
        return min + random() * (max - min);
    };
    /**
	 * @method randChoice
	 * @memberof Mathf
	 * @brief returns random item from array
	 * @param Array array
	 * @return Number
	 */
    Mathf.prototype.randChoice = function(array) {
        return array[floor(random() * array.length)];
    };
    /**
	 * @method randBool
	 * @memberof Mathf
	 * @brief returns a random boolean
	 * @return Boolean
	 */
    Mathf.prototype.randBool = function() {
        return .5 >= random() ? !1 : !0;
    };
    /**
	 * @method isPowerOfTwo
	 * @memberof Mathf
	 * @brief checks if x is a power of 2
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.isPowerOfTwo = function(x) {
        return (x & -x) === x;
    };
    /**
	 * @method toPowerOfTwo
	 * @memberof Mathf
	 * @brief returns x to its next power of 2
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.toPowerOfTwo = function(x) {
        for (var i = 2; x > i; ) i *= 2;
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
    Mathf.prototype.direction = function(x, y) {
        return abs(x) >= abs(y) ? x > 0 ? "right" : "left" : y > 0 ? "up" : "down";
    };
    return new Mathf();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/vec2", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Vec2
	 * @brief 2D vector
	 * @param Number x
	 * @param Number y
	 */
    function Vec2(x, y) {
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
        if (x && x.x) {
            this.x = x.x || 0;
            this.y = x.y || 0;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }
    var abs = Math.abs, sqrt = Math.sqrt, acos = Math.acos, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, clamp = Mathf.clamp, equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Vec2
	 * @brief returns new copy of this
	 * @return Vec2
	 */
    Vec2.prototype.clone = function() {
        return new Vec2(this.x, this.y);
    };
    /**
	 * @method copy
	 * @memberof Vec2
	 * @brief copies other vector
	 * @param Vec2 other vector to be copied
	 * @return Vec2
	 */
    Vec2.prototype.copy = function(other) {
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
    Vec2.prototype.set = function(x, y) {
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
    Vec2.prototype.vadd = function(a, b) {
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
    Vec2.prototype.add = function(other) {
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
    Vec2.prototype.sadd = function(s) {
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
    Vec2.prototype.vsub = function(a, b) {
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
    Vec2.prototype.sub = function(other) {
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
    Vec2.prototype.ssub = function(s) {
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
    Vec2.prototype.vmul = function(a, b) {
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
    Vec2.prototype.mul = function(other) {
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
    Vec2.prototype.smul = function(s) {
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
    Vec2.prototype.vdiv = function(a, b) {
        var x = b.x, y = b.y;
        this.x = 0 !== x ? a.x / x : 0;
        this.y = 0 !== y ? a.y / y : 0;
        return this;
    };
    /**
	 * @method div
	 * @memberof Vec2
	 * @brief divides this / other
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.div = function(other) {
        var x = other.x, y = other.y;
        this.x = 0 !== x ? this.x / x : 0;
        this.y = 0 !== y ? this.y / y : 0;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Vec2
	 * @brief divides this / scalar
	 * @param Number s
	 * @return Vec2
	 */
    Vec2.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
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
    Vec2.vdot = Vec2.prototype.vdot = function(a, b) {
        return a.x * b.x + a.y * b.y;
    };
    /**
	 * @method dot
	 * @memberof Vec2
	 * @brief gets dot product of this vector and other vector
	 * @param Vec2 other
	 * @return Number
	 */
    Vec2.prototype.dot = function(other) {
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
    Vec2.prototype.vlerp = function(a, b, t) {
        this.x = lerp(a.x, b.x, t);
        this.y = lerp(a.y, b.y, t);
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
    Vec2.prototype.lerp = function(other, t) {
        this.x = lerp(this.x, other.x, t);
        this.y = lerp(this.y, other.y, t);
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
    Vec2.prototype.vslerp = function() {
        var start = new Vec2(), end = new Vec2(), vec = new Vec2(), relative = new Vec2();
        return function(a, b, t) {
            var dot = clamp(a.dot(b), -1, 1), theta = acos(dot) * t;
            start.copy(a);
            end.copy(b);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
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
    Vec2.prototype.slerp = function() {
        var start = new Vec2(), end = new Vec2(), vec = new Vec2(), relative = new Vec2();
        return function(other, t) {
            var dot = clamp(this.dot(other), -1, 1), theta = acos(dot) * t;
            start.copy(this);
            end.copy(other);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
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
    Vec2.vcross = Vec2.prototype.vcross = function(a, b) {
        return a.x * b.y - a.y * b.x;
    };
    /**
	 * @method cross
	 * @memberof Vec2
	 * @brief cross product between this vector and other vector
	 * @param Vec2 other
	 * @return Number
	 */
    Vec2.prototype.cross = function(other) {
        return this.x * other.y - this.y * other.x;
    };
    /**
	 * @method applyMat2
	 * @memberof Vec2
	 * @brief multiply this vector by Mat2
	 * @param Mat2 m
	 * @return Vec2
	 */
    Vec2.prototype.applyMat2 = function(m) {
        var me = m.elements, x = this.x, y = this.y;
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
    Vec2.prototype.applyMat32 = function(m) {
        var me = m.elements, x = this.x, y = this.y;
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
    Vec2.prototype.applyMat3 = function(m) {
        var me = m.elements, x = this.x, y = this.y;
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
    Vec2.prototype.applyMat4 = function(m) {
        var me = m.elements, x = this.x, y = this.y;
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
    Vec2.prototype.applyProj = function(m) {
        var me = m.elements, x = this.x, y = this.y, d = 1 / (x * me[3] + y * me[7] + me[11] + me[15]);
        this.x = (me[0] * x + me[4] * y + me[8] + me[12]) * d;
        this.y = (me[1] * x + me[5] * y + me[9] + me[13]) * d;
        return this;
    };
    /**
	 * @method applyQuat
	 * @memberof Vec2
	 * @brief multiply this vector by quaternion
	 * @param Quat q
	 * @return Vec2
	 */
    Vec2.prototype.applyQuat = function(q) {
        var x = this.x, y = this.y, qx = q.x, qy = q.y, qz = q.z, qw = q.w, ix = qw * x + qy - qz * y, iy = qw * y + qz * x - qx, iz = qw + qx * y - qy * x, iw = -qx * x - qy * y - qz;
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
    Vec2.prototype.getPositionMat32 = function(m) {
        var me = m.elements;
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
    Vec2.prototype.getPositionMat4 = function(m) {
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
    Vec2.prototype.getScaleMat32 = function(m) {
        var sx = (m.elements, this.set(m[0], m[1]).len()), sy = this.set(m[2], m[3]).len();
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
    Vec2.prototype.getScaleMat3 = function(m) {
        var me = m.elements, sx = this.set(me[0], me[1], me[2]).len(), sy = this.set(me[3], me[4], me[5]).len();
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
    Vec2.prototype.getScaleMat4 = function(m) {
        var me = m.elements, sx = this.set(me[0], me[1], me[2]).len(), sy = this.set(me[4], me[5], me[6]).len();
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
    Vec2.prototype.lenSq = function() {
        var x = this.x, y = this.y;
        return x * x + y * y;
    };
    /**
	 * @method len
	 * @memberof Vec2
	 * @brief gets length of this
	 * @return Number
	 */
    Vec2.prototype.len = function() {
        var x = this.x, y = this.y;
        return sqrt(x * x + y * y);
    };
    /**
	 * @method norm
	 * @memberof Vec2
	 * @brief normalizes this vector so length is equal to 1
	 * @return Vec2
	 */
    Vec2.prototype.norm = function() {
        var x = this.x, y = this.y, l = x * x + y * y;
        l = 0 !== l ? 1 / sqrt(l) : 0;
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
    Vec2.prototype.negate = function() {
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
    Vec2.prototype.perpL = function() {
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
    Vec2.prototype.perpR = function() {
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
    Vec2.prototype.abs = function() {
        this.x = abs(this.x);
        this.y = abs(this.y);
        return this;
    };
    /**
	 * @method rotate
	 * @memberof Vec2
	 * @brief rotates vector by angle
	 * @param Number a angle to rotate by
	 * @return Vec2
	 */
    Vec2.prototype.rotate = function(a) {
        var x = this.x, y = this.y, c = cos(a), s = sin(a);
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
    Vec2.prototype.rotateAround = function(a, v) {
        return this.sub(v).rotate(a).add(v);
    };
    /**
	 * @method min
	 * @memberof Vec2
	 * @brief returns min values from this and other vector
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.min = function(other) {
        var x = other.x, y = other.y;
        this.x = this.x > x ? x : this.x;
        this.y = this.y > y ? y : this.y;
        return this;
    };
    /**
	 * @method max
	 * @memberof Vec2
	 * @brief returns max values from this and other vector
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.max = function(other) {
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
    Vec2.prototype.clamp = function(min, max) {
        this.x = clamp(this.x, min.x, max.x);
        this.y = clamp(this.y, min.y, max.y);
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
    Vec2.distSq = Vec2.prototype.distSq = function(a, b) {
        var x = b.x - a.x, y = b.y - a.y;
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
    Vec2.dist = Vec2.prototype.dist = function(a, b) {
        var x = b.x - a.x, y = b.y - a.y, d = x * x + y * y;
        return 0 !== d ? sqrt(d) : 0;
    };
    /**
	 * @method toString
	 * @memberof Vec2
	 * @brief returns string of this vector - "Vec2( 0, 0 )"
	 * @return String
	 */
    Vec2.prototype.toString = function() {
        return "Vec2( " + this.x + ", " + this.y + " )";
    };
    /**
	 * @method equals
	 * @memberof Vec2
	 * @brief checks if this vector equals other vector
	 * @param Vec2 other
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec2.prototype.equals = function(other, e) {
        return !(!equals(this.x, other.x, e) || !equals(this.y, other.y, e));
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
    Vec2.equals = function(a, b, e) {
        return !(!equals(a.x, b.x, e) || !equals(a.y, b.y, e));
    };
    return Vec2;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/aabb2", [ "math/mathf", "math/vec2" ], function(Mathf, Vec2) {
    /**
	 * @class AABB2
	 * @brief 2D axis aligned bounding box
	 * @param Vec2 min
	 * @param Vec2 max
	 */
    function AABB2(min, max) {
        /**
	    * @property Vec2 min
	    * @memberof AABB2
	    */
        this.min = new Vec2();
        /**
	    * @property Vec2 max
	    * @memberof AABB2
	    */
        this.max = new Vec2();
        if (min instanceof AABB2) this.copy(min); else {
            min && this.min.copy(min);
            max && this.max.copy(max);
        }
    }
    var equals = Mathf.equals;
    Math.abs, Math.cos, Math.sin;
    /**
	 * @method clone
	 * @memberof AABB2
	 * @brief returns new copy of this
	 * @return AABB2
	 */
    AABB2.prototype.clone = function() {
        return new AABB2(this.min.clone(), this.max.clone());
    };
    /**
	 * @method copy
	 * @memberof AABB2
	 * @brief copies other AABB
	 * @param AABB2 other
	 * @return AABB2
	 */
    AABB2.prototype.copy = function(other) {
        var amin = this.min, bmin = other.min, amax = this.max, bmax = other.max;
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
    AABB2.prototype.set = function(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    };
    /**
	 * @method setFromPoints
	 * @memberof AABB2
	 * @brief set min and max from array of vectors
	 * @param Array points
	 * @return AABB2
	 */
    AABB2.prototype.setFromPoints = function(points) {
        var v, minx, miny, maxx, maxy, x, y, i = points.length, min = this.min, max = this.max;
        if (i > 0) {
            minx = miny = 1/0;
            maxx = maxy = -1/0;
            for (;i--; ) {
                v = points[i];
                x = v.x;
                y = v.y;
                minx = minx > x ? x : minx;
                miny = miny > y ? y : miny;
                maxx = x > maxx ? x : maxx;
                maxy = y > maxy ? y : maxy;
            }
            min.x = minx;
            min.y = miny;
            max.x = maxx;
            max.y = maxy;
        } else min.x = min.y = max.x = max.y = 0;
        return this;
    };
    /**
	 * @method union
	 * @memberof AABB2
	 * @brief joins this and another aabb
	 * @param AABB2 aabb
	 * @return AABB2
	 */
    AABB2.prototype.union = function(other) {
        this.min.min(other.min);
        this.max.max(other.max);
        return this;
    };
    /**
	 * @method contains
	 * @memberof AABB2
	 * @brief checks if AABB contains point
	 * @param Vec2 point
	 * @return Boolean
	 */
    AABB2.prototype.contains = function(point) {
        var min = this.min, max = this.max, px = point.x, py = point.y;
        return !(min.x > px || px > max.x || min.y > py || py > max.y);
    };
    /**
	 * @method intersects
	 * @memberof AABB2
	 * @brief checks if AABB intersects AABB
	 * @param AABB2 other
	 * @return Boolean
	 */
    AABB2.prototype.intersects = function(other) {
        var aMin = this.min, aMax = this.max, bMin = other.min, bMax = other.max;
        return !(aMax.x < bMin.x || aMax.y < bMin.y || aMin.x > bMax.x || aMin.y > bMax.y);
    };
    /**
	 * @method toString
	 * @memberof AABB2
	 * @brief converts AABB to string "AABB2( min: Vec2( -1, -1 ), max: Vec2( 1, 1 ) )"
	 * @return String
	 */
    AABB2.prototype.toString = function() {
        var min = this.min, max = this.max;
        return "AABB2( min: " + min.x + ", " + min.y + ", max: " + max.x + ", " + max.y + " )";
    };
    /**
	 * @method equals
	 * @memberof AABB2
	 * @brief checks if AABB equals AABB
	 * @param AABB2 other
	 * @return Boolean
	 */
    AABB2.prototype.equals = function(other) {
        var amin = this.min, amax = this.max, bmin = other.min, bmax = other.max;
        return !!(equals(amin.x, bmin.x) && equals(amin.y, bmin.y) && equals(amax.x, bmax.x) && equals(amax.y, bmax.y));
    };
    /**
	 * @method AABB2.intersects
	 * @memberof AABB2
	 * @brief checks if AABB intersects AABB
	 * @param AABB2 a
	 * @param AABB2 b
	 * @return Boolean
	 */
    AABB2.intersects = function(a, b) {
        var aMin = a.min, aMax = a.max, bMin = b.min, bMax = b.max;
        return !(aMax.x < bMin.x || aMax.y < bMin.y || aMin.x > bMax.x || aMin.y > bMax.y);
    };
    /**
	 * @method AABB2.equals
	 * @memberof AABB2
	 * @brief checks if AABB equals AABB
	 * @return Boolean
	 */
    AABB2.equals = function(a, b) {
        var amin = a.min, amax = a.max, bmin = b.min, bmax = b.max;
        return !!(equals(amin.x, bmin.x) && equals(amin.y, bmin.y) && equals(amax.x, bmax.x) && equals(amax.y, bmax.y));
    };
    return AABB2;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/vec3", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Vec3
	 * @brief 3D vector
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 */
    function Vec3(x, y, z) {
        /**
	    * @property Number x
	    * @memberof Vec3
	    */
        this.x = 0;
        /**
	    * @property Number y
	    * @memberof Vec3
	    */
        this.y = 0;
        /**
	    * @property Number z
	    * @memberof Vec3
	    */
        this.z = 0;
        if (x && x.x) {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    }
    var abs = Math.abs, sqrt = Math.sqrt, acos = Math.acos, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, clamp = Mathf.clamp, equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Vec3
	 * @brief returns new copy of this
	 * @return Vec3
	 */
    Vec3.prototype.clone = function() {
        return new Vec3(this.x, this.y, this.z);
    };
    /**
	 * @method copy
	 * @memberof Vec3
	 * @brief copies other vector
	 * @param Vec3 other vector to be copied
	 * @return Vec3
	 */
    Vec3.prototype.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    };
    /**
	 * @method set
	 * @memberof Vec3
	 * @brief sets x and y of this vector
	 * @param Number x
	 * @param Number y
	 * @return Vec3
	 */
    Vec3.prototype.set = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    /**
	 * @method vadd
	 * @memberof Vec3
	 * @brief adds a + b saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.prototype.vadd = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    };
    /**
	 * @method add
	 * @memberof Vec3
	 * @brief adds this + other
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.add = function(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    };
    /**
	 * @method sadd
	 * @memberof Vec3
	 * @brief adds this + scalar
	 * @param Number s
	 * @return Vec3
	 */
    Vec3.prototype.sadd = function(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    };
    /**
	 * @method vsub
	 * @memberof Vec3
	 * @brief subtracts a - b saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.prototype.vsub = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    };
    /**
	 * @method sub
	 * @memberof Vec3
	 * @brief subtracts this - other
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.sub = function(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    };
    /**
	 * @method ssub
	 * @memberof Vec3
	 * @brief subtracts this - scalar
	 * @param Number s
	 * @return Vec3
	 */
    Vec3.prototype.ssub = function(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    };
    /**
	 * @method vmul
	 * @memberof Vec3
	 * @brief multiples a * b saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.prototype.vmul = function(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Vec3
	 * @brief multiples this * other
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.mul = function(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Vec3
	 * @brief multiples this * scalar
	 * @param Number s
	 * @return Vec3
	 */
    Vec3.prototype.smul = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    };
    /**
	 * @method vdiv
	 * @memberof Vec3
	 * @brief divides a / b saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.prototype.vdiv = function(a, b) {
        var x = b.x, y = b.y, z = b.z;
        this.x = 0 !== x ? a.x / x : 0;
        this.y = 0 !== y ? a.y / y : 0;
        this.z = 0 !== z ? a.z / z : 0;
        return this;
    };
    /**
	 * @method div
	 * @memberof Vec3
	 * @brief divides this / other
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.div = function(other) {
        var x = other.x, y = other.y, z = other.z;
        this.x = 0 !== x ? this.x / x : 0;
        this.y = 0 !== y ? this.y / y : 0;
        this.z = 0 !== z ? this.z / z : 0;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Vec3
	 * @brief divides this / scalar
	 * @param Number s
	 * @return Vec3
	 */
    Vec3.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    };
    /**
	 * @method vdot
	 * @memberof Vec3
	 * @brief gets dot product of a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Number
	 */
    Vec3.vdot = Vec3.prototype.vdot = function(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };
    /**
	 * @method dot
	 * @memberof Vec3
	 * @brief gets dot product of this vector and other vector
	 * @param Vec3 other
	 * @return Number
	 */
    Vec3.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    };
    /**
	 * @method vlerp
	 * @memberof Vec3
	 * @brief linear interpolation between a vector and b vector by t
	 * @param Vec3 a
	 * @param Vec3 b
	 * @param Number t between 0 and 1
	 * @return Vec3
	 */
    Vec3.prototype.vlerp = function(a, b, t) {
        this.x = lerp(a.x, b.x, t);
        this.y = lerp(a.y, b.y, t);
        this.z = lerp(a.z, b.z, t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Vec3
	 * @brief linear interpolation between this vector and other vector by t
	 * @param Vec3 other
	 * @param Number t between 0 and 1
	 * @return Vec3
	 */
    Vec3.prototype.lerp = function(other, t) {
        this.x = lerp(this.x, other.x, t);
        this.y = lerp(this.y, other.y, t);
        this.z = lerp(this.z, other.z, t);
        return this;
    };
    /**
	 * @method vslerp
	 * @memberof Vec3
	 * @brief angular interpolation between a vector and b vector by t
	 * @param Vec3 a
	 * @param Vec3 b
	 * @param Number t between 0 and 1
	 * @return Vec3
	 */
    Vec3.prototype.vslerp = function() {
        var start = new Vec3(), end = new Vec3(), vec = new Vec3(), relative = new Vec3();
        return function(a, b, t) {
            var dot = clamp(a.dot(b), -1, 1), theta = acos(dot) * t;
            start.copy(a);
            end.copy(b);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method slerp
	 * @memberof Vec3
	 * @brief angular interpolation between this vector and other vector by t
	 * @param Vec3 other
	 * @param Number t between 0 and 1
	 * @return Vec3
	 */
    Vec3.prototype.slerp = function() {
        var start = new Vec3(), end = new Vec3(), vec = new Vec3(), relative = new Vec3();
        return function(other, t) {
            var dot = clamp(this.dot(other), -1, 1), theta = acos(dot) * t;
            start.copy(this);
            end.copy(other);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method vcross
	 * @memberof Vec3
	 * @brief cross product between a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.vcross = Vec3.prototype.vcross = function(a, b) {
        var ax = a.x, ay = a.y, az = a.z, bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    };
    /**
	 * @method cross
	 * @memberof Vec3
	 * @brief cross product between this vector and other vector
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.cross = function(other) {
        var ax = this.x, ay = this.y, az = this.z, bx = other.x, by = other.y, bz = other.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    };
    /**
	 * @method applyMat3
	 * @memberof Vec3
	 * @brief multiply this vector by Mat3
	 * @param Mat3 m
	 * @return Vec3
	 */
    Vec3.prototype.applyMat3 = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z;
        this.x = x * me[0] + y * me[3] + z * me[6];
        this.y = x * me[1] + y * me[4] + z * me[7];
        this.z = x * me[2] + y * me[5] + z * me[8];
        return this;
    };
    /**
	 * @method applyMat4
	 * @memberof Vec3
	 * @brief multiply this vector by Mat4
	 * @param Mat4 m
	 * @return Vec3
	 */
    Vec3.prototype.applyMat4 = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z;
        this.x = x * me[0] + y * me[4] + z * me[8] + me[12];
        this.y = x * me[1] + y * me[5] + z * me[9] + me[13];
        this.z = x * me[2] + y * me[6] + z * me[10] + me[14];
        return this;
    };
    /**
	 * @method applyProj
	 * @memberof Vec3
	 * @brief multiply this vector by projection matrix
	 * @param Mat4 m
	 * @return Vec3
	 */
    Vec3.prototype.applyProj = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z, d = 1 / (x * me[3] + y * me[7] + z * me[11] + me[15]);
        this.x = (me[0] * x + me[4] * y + me[8] + z * me[12]) * d;
        this.y = (me[1] * x + me[5] * y + me[9] + z * me[13]) * d;
        this.z = (me[2] * x + me[6] * y + me[10] + z * me[14]) * d;
        return this;
    };
    /**
	 * @method applyQuat
	 * @memberof Vec3
	 * @brief multiply this vector by quaternion
	 * @param Quat q
	 * @return Vec3
	 */
    Vec3.prototype.applyQuat = function(q) {
        var x = this.x, y = this.y, z = this.z, qx = q.x, qy = q.y, qz = q.z, qw = q.w, ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    };
    /**
	 * @method getPositionMat4
	 * @memberof Vec3
	 * @brief gets position from Mat4
	 * @param Mat4 m
	 * @return Vec3
	 */
    Vec3.prototype.getPositionMat4 = function(m) {
        var me = m.elements;
        this.x = me[12];
        this.y = me[13];
        return this;
    };
    /**
	 * @method getScaleMat3
	 * @memberof Vec3
	 * @brief gets scale from Mat3
	 * @param Mat3 m
	 * @return Vec3
	 */
    Vec3.prototype.getScaleMat3 = function(m) {
        var me = m.elements, sx = this.set(me[0], me[1], me[2]).len(), sy = this.set(me[3], me[4], me[5]).len(), sz = this.set(me[6], me[7], me[8]).len();
        this.x = sx;
        this.y = sy;
        this.y = sz;
        return this;
    };
    /**
	 * @method getScaleMat4
	 * @memberof Vec3
	 * @brief gets scale from Mat4
	 * @param Mat4 m
	 * @return Vec3
	 */
    Vec3.prototype.getScaleMat4 = function(m) {
        var me = m.elements, sx = this.set(me[0], me[1], me[2]).len(), sy = this.set(me[4], me[5], me[6]).len(), sz = this.set(me[8], me[9], me[10]).len();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    };
    /**
	 * @method lenSq
	 * @memberof Vec3
	 * @brief gets squared length of this
	 * @return Number
	 */
    Vec3.prototype.lenSq = function() {
        var x = this.x, y = this.y, z = this.z;
        return x * x + y * y + z * z;
    };
    /**
	 * @method len
	 * @memberof Vec3
	 * @brief gets length of this
	 * @return Number
	 */
    Vec3.prototype.len = function() {
        var x = this.x, y = this.y, z = this.z;
        return sqrt(x * x + y * y + z * z);
    };
    /**
	 * @method norm
	 * @memberof Vec3
	 * @brief normalizes this vector so length is equal to 1
	 * @return Vec3
	 */
    Vec3.prototype.norm = function() {
        var x = this.x, y = this.y, z = this.z, l = x * x + y * y + z * z;
        l = 0 !== l ? 1 / sqrt(l) : 0;
        this.x *= l;
        this.y *= l;
        this.z *= l;
        return this;
    };
    /**
	 * @method negate
	 * @memberof Vec3
	 * @brief negates x and y values
	 * @return Vec3
	 */
    Vec3.prototype.negate = function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    /**
	 * @method abs
	 * @memberof Vec3
	 * @brief gets absolute values of vector
	 * @return Vec3
	 */
    Vec3.prototype.abs = function() {
        this.x = abs(this.x);
        this.y = abs(this.y);
        this.z = abs(this.z);
        return this;
    };
    /**
	 * @method min
	 * @memberof Vec3
	 * @brief returns min values from this and other vector
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.min = function(other) {
        var x = other.x, y = other.y, z = other.z;
        this.x = this.x > x ? x : this.x;
        this.y = this.y > y ? y : this.y;
        this.z = this.z > z ? z : this.z;
        return this;
    };
    /**
	 * @method max
	 * @memberof Vec3
	 * @brief returns max values from this and other vector
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.max = function(other) {
        var x = other.x, y = other.y, z = other.z;
        this.x = x > this.x ? x : this.x;
        this.y = y > this.y ? y : this.y;
        this.z = z > this.z ? z : this.z;
        return this;
    };
    /**
	 * @method clamp
	 * @memberof Vec3
	 * @brief clamps this vector between min and max vector's values
	 * @param Vec3 min
	 * @param Vec3 max
	 * @return Vec3
	 */
    Vec3.prototype.clamp = function(min, max) {
        this.x = clamp(this.x, min.x, max.x);
        this.y = clamp(this.y, min.y, max.y);
        this.z = clamp(this.z, min.z, max.z);
        return this;
    };
    /**
	 * @method distSq
	 * @memberof Vec3
	 * @brief gets squared distance between a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Number
	 */
    Vec3.distSq = Vec3.prototype.distSq = function(a, b) {
        var x = b.x - a.x, y = b.y - a.y, z = b.z - a.z;
        return x * x + y * y + z * z;
    };
    /**
	 * @method dist
	 * @memberof Vec3
	 * @brief gets distance between a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Number
	 */
    Vec3.dist = Vec3.prototype.dist = function(a, b) {
        var x = b.x - a.x, y = b.y - a.y, z = b.z - a.z, d = x * x + y * y + z * z;
        return 0 !== d ? sqrt(d) : 0;
    };
    /**
	 * @method toString
	 * @memberof Vec3
	 * @brief returns string of this vector - "Vec3( 0, 0, 0 )"
	 * @return String
	 */
    Vec3.prototype.toString = function() {
        return "Vec3( " + this.x + ", " + this.y + ", " + this.z + " )";
    };
    /**
	 * @method equals
	 * @memberof Vec3
	 * @brief checks if this vector equals other vector
	 * @param Vec3 other
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec3.prototype.equals = function(other, e) {
        return !(!equals(this.x, other.x, e) || !equals(this.y, other.y, e) || !equals(this.z, other.z, e));
    };
    /**
	 * @method Vec3.equals
	 * @memberof Vec3
	 * @brief checks if a vector equals b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec3.equals = function(a, b, e) {
        return !(!equals(a.x, b.x, e) || !equals(a.y, b.y, e) || !equals(a.z, b.z, e));
    };
    return Vec3;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/aabb3", [ "math/mathf", "math/vec3" ], function(Mathf, Vec3) {
    /**
	 * @class AABB3
	 * @brief 3D axis aligned bounding box
	 * @param Vec3 min
	 * @param Vec3 max
	 */
    function AABB3(min, max) {
        /**
	    * @property Vec3 min
	    * @memberof AABB3
	    */
        this.min = new Vec3();
        /**
	    * @property Vec3 max
	    * @memberof AABB3
	    */
        this.max = new Vec3();
        if (min instanceof AABB3) this.copy(min); else {
            min && this.min.copy(min);
            max && this.max.copy(max);
        }
    }
    var equals = Mathf.equals;
    Math.abs, Math.cos, Math.sin;
    /**
	 * @method clone
	 * @memberof AABB3
	 * @brief returns new copy of this
	 * @return AABB3
	 */
    AABB3.prototype.clone = function() {
        return new AABB3(this.min.clone(), this.max.clone());
    };
    /**
	 * @method copy
	 * @memberof AABB3
	 * @brief copies other AABB
	 * @param AABB3 other
	 * @return AABB3
	 */
    AABB3.prototype.copy = function(other) {
        var amin = this.min, bmin = other.min, amax = this.max, bmax = other.max;
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
    AABB3.prototype.set = function(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    };
    /**
	 * @method setFromPoints
	 * @memberof AABB3
	 * @brief set min and max from array of vectors
	 * @param Array points
	 * @return AABB3
	 */
    AABB3.prototype.setFromPoints = function(points) {
        var v, minx, miny, minz, maxx, maxy, maxz, x, y, z, i = points.length, min = this.min, max = this.max;
        if (il > 0) {
            minx = miny = minz = 1/0;
            maxx = maxy = maxz = -1/0;
            for (;i--; ) {
                v = points[i];
                x = v.x;
                y = v.y;
                z = v.z;
                minx = minx > x ? x : minx;
                miny = miny > y ? y : miny;
                minz = minz > z ? z : minz;
                maxx = x > maxx ? x : maxx;
                maxy = y > maxy ? y : maxy;
                maxz = z > maxz ? z : maxz;
            }
            min.x = minx;
            min.y = miny;
            min.x = minz;
            max.x = maxx;
            max.y = maxy;
            max.x = maxz;
        } else min.x = min.y = min.z = max.x = max.y = max.z = 0;
        return this;
    };
    /**
	 * @method union
	 * @memberof AABB3
	 * @brief joins this and another aabb
	 * @param AABB3 aabb
	 * @return AABB3
	 */
    AABB3.prototype.union = function(other) {
        this.min.min(other.min);
        this.max.max(other.max);
        return this;
    };
    /**
	 * @method contains
	 * @memberof AABB3
	 * @brief checks if AABB contains point
	 * @param Vec3 point
	 * @return Boolean
	 */
    AABB3.prototype.contains = function(point) {
        var px = (this.min, this.max, point.x), py = point.y, pz = point.z;
        return !(this.min.x > px || px > this.max.x || this.min.y > py || py > this.max.y || this.min.z > pz || pz > this.max.z);
    };
    /**
	 * @method intersects
	 * @memberof AABB3
	 * @brief checks if AABB intersects AABB
	 * @param AABB3 other
	 * @return Boolean
	 */
    AABB3.prototype.intersects = function(other) {
        var aMin = this.min, aMax = this.max, bMin = other.min, bMax = other.max;
        return !(aMax.x < bMin.x || aMax.y < bMin.y || aMin.x > bMax.x || aMin.y > bMax.y || aMin.z > bMax.z || aMin.z > bMax.z);
    };
    /**
	 * @method toString
	 * @memberof AABB3
	 * @brief converts AABB to string "AABB3( min: Vec2( -1, -1, -1 ), max: Vec2( 1, 1, 1 ) )"
	 * @return String
	 */
    AABB3.prototype.toString = function() {
        var min = this.min, max = this.max;
        return "AABB3( min: " + min.x + ", " + min.y + ", " + min.z + ", max: " + max.x + ", " + max.y + ", " + max.z + " )";
    };
    /**
	 * @method equals
	 * @memberof AABB3
	 * @brief checks if AABB equals AABB
	 * @param AABB3 other
	 * @return Boolean
	 */
    AABB3.prototype.equals = function(other) {
        var amin = this.min, amax = this.max, bmin = other.min, bmax = other.max;
        return !!(equals(amin.x, bmin.x) && equals(amin.y, bmin.y) && equals(amin.z, bmin.z) && equals(amax.x, bmax.x) && equals(amax.y, bmax.y) && equals(amax.z, bmax.z));
    };
    /**
	 * @method AABB3.intersects
	 * @memberof AABB3
	 * @brief checks if AABB intersects AABB
	 * @param AABB3 a
	 * @param AABB3 b
	 * @return Boolean
	 */
    AABB3.intersects = function(a, b) {
        var aMin = a.min, aMax = a.max, bMin = b.min, bMax = b.max;
        return !(aMax.x < bMin.x || aMax.y < bMin.y || aMax.z < bMin.z || aMin.x > bMax.x || aMin.y > bMax.y || aMin.z > bMax.z);
    };
    /**
	 * @method AABB3.equals
	 * @memberof AABB3
	 * @brief checks if AABB equals AABB
	 * @return Boolean
	 */
    AABB3.equals = function(a, b) {
        var amin = a.min, amax = a.max, bmin = b.min, bmax = b.max;
        return !!(equals(amin.x, bmin.x) && equals(amin.y, bmin.y) && equals(amin.z, bmin.z) && equals(amax.x, bmax.x) && equals(amax.y, bmax.y) && equals(amax.z, bmax.z));
    };
    return AABB3;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/color", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Color
	 * @brief color representation
	 * @param Number r
	 * @param Number g
	 * @param Number b
	 * @param Number a
	 */
    function Color(r, g, b, a) {
        /**
	    * @property Number r
	    * @memberof Color
	    */
        this.r = 0;
        /**
	    * @property Number g
	    * @memberof Color
	    */
        this.g = 0;
        /**
	    * @property Number b
	    * @memberof Color
	    */
        this.b = 0;
        /**
	    * @property Number a
	    * @memberof Color
	    */
        this.a = 1;
        this._cache = {
            rgb: "rgb( 0, 0, 0 )",
            rgba: "rgba( 0, 0, 0, 1 )",
            hex: "#000000"
        };
        this.set(r || 0, g || 0, b || 0, void 0 !== a ? a : 1);
    }
    var abs = Math.abs, floor = Math.floor, lerp = (Math.sqrt, Mathf.lerp), equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Color
	 * @brief returns new copy of this
	 * @return Color
	 */
    Color.prototype.clone = function() {
        return new Color(this.r, this.g, this.b, this.a);
    };
    /**
	 * @method copy
	 * @memberof Color
	 * @brief copies other color
	 * @param Color other color to be copied
	 * @return Color
	 */
    Color.prototype.copy = function(other) {
        var cacheA = this._cache, cacheB = other._cache;
        this.r = other.r;
        this.g = other.g;
        this.b = other.b;
        this.a = other.a;
        cacheA.hex = cacheB.hex;
        cacheA.rgb = cacheB.rgb;
        cacheA.rgba = cacheB.rgba;
        return this;
    };
    /**
	 * @method set
	 * @memberof Color
	 * @brief sets rgba values of this color
	 * @param Number r
	 * @param Number g
	 * @param Number b
	 * @param Number a
	 * @return Color
	 */
    Color.prototype.set = function(r, g, b, a) {
        if ("number" == typeof r) this.setArgs(r, g, b, a); else if ("string" == typeof r) this.setString(r); else {
            this.set(0, 0, 0, 1);
            console.warn("Color.set: Invalid input");
        }
        return this;
    };
    /**
	 * @method setString
	 * @memberof Color
	 * @brief sets rgba values of this color from string
	 * @param String string
	 * @return Color
	 */
    Color.prototype.setString = function() {
        function isValidRgb(rgb) {
            return rgb.match(reg1);
        }
        function isValidHex(hex) {
            return reg2.test(hex);
        }
        var hexName, reg1 = /^rgb(a)?\(\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,?\s*(-?[\d\.]+)?\s*\)$/, reg2 = /#(.)(.)(.)/;
        return function(str) {
            hexName = colorNames[str.toLowerCase()];
            if (isValidHex(str)) this.setHex(str); else if (isValidRgb(str)) this.setRgb(str); else if (hexName) this.setHex(hexName); else {
                this.set(0, 0, 0, 1);
                console.warn("Color.setString: Invalid String");
            }
            return this;
        };
    }();
    /**
	 * @method setArgs
	 * @memberof Color
	 * @brief sets rgba values of this color from r, g, b, a
	 * @param Number r
	 * @param Number g
	 * @param Number b
	 * @param Number a
	 * @return Color
	 */
    Color.prototype.setArgs = function(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this._updateCache();
        return this;
    };
    /**
	 * @method setRgb
	 * @memberof Color
	 * @brief sets rgba values of this color from rgb "rgba( 255, 128, 64, 1 )"
	 * @param String rgb
	 * @return Color
	 */
    Color.prototype.setRgb = function() {
        function isValid(rgb) {
            return rgb.match(reg);
        }
        var reg = /^rgb(a)?\(\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,?\s*(-?[\d\.]+)?\s*\)$/;
        return function(rgb) {
            rgb = isValid(rgb);
            if (rgb) {
                this.r = Number(rgb[2]) / 255;
                this.g = Number(rgb[4]) / 255;
                this.b = Number(rgb[6]) / 255;
                this.a = Number(rgb[8]) || 1;
            } else {
                this.set(0, 0, 0, 1);
                console.warn("Color.setRgb: Invalid rgb");
            }
            this._updateCache();
            return this;
        };
    }();
    /**
	 * @method setHex
	 * @memberof Color
	 * @brief sets rgba values of this color from hex "#ff8844"
	 * @param String hex
	 * @return Color
	 */
    Color.prototype.setHex = function() {
        function normalizeHex(hex) {
            4 === hex.length && (hex = hex.replace(reg1, str));
            hex.toLowerCase();
            return hex;
        }
        function isValid(hex) {
            return reg2.test(hex);
        }
        var reg1 = /#(.)(.)(.)/, reg2 = /^#(?:[0-9a-f]{3}){1,2}$/i, str = "#$1$1$2$2$3$3";
        return function(hex) {
            if (isValid(hex)) {
                normalizeHex(hex);
                this.r = parseInt(hex.substr(1, 2), 16) / 255;
                this.g = parseInt(hex.substr(3, 2), 16) / 255;
                this.b = parseInt(hex.substr(5, 2), 16) / 255;
                this.a = 1;
            } else {
                this.set(0, 0, 0, 1);
                console.warn("Color.setHex: Invalid hex");
            }
            this._updateCache();
            return this;
        };
    }();
    Color.prototype._updateCache = function() {
        function singleToHex(value) {
            num = floor(255 * value);
            n = parseInt(num).toString(16);
            0 === num ? n = "00" : num > 0 && 15 > num && (n = "0" + n);
            return n;
        }
        var cache, num, n;
        return function() {
            cache = this._cache;
            var hexR = singleToHex(this.r), hexG = singleToHex(this.g), hexB = singleToHex(this.b), rgbR = floor(256 * this.r), rgbG = floor(256 * this.g), rgbB = floor(256 * this.b), rgbA = floor(this.a);
            cache.rgb = "rgb( " + rgbR + ", " + rgbG + ", " + rgbB + " )";
            cache.rgba = "rgba( " + rgbR + ", " + rgbG + ", " + rgbB + ", " + rgbA + " )";
            cache.hex = "#" + hexR + hexG + hexB;
            return this;
        };
    }();
    /**
	 * @method hex
	 * @memberof Color
	 * @brief returns hex value "#ff8844"
	 * @return String
	 */
    Color.prototype.hex = function() {
        return this._cache.hex;
    };
    /**
	 * @method rgb
	 * @memberof Color
	 * @brief returns rgb value "rgb( 255, 128, 64 )"
	 * @return String
	 */
    Color.prototype.rgb = function() {
        return 1 === this.a ? this._cache.rgb : this._cache.rgba;
    };
    /**
	 * @method rgba
	 * @memberof Color
	 * @brief returns rgba value "rgba( 255, 128, 64, 1 )"
	 * @return String
	 */
    Color.prototype.rgba = function() {
        return this._cache.rgba;
    };
    /**
	 * @method smul
	 * @memberof Color
	 * @brief multiples this color by scalar
	 * @param Number s
	 * @return Color
	 */
    Color.prototype.smul = function(s) {
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Color
	 * @brief divides this color by scalar
	 * @param Number s
	 * @return Color
	 */
    Color.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
    };
    /**
	 * @method clerp
	 * @memberof Color
	 * @brief linear interpolation between a color and b color by t
	 * @param Color a
	 * @param Color b
	 * @param Number t
	 * @return Color
	 */
    Color.prototype.clerp = function(a, b, t) {
        this.r = lerp(a.r, b.r, t);
        this.g = lerp(a.g, b.g, t);
        this.b = lerp(a.b, b.b, t);
        this.a = lerp(a.a, b.a, t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Color
	 * @brief linear interpolation between this color and other color by t
	 * @param Color other
	 * @param Number t
	 * @return Color
	 */
    Color.prototype.lerp = function(other, t) {
        this.r = lerp(this.r, other.r, t);
        this.g = lerp(this.g, other.g, t);
        this.b = lerp(this.b, other.b, t);
        this.a = lerp(this.a, other.a, t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Color
	 * @brief returns absolute values of this color
	 * @return Color
	 */
    Color.prototype.abs = function() {
        this.r = abs(this.r);
        this.g = abs(this.g);
        this.b = abs(this.b);
        this.a = abs(this.a);
        return this;
    };
    /**
	 * @method min
	 * @memberof Color
	 * @brief returns min values from this color and other color
	 * @param Color other
	 * @return Color
	 */
    Color.prototype.min = function(other) {
        var r = other.r, g = other.g, b = other.b, a = other.a;
        this.r = this.r > r ? r : this.r;
        this.g = this.g > g ? g : this.g;
        this.b = this.b > b ? b : this.b;
        this.a = this.a > a ? a : this.a;
        return this;
    };
    /**
	 * @method max
	 * @memberof Color
	 * @brief returns max values from this color and other color
	 * @param Color other
	 * @return Color
	 */
    Color.prototype.max = function(other) {
        var r = other.r, g = other.g, b = other.b, a = other.a;
        this.r = r > this.r ? r : this.r;
        this.g = g > this.g ? g : this.g;
        this.b = b > this.b ? b : this.b;
        this.a = a > this.a ? a : this.a;
        return this;
    };
    /**
	 * @method clamp
	 * @memberof Color
	 * @brief clamp this color values by min and max color values
	 * @param Color min
	 * @param Color max
	 * @return Color
	 */
    Color.prototype.clamp = function(min, max) {
        this.r = clamp(this.r, min.r, max.r);
        this.g = clamp(this.g, min.g, max.g);
        this.b = clamp(this.b, min.b, max.b);
        this.a = clamp(this.a, min.a, max.a);
        return this;
    };
    /**
	 * @method toString
	 * @memberof Color
	 * @brief returns String of this color "Color( 1, 0.5, 0.25, 1 )"
	 * @return String
	 */
    Color.prototype.toString = function() {
        return "Color( " + this.r + ", " + this.g + ", " + this.b + ", " + this.a + " )";
    };
    /**
	 * @method equals
	 * @memberof Color
	 * @brief compares this color to other color
	 * @param Color other
	 * @param Number e
	 * @return Boolean
	 */
    Color.prototype.equals = function(other, e) {
        return !!(equals(this.r, other.r, e) && equals(this.g, other.g, e) && equals(this.b, other.b, e) && equals(this.a, other.a, e));
    };
    /**
	 * @method Color.equals
	 * @memberof Color
	 * @brief compares a color to b color
	 * @param Color a
	 * @param Color b
	 * @param Number e
	 * @return Boolean
	 */
    Color.equals = function(a, b, e) {
        return !!(equals(a.r, b.r, e) && equals(a.g, b.g, e) && equals(a.b, b.b, e) && equals(a.a, b.a, e));
    };
    var colorNames = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgrey: "#d3d3d3",
        lightgreen: "#90ee90",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370d8",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#d87093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
    };
    return Color;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/line2", [ "math/mathf", "math/vec2" ], function(Mathf, Vec2) {
    /**
	 * @class Line2
	 * @brief 2D line, start and end vectors
	 * @param Vec2 start
	 * @param Vec2 end
	 */
    function Line2(start, end) {
        /**
	    * @property Vec2 start
	    * @memberof Line2
	    */
        this.start = start instanceof Vec2 ? start : new Vec2();
        /**
	    * @property Vec2 end
	    * @memberof Line2
	    */
        this.end = end instanceof Vec2 ? end : new Vec2();
    }
    var sqrt = Math.sqrt, clamp01 = Mathf.clamp01, equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Line2
	 * @brief returns new copy of this
	 * @return Line2
	 */
    Line2.prototype.clone = function() {
        return new Line2(this.start.clone(), this.end.clone());
    };
    /**
	 * @method copy
	 * @memberof Line2
	 * @brief copies other line
	 * @return Line2
	 */
    Line2.prototype.copy = function(other) {
        var ts = this.start, te = this.end, os = other.start, os = other.end;
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
    Line2.prototype.set = function(start, end) {
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
    Line2.prototype.add = function(other) {
        var ts = this.start, te = this.end, x = other.x, y = other.y;
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
    Line2.prototype.sadd = function(s) {
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
    Line2.prototype.sub = function(other) {
        var ts = this.start, te = this.end, x = other.x, y = other.y;
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
    Line2.prototype.ssub = function(s) {
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
    Line2.prototype.mul = function(other) {
        var ts = this.start, te = this.end, x = other.x, y = other.y;
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
    Line2.prototype.smul = function(s) {
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
    Line2.prototype.div = function(other) {
        var ts = this.start, te = this.end, x = 0 !== other.x ? 1 / other.x : 0, y = 0 !== other.y ? 1 / other.y : 0;
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
    Line2.prototype.sdiv = function(s) {
        var ts = this.start, te = this.end;
        s = 0 !== s ? 1 / s : 0;
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
    Line2.prototype.ldotv = function(l, v) {
        var start = l.start, end = l.end, x = end.x - start.x, y = end.y - start.y;
        return x * v.x + y * v.y;
    };
    /**
	 * @method dot
	 * @memberof Line2
	 * @brief returns dot of this and vector
	 * @param Vec2 v
	 * @return Number
	 */
    Line2.prototype.dot = function(v) {
        var start = this.start, end = this.end, x = end.x - start.x, y = end.y - start.y;
        return x * v.x + y * v.y;
    };
    /**
	 * @method lenSq
	 * @memberof Line2
	 * @brief returns squared length
	 * @return Number
	 */
    Line2.prototype.lenSq = function() {
        var start = this.start, end = this.end, x = end.x - start.x, y = end.y - start.y;
        return x * x + y * y;
    };
    /**
	 * @method len
	 * @memberof Line2
	 * @brief returns length
	 * @return Number
	 */
    Line2.prototype.len = function() {
        var start = this.start, end = this.end, x = end.x - start.x, y = end.y - start.y;
        return sqrt(x * x + y * y);
    };
    /**
	 * @method center
	 * @memberof Line2
	 * @brief returns center of this line
	 * @param Vec2 target
	 * @return Vec2
	 */
    Line2.prototype.center = function(target) {
        target = target || new Vec2();
        var start = this.start, end = this.end;
        target.x = .5 * (start.x + end.x);
        target.y = .5 * (start.y + end.y);
        return target;
    };
    /**
	 * @method delta
	 * @memberof Line2
	 * @brief returns vector representing this line
	 * @param Vec2 target
	 * @return Vec2
	 */
    Line2.prototype.delta = function(target) {
        target = target || new Vec2();
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
    Line2.prototype.norm = function() {
        var start = this.start, end = this.end, sx = start.x, sy = start.y, sl = sx * sx + sy * sy, ex = end.x, ey = end.y, el = ex * ex + ey * ey;
        sl = 0 !== sl ? 1 / sqrt(sl) : 0;
        start.x *= sl;
        start.y *= sl;
        el = 0 !== el ? 1 / sqrt(el) : 0;
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
    Line2.prototype.closestPoint = function(point, target) {
        target = target || new Vec2();
        var a = this.start, b = this.end, ax = a.x, ay = a.y, bx = b.x, by = b.y, ex = bx - ax, ey = by - ay, dx = point.x - ax, dy = point.y - ay, t = clamp01((ex * dx + ey * dy) / (ex * ex + ey * ey));
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
    Line2.prototype.intersect = function(other, target) {
        target = target || new Vec2();
        var pre, post, as = this.start, ae = this.end, asx = as.x, asy = as.y, aex = ae.x, aey = ae.y, bs = other.start, be = other.end, bsx = bs.x, bsy = bs.y, bex = be.x, bey = be.y, d = (asx - aex) * (bsy - bey) - (asy - aey) * (bsx - bex);
        if (0 === d) return target;
        pre = asx * aey - asy * aex;
        post = bsx * bey - bsy * bex;
        target.x = (pre * (bsx - bey) - (asx - aex) * post) / d;
        target.y = (pre * (bsy - bey) - (asy - aey) * post) / d;
        return target;
    };
    /**
	 * @method toString
	 * @memberof Line2
	 * @brief returns string of this "Line2( start: Vec2( 0, 0 ), end: Vec2( 0, 1 ) )"
	 * @return String
	 */
    Line2.prototype.toString = function() {
        var start = this.start, end = this.end;
        return "Line2( start: " + start.x + ", " + start.y + ", end: " + end.x + ", " + end.y + " )";
    };
    /**
	 * @method equals
	 * @memberof Line2
	 * @brief checks if this equals other
	 * @param Line2 other
	 * @return Boolean
	 */
    Line2.prototype.equals = function(other) {
        var astart = this.start, aend = this.end, bstart = other.start, bend = other.end;
        return !!(equals(astart.x, bstart.x) && equals(astart.y, bstart.y) && equals(aend.x, bend.x) && equals(aend.y, bend.y));
    };
    /**
	 * @method Line2.equal
	 * @memberof Line2
	 * @brief checks if a equals b
	 * @param Line2 a
	 * @param Line2 b
	 * @return Boolean
	 */
    Line2.equals = function(a, b) {
        var astart = a.start, aend = a.end, bstart = b.start, bend = b.end;
        return !!(equals(astart.x, bstart.x) && equals(astart.y, bstart.y) && equals(aend.x, bend.x) && equals(aend.y, bend.y));
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
    Line2.intersect = function(a, b, target) {
        target = target || new Vec2();
        var pre, post, as = a.start, ae = a.end, asx = as.x, asy = as.y, aex = ae.x, aey = ae.y, bs = b.start, be = b.end, bsx = bs.x, bsy = bs.y, bex = be.x, bey = be.y, d = (asx - aex) * (bsy - bey) - (asy - aey) * (bsx - bex);
        if (0 === d) return target;
        pre = asx * aey - asy * aex;
        post = bsx * bey - bsy * bex;
        target.x = (pre * (bsx - bey) - (asx - aex) * post) / d;
        target.y = (pre * (bsy - bey) - (asy - aey) * post) / d;
        return target;
    };
    return Line2;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mat2", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Mat2
	 * @brief Matrix for 2D rotations
	 * @param Number m11
	 * @param Number m12
	 * @param Number m21
	 * @param Number m22
	 */
    function Mat2(m11, m12, m21, m22) {
        /**
	    * @property Float32Array elements
	    * @memberof Mat2
	    */
        this.elements = new Float32Array(4);
        m11 && m11.elements ? this.copy(m11) : this.set(m11 || 1, m12 || 0, m21 || 0, m22 || 1);
    }
    var abs = Math.abs, sin = Math.sin, cos = Math.cos, atan2 = Math.atan2, lerp = Mathf.lerp, equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Mat2
	 * @brief returns new copy of this
	 * @return Mat2
	 */
    Mat2.prototype.clone = function() {
        var te = this.elements;
        return new Mat2(te[0], te[2], te[1], te[3]);
    };
    /**
	 * @method copy
	 * @memberof Mat2
	 * @brief copies other matrix
	 * @return Mat2
	 */
    Mat2.prototype.copy = function(other) {
        var te = this.elements, me = other.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        return this;
    };
    /**
	 * @method set
	 * @memberof Mat2
	 * @brief sets matrix elements
	 * @param Number m11
	 * @param Number m12
	 * @param Number m21
	 * @param Number m22
	 * @return Mat2
	 */
    Mat2.prototype.set = function(m11, m12, m21, m22) {
        var te = this.elements;
        te[0] = m11;
        te[2] = m12;
        te[1] = m21;
        te[3] = m22;
        return this;
    };
    /**
	 * @method identity
	 * @memberof Mat2
	 * @brief sets matrix to identity matrix
	 * @return Mat2
	 */
    Mat2.prototype.identity = function() {
        var te = this.elements;
        te[0] = 1;
        te[1] = 0;
        te[2] = 0;
        te[3] = 1;
        return this;
    };
    /**
	 * @method zero
	 * @memberof Mat2
	 * @brief sets matrix to zero matrix
	 * @return Mat2
	 */
    Mat2.prototype.zero = function() {
        var te = this.elements;
        te[0] = 0;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        return this;
    };
    /**
	 * @method mmul
	 * @memberof Mat2
	 * @brief mutilples a and b
	 * @param Mat2 a
	 * @param Mat2 b
	 * @return Mat2
	 */
    Mat2.prototype.mmul = function(a, b) {
        var te = this.elements, ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[2], a21 = ae[1], a22 = ae[3], b11 = be[0], b12 = be[2], b21 = be[1], b22 = be[3];
        te[0] = a11 * b11 + a12 * b21;
        te[2] = a11 * b12 + a12 * b22;
        te[1] = a21 * b11 + a22 * b21;
        te[3] = a21 * b12 + a22 * b22;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Mat2
	 * @brief mutilples this and other
	 * @param Mat2 other
	 * @return Mat2
	 */
    Mat2.prototype.mul = function(other) {
        var ae = this.elements, be = other.elements, a11 = ae[0], a12 = ae[2], a21 = ae[1], a22 = ae[3], b11 = be[0], b12 = be[2], b21 = be[1], b22 = be[3];
        ae[0] = a11 * b11 + a12 * b21;
        ae[1] = a11 * b12 + a12 * b22;
        ae[2] = a21 * b11 + a22 * b21;
        ae[3] = a21 * b12 + a22 * b22;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Mat2
	 * @brief mutilples this by scalar
	 * @param Number s
	 * @return Mat2
	 */
    Mat2.prototype.smul = function(s) {
        var te = this.elements;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Mat2
	 * @brief divides this by scalar
	 * @param Number s
	 * @return Mat2
	 */
    Mat2.prototype.sdiv = function(s) {
        var te = this.elements;
        s = 0 !== s ? 1 / s : 1;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        return this;
    };
    /**
	 * @method transpose
	 * @memberof Mat2
	 * @brief transposes this matrix
	 * @return Mat2
	 */
    Mat2.prototype.transpose = function() {
        var tmp, te = this.elements;
        tmp = te[1];
        te[1] = te[2];
        te[2] = tmp;
        return this;
    };
    /**
	 * @method setTrace
	 * @memberof Mat2
	 * @brief sets the diagonal of matrix
	 * @param Vec2 v
	 * @return Mat2
	 */
    Mat2.prototype.setTrace = function(v) {
        var te = this.elements;
        te[0] = v.x;
        te[3] = v.y;
        return this;
    };
    /**
	 * @method minv
	 * @memberof Mat2
	 * @brief gets the inverse of another matrix saves it in this
	 * @param Mat2 other
	 * @return Mat2
	 */
    Mat2.prototype.minv = function(other) {
        var te = this.elements, me = other.elements, m11 = me[0], m12 = me[2], m21 = me[1], m22 = me[3], det = m11 * m22 - m12 * m21;
        det = 0 !== det ? 1 / det : 0;
        te[0] = m22 * det;
        te[1] = -m12 * det;
        te[2] = -m21 * det;
        te[3] = m11 * det;
        return this;
    };
    /**
	 * @method inv
	 * @memberof Mat2
	 * @brief gets the inverse of this matrix
	 * @return Mat2
	 */
    Mat2.prototype.inv = function() {
        var te = this.elements, m11 = te[0], m12 = te[2], m21 = te[1], m22 = te[3], det = m11 * m22 - m12 * m21;
        det = 0 !== det ? 1 / det : 0;
        te[0] = m22 * det;
        te[1] = -m12 * det;
        te[2] = -m21 * det;
        te[3] = m11 * det;
        return this;
    };
    /**
	 * @method mlerp
	 * @memberof Mat2
	 * @brief linear interpolation between a matrix and b matrix by t
	 * @param Mat2 a
	 * @param Mat2 b
	 * @param Number t
	 * @return Mat2
	 */
    Mat2.prototype.mlerp = function(a, b, t) {
        var te = this.elements, ae = a.elements, be = b.elements;
        te[0] = lerp(ae[0], be[0], t);
        te[1] = lerp(ae[1], be[1], t);
        te[2] = lerp(ae[2], be[2], t);
        te[3] = lerp(ae[3], be[3], t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Mat2
	 * @brief linear interpolation between this and other matrix by t
	 * @param Mat2 other
	 * @param Number t
	 * @return Mat2
	 */
    Mat2.prototype.lerp = function(other, t) {
        var ae = this.elements, be = other.elements;
        ae[0] = lerp(ae[0], be[0], t);
        ae[1] = lerp(ae[1], be[1], t);
        ae[2] = lerp(ae[2], be[2], t);
        ae[3] = lerp(ae[3], be[3], t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Mat2
	 * @brief gets absolute values of matrix
	 * @return Mat2
	 */
    Mat2.prototype.abs = function() {
        var te = this.elements;
        te[0] = abs(te[0]);
        te[1] = abs(te[1]);
        te[2] = abs(te[2]);
        te[3] = abs(te[3]);
        return this;
    };
    /**
	 * @method setRotation
	 * @memberof Mat2
	 * @brief sets rotation of matrix
	 * @param Number a
	 * @return Mat2
	 */
    Mat2.prototype.setRotation = function(a) {
        var te = this.elements, c = cos(a), s = sin(a);
        te[0] = c;
        te[1] = s;
        te[2] = -s;
        te[3] = c;
        return this;
    };
    /**
	 * @method getRotation
	 * @memberof Mat2
	 * @brief returns the rotation of the matrix
	 * @return Number
	 */
    Mat2.prototype.getRotation = function() {
        var te = this.elements;
        return atan2(te[1], te[0]);
    };
    /**
	 * @method rotate
	 * @memberof Mat2
	 * @brief rotates the matrix by angle
	 * @param Number angle
	 * @return Mat2
	 */
    Mat2.prototype.rotate = function(angle) {
        var te = this.elements, m11 = te[0], m12 = te[2], m21 = te[1], m22 = te[3], s = sin(angle), c = sin(angle);
        te[0] = m11 * c + m12 * s;
        te[1] = m11 * -s + m12 * c;
        te[2] = m21 * c + m22 * s;
        te[3] = m21 * -s + m22 * c;
        return this;
    };
    /**
	 * @method toString
	 * @memberof Mat2
	 * @brief returns string value of this "Mat2[ 1, 0, 0, 1 ]"
	 * @return String
	 */
    Mat2.prototype.toString = function() {
        var te = this.elements;
        return "Mat2[ " + te[0] + ", " + te[2] + "]\n" + "     [ " + te[1] + ", " + te[3] + "]";
    };
    /**
	 * @method equals
	 * @memberof Mat2
	 * @brief checks if this matrix equals other matrix
	 * @param Mat2 other
	 * @return Boolean
	 */
    Mat2.prototype.equals = function(other) {
        var ae = this.elements, be = other.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]));
    };
    /**
	 * @method Mat2.equals
	 * @memberof Mat2
	 * @brief checks if a matrix equals b matrix
	 * @param Mat2 a
	 * @param Mat2 b
	 * @return Boolean
	 */
    Mat2.equals = function(a, b) {
        var ae = a.elements, be = b.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]));
    };
    return Mat2;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mat3", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Mat3
	 * @brief Matrix for 3D rotations
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @param Number m31
	 * @param Number m32
	 * @param Number m33
	 */
    function Mat3(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        /**
	    * @property Float32Array elements
	    * @memberof Mat3
	    */
        this.elements = new Float32Array(9);
        m11 && m11.elements ? this.copy(m11) : this.set(m11 || 1, m12 || 0, m13 || 0, m21 || 0, m22 || 1, m23 || 0, m31 || 0, m32 || 0, m33 || 1);
    }
    var abs = Math.abs, lerp = (Math.sin, Math.cos, Mathf.lerp), equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Mat3
	 * @brief returns new copy of this
	 * @return Mat3
	 */
    Mat3.prototype.clone = function() {
        var te = this.elements;
        return new Mat3(te[0], te[3], te[6], te[1], te[4], te[7], te[2], te[5], te[8]);
    };
    /**
	 * @method copy
	 * @memberof Mat3
	 * @brief copies other matrix
	 * @return Mat3
	 */
    Mat3.prototype.copy = function(other) {
        var te = this.elements, me = other.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        return this;
    };
    /**
	 * @method set
	 * @memberof Mat3
	 * @brief sets matrix elements
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @param Number m31
	 * @param Number m32
	 * @param Number m33
	 * @return Mat3
	 */
    Mat3.prototype.set = function(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        var te = this.elements;
        te[0] = m11;
        te[3] = m12;
        te[6] = m13;
        te[1] = m21;
        te[4] = m22;
        te[7] = m23;
        te[2] = m31;
        te[5] = m32;
        te[8] = m33;
        return this;
    };
    /**
	 * @method identity
	 * @memberof Mat3
	 * @brief sets matrix to identity matrix
	 * @return Mat3
	 */
    Mat3.prototype.identity = function() {
        var te = this.elements;
        te[0] = 1;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 1;
        te[5] = 0;
        te[6] = 0;
        te[7] = 0;
        te[8] = 1;
        return this;
    };
    /**
	 * @method zero
	 * @memberof Mat3
	 * @brief sets matrix to zero matrix
	 * @return Mat3
	 */
    Mat3.prototype.zero = function() {
        var te = this.elements;
        te[0] = 0;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = 0;
        te[6] = 0;
        te[7] = 0;
        te[8] = 0;
        return this;
    };
    /**
	 * @method mmul
	 * @memberof Mat3
	 * @brief mutilples a and b
	 * @param Mat3 a
	 * @param Mat3 b
	 * @return Mat3
	 */
    Mat3.prototype.mmul = function(a, b) {
        var te = this.elements, ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[3], a13 = ae[6], a21 = ae[1], a22 = ae[4], a23 = ae[7], a31 = ae[2], a32 = ae[5], a33 = ae[8], b11 = be[0], b12 = be[3], b13 = be[6], b21 = be[1], b22 = be[4], b23 = be[7], b31 = be[2], b32 = be[5], b33 = be[8];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31;
        te[3] = a11 * b12 + a12 * b22 + a13 * b32;
        te[6] = a11 * b13 + a12 * b23 + a13 * b33;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31;
        te[4] = a21 * b12 + a22 * b22 + a23 * b32;
        te[7] = a21 * b13 + a22 * b23 + a23 * b33;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31;
        te[5] = a31 * b12 + a32 * b22 + a33 * b32;
        te[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Mat3
	 * @brief mutilples this and other
	 * @param Mat3 other
	 * @return Mat3
	 */
    Mat3.prototype.mul = function(other) {
        var ae = this.elements, be = other.elements, a11 = ae[0], a12 = ae[3], a13 = ae[6], a21 = ae[1], a22 = ae[4], a23 = ae[7], a31 = ae[2], a32 = ae[5], a33 = ae[8], b11 = be[0], b12 = be[3], b13 = be[6], b21 = be[1], b22 = be[4], b23 = be[7], b31 = be[2], b32 = be[5], b33 = be[8];
        ae[0] = a11 * b11 + a12 * b21 + a13 * b31;
        ae[3] = a11 * b12 + a12 * b22 + a13 * b32;
        ae[6] = a11 * b13 + a12 * b23 + a13 * b33;
        ae[1] = a21 * b11 + a22 * b21 + a23 * b31;
        ae[4] = a21 * b12 + a22 * b22 + a23 * b32;
        ae[7] = a21 * b13 + a22 * b23 + a23 * b33;
        ae[2] = a31 * b11 + a32 * b21 + a33 * b31;
        ae[5] = a31 * b12 + a32 * b22 + a33 * b32;
        ae[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Mat3
	 * @brief mutilples this by scalar
	 * @param Number s
	 * @return Mat3
	 */
    Mat3.prototype.smul = function(s) {
        var te = this.elements;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        te[6] *= s;
        te[7] *= s;
        te[8] *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Mat3
	 * @brief divides this by scalar
	 * @param Number s
	 * @return Mat3
	 */
    Mat3.prototype.sdiv = function(s) {
        var te = this.elements;
        s = 0 !== s ? 1 / s : 1;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        te[6] *= s;
        te[7] *= s;
        te[8] *= s;
        return this;
    };
    /**
	 * @method transpose
	 * @memberof Mat3
	 * @brief transposes this matrix
	 * @return Mat3
	 */
    Mat3.prototype.transpose = function() {
        var tmp, te = this.elements;
        tmp = te[1];
        te[1] = te[3];
        te[3] = tmp;
        tmp = te[2];
        te[2] = te[6];
        te[6] = tmp;
        tmp = te[5];
        te[5] = te[7];
        te[7] = tmp;
        return this;
    };
    /**
	 * @method setTrace
	 * @memberof Mat3
	 * @brief sets the diagonal of matrix
	 * @param Vec3 v
	 * @return Mat3
	 */
    Mat3.prototype.setTrace = function(v) {
        var te = this.elements;
        te[0] = v.x;
        te[4] = v.y;
        te[8] = v.z || 1;
        return this;
    };
    /**
	 * @method minv
	 * @memberof Mat3
	 * @brief gets the inverse of another matrix saves it in this
	 * @param Mat3 other
	 * @return Mat3
	 */
    Mat3.prototype.minv = function(m) {
        var te = this.elements, me = m.elements, m11 = me[0], m12 = me[3], m13 = me[6], m21 = me[1], m22 = me[4], m23 = me[7], m31 = me[2], m32 = me[5], m33 = me[8];
        te[0] = m22 * m33 - m23 * m32;
        te[1] = m23 * m31 - m21 * m33;
        te[2] = m21 * m32 - m22 * m31;
        te[3] = m13 * m32 - m12 * m33;
        te[4] = m11 * m33 - m13 * m31;
        te[5] = m12 * m31 - m11 * m32;
        te[6] = m12 * m23 - m13 * m22;
        te[7] = m13 * m21 - m11 * m23;
        te[8] = m11 * m22 - m12 * m21;
        this.sdiv(m11 * te[0] + m21 * te[3] + m31 * te[6]);
        return this;
    };
    /**
	 * @method invMat4
	 * @memberof Mat3
	 * @brief gets the inverse of Mat4 saves it in this
	 * @param Mat4 m
	 * @return Mat3
	 */
    Mat3.prototype.invMat4 = function(m) {
        var te = this.elements, me = m.elements, m11 = me[0], m12 = me[4], m13 = me[8], m21 = (me[12], 
        me[1]), m22 = me[5], m23 = me[9], m31 = (me[13], me[2]), m32 = me[6], m33 = me[10];
        me[14], me[3], me[7], me[11], me[15];
        te[0] = m33 * m22 - m32 * m23;
        te[1] = -m33 * m21 + m31 * m23;
        te[2] = m32 * m21 - m31 * m22;
        te[3] = -m33 * m12 + m32 * m13;
        te[4] = m33 * m11 - m31 * m13;
        te[5] = -m32 * m11 + m31 * m12;
        te[6] = m23 * m12 - m22 * m13;
        te[7] = -m23 * m11 + m21 * m13;
        te[8] = m22 * m11 - m21 * m12;
        this.sdiv(m11 * te[0] + m21 * te[3] + m31 * te[6]);
        return this;
    };
    /**
	 * @method inv
	 * @memberof Mat3
	 * @brief gets the inverse of this matrix
	 * @return Mat3
	 */
    Mat3.prototype.inv = function() {
        var te = this.elements, m11 = te[0], m12 = te[3], m13 = te[6], m21 = te[1], m22 = te[4], m23 = te[7], m31 = te[2], m32 = te[5], m33 = te[8];
        te[0] = m22 * m33 - m23 * m32;
        te[1] = m23 * m31 - m21 * m33;
        te[2] = m21 * m32 - m22 * m31;
        te[3] = m13 * m32 - m12 * m33;
        te[4] = m11 * m33 - m13 * m31;
        te[5] = m12 * m31 - m11 * m32;
        te[6] = m12 * m23 - m13 * m22;
        te[7] = m13 * m21 - m11 * m23;
        te[8] = m11 * m22 - m12 * m21;
        this.sdiv(m11 * te[0] + m21 * te[3] + m31 * te[6]);
        return this;
    };
    /**
	 * @method mlerp
	 * @memberof Mat3
	 * @brief linear interpolation between a matrix and b matrix by t
	 * @param Mat3 a
	 * @param Mat3 b
	 * @param Number t
	 * @return Mat3
	 */
    Mat3.prototype.mlerp = function(a, b, t) {
        var te = this.elements, ae = a.elements, be = b.elements;
        te[0] = lerp(ae[0], be[0], t);
        te[1] = lerp(ae[1], be[1], t);
        te[2] = lerp(ae[2], be[2], t);
        te[3] = lerp(ae[3], be[3], t);
        te[4] = lerp(ae[4], be[4], t);
        te[5] = lerp(ae[5], be[5], t);
        te[6] = lerp(ae[6], be[6], t);
        te[7] = lerp(ae[7], be[7], t);
        te[8] = lerp(ae[8], be[8], t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Mat3
	 * @brief linear interpolation between this and other matrix by t
	 * @param Mat3 other
	 * @param Number t
	 * @return Mat3
	 */
    Mat3.prototype.lerp = function(other, t) {
        var ae = this.elements, be = other.elements;
        ae[0] = lerp(ae[0], be[0], t);
        ae[1] = lerp(ae[1], be[1], t);
        ae[2] = lerp(ae[2], be[2], t);
        ae[3] = lerp(ae[3], be[3], t);
        ae[4] = lerp(ae[4], be[4], t);
        ae[5] = lerp(ae[5], be[5], t);
        ae[6] = lerp(ae[6], be[6], t);
        ae[7] = lerp(ae[7], be[7], t);
        ae[8] = lerp(ae[8], be[8], t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Mat3
	 * @brief gets absolute values of matrix
	 * @return Mat3
	 */
    Mat3.prototype.abs = function() {
        var te = this.elements;
        te[0] = abs(te[0]);
        te[1] = abs(te[1]);
        te[2] = abs(te[2]);
        te[3] = abs(te[3]);
        te[4] = abs(te[4]);
        te[5] = abs(te[5]);
        te[6] = abs(te[6]);
        te[7] = abs(te[7]);
        te[8] = abs(te[8]);
        return this;
    };
    /**
	 * @method setRotationQuat
	 * @memberof Mat3
	 * @brief sets rotation of matrix from quaterian
	 * @param Quat q
	 * @return Mat3
	 */
    Mat3.prototype.setRotationQuat = function(q) {
        var te = this.elements, x = q.x, y = q.y, z = q.z, w = q.w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
        te[0] = 1 - (yy + zz);
        te[3] = xy - wz;
        te[6] = xz + wy;
        te[1] = xy + wz;
        te[4] = 1 - (xx + zz);
        te[7] = yz - wx;
        te[2] = xz - wy;
        te[5] = yz + wx;
        te[8] = 1 - (xx + yy);
        return this;
    };
    /**
	 * @method rotateAxis
	 * @memberof Mat3
	 * @brief sets rotation axis
	 * @param Vec3 v
	 * @return Mat3
	 */
    Mat3.prototype.rotateAxis = function(v) {
        var te = this.elements, vx = v.x, vy = v.y, vz = v.z;
        v.x = vx * te[0] + vy * te[3] + vz * te[6];
        v.y = vx * te[1] + vy * te[4] + vz * te[7];
        v.z = vx * te[2] + vy * te[5] + vz * te[8];
        v.norm();
        return v;
    };
    /**
	 * @method scale
	 * @memberof Mat3
	 * @brief scales matrix by vector
	 * @param Vec3 v
	 * @return Mat3
	 */
    Mat3.prototype.scale = function(v) {
        var te = this.elements, x = v.x, y = v.y, z = v.z;
        te[0] *= x;
        te[3] *= y;
        te[6] *= z;
        te[1] *= x;
        te[4] *= y;
        te[7] *= z;
        te[2] *= x;
        te[5] *= y;
        te[8] *= z;
        return this;
    };
    /**
	 * @method toString
	 * @memberof Mat3
	 * @brief returns string value of this "Mat3[ 1, 0.... ]"
	 * @return String
	 */
    Mat3.prototype.toString = function() {
        var te = this.elements;
        return "Mat3[" + te[0] + ", " + te[3] + ", " + te[6] + "]\n" + "     [" + te[1] + ", " + te[4] + ", " + te[7] + "]\n" + "     [" + te[2] + ", " + te[5] + ", " + te[8] + "]";
    };
    /**
	 * @method equals
	 * @memberof Mat3
	 * @brief checks if this matrix equals other matrix
	 * @param Mat3 other
	 * @return Boolean
	 */
    Mat3.prototype.equals = function(other) {
        var ae = this.elements, be = other.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]) && equals(ae[6], be[6]) && equals(ae[7], be[7]) && equals(ae[8], be[8]));
    };
    /**
	 * @method Mat3.equals
	 * @memberof Mat3
	 * @brief checks if a matrix equals b matrix
	 * @param Mat3 a
	 * @param Mat3 b
	 * @return Boolean
	 */
    Mat3.equals = function(a, b) {
        var ae = a.elements, be = b.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]) && equals(ae[6], be[6]) && equals(ae[7], be[7]) && equals(ae[8], be[8]));
    };
    return Mat3;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mat32", [ "math/mathf", "math/vec2" ], function(Mathf) {
    /**
	 * @class Mat32
	 * @brief 2D Affine Matrix
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 */
    function Mat32(m11, m12, m13, m21, m22, m23) {
        /**
	    * @property Float32Array elements
	    * @memberof Mat32
	    */
        this.elements = new Float32Array(6);
        m11 && m11.elements ? this.copy(m11) : this.set(m11 || 1, m12 || 0, m13 || 0, m21 || 0, m22 || 1, m23 || 0);
    }
    var abs = Math.abs, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Mat32
	 * @brief returns new copy of this
	 * @return Mat32
	 */
    Mat32.prototype.clone = function() {
        var te = this.elements;
        return new Mat32(te[0], te[2], te[4], te[1], te[3], te[5]);
    };
    /**
	 * @method copy
	 * @memberof Mat32
	 * @brief copies other matrix
	 * @return Mat32
	 */
    Mat32.prototype.copy = function(other) {
        var te = this.elements, me = other.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        return this;
    };
    /**
	 * @method set
	 * @memberof Mat32
	 * @brief sets matrix elements
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @return Mat32
	 */
    Mat32.prototype.set = function(m11, m12, m13, m21, m22, m23) {
        var te = this.elements;
        te[0] = m11;
        te[2] = m12;
        te[4] = m13;
        te[1] = m21;
        te[3] = m22;
        te[5] = m23;
        return this;
    };
    /**
	 * @method identity
	 * @memberof Mat32
	 * @brief sets matrix to identity matrix
	 * @return Mat32
	 */
    Mat32.prototype.identity = function() {
        var te = this.elements;
        te[0] = 1;
        te[1] = 0;
        te[2] = 0;
        te[3] = 1;
        te[4] = 0;
        te[5] = 0;
        return this;
    };
    /**
	 * @method zero
	 * @memberof Mat32
	 * @brief sets matrix to zero matrix
	 * @return Mat32
	 */
    Mat32.prototype.zero = function() {
        var te = this.elements;
        te[0] = 0;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = 0;
        return this;
    };
    /**
	 * @method mmul
	 * @memberof Mat32
	 * @brief mutilples a and b
	 * @param Mat32 a
	 * @param Mat32 b
	 * @return Mat32
	 */
    Mat32.prototype.mmul = function(a, b) {
        var te = this.elements, ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[2], a13 = ae[4], a21 = ae[1], a22 = ae[3], a23 = ae[5], b11 = be[0], b12 = be[2], b13 = be[4], b21 = be[1], b22 = be[3], b23 = be[5];
        te[0] = a11 * b11 + a12 * b21;
        te[2] = a11 * b12 + a12 * b22;
        te[1] = a21 * b11 + a22 * b21;
        te[3] = a21 * b12 + a22 * b22;
        te[4] = a13 * b11 + a23 * b21 + b13;
        te[5] = a13 * b12 + a23 * b22 + b23;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Mat32
	 * @brief mutilples this and other
	 * @param Mat32 other
	 * @return Mat32
	 */
    Mat32.prototype.mul = function(other) {
        var ae = this.elements, be = other.elements, a11 = ae[0], a12 = ae[2], a13 = ae[4], a21 = ae[1], a22 = ae[3], a23 = ae[5], b11 = be[0], b12 = be[2], b13 = be[4], b21 = be[1], b22 = be[3], b23 = be[5];
        ae[0] = a11 * b11 + a12 * b21;
        ae[2] = a11 * b12 + a12 * b22;
        ae[1] = a21 * b11 + a22 * b21;
        ae[3] = a21 * b12 + a22 * b22;
        ae[4] = a13 * b11 + a23 * b21 + b13;
        ae[5] = a13 * b12 + a23 * b22 + b23;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Mat32
	 * @brief mutilples this by scalar
	 * @param Number s
	 * @return Mat32
	 */
    Mat32.prototype.smul = function(s) {
        var te = this.elements;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Mat32
	 * @brief divides this by scalar
	 * @param Number s
	 * @return Mat32
	 */
    Mat32.prototype.sdiv = function(s) {
        var te = this.elements;
        s = 0 !== s ? 1 / s : 1;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        return this;
    };
    /**
	 * @method transpose
	 * @memberof Mat32
	 * @brief transposes this matrix
	 * @return Mat32
	 */
    Mat32.prototype.transpose = function() {
        var tmp, te = this.elements;
        tmp = te[1];
        te[1] = te[2];
        te[2] = tmp;
        return this;
    };
    /**
	 * @method setTrace
	 * @memberof Mat32
	 * @brief sets the diagonal of matrix
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.setTrace = function(v) {
        var te = this.elements;
        te[0] = v.x;
        te[3] = v.y;
        return this;
    };
    /**
	 * @method minv
	 * @memberof Mat32
	 * @brief gets the inverse of another matrix saves it in this
	 * @param Mat32 other
	 * @return Mat32
	 */
    Mat32.prototype.minv = function(other) {
        var te = this.elements, me = other.elements, m11 = me[0], m12 = me[2], m13 = me[4], m21 = me[1], m22 = me[3], m23 = me[5], det = m11 * m22 - m12 * m21;
        det = 0 !== det ? 1 / det : 0;
        te[0] = m22;
        te[1] = -m12;
        te[2] = -m21;
        te[3] = m11;
        te[4] = m12 * m23 - m22 * m13;
        te[5] = m21 * m13 - m11 * m23;
        this.smul(det);
        return this;
    };
    /**
	 * @method inv
	 * @memberof Mat32
	 * @brief gets the inverse of this matrix
	 * @return Mat32
	 */
    Mat32.prototype.inv = function() {
        var te = this.elements, m11 = te[0], m12 = te[2], m13 = te[4], m21 = te[1], m22 = te[3], m23 = te[5], det = m11 * m22 - m12 * m21;
        det = 0 !== det ? 1 / det : 0;
        te[0] = m22;
        te[1] = -m12;
        te[2] = -m21;
        te[3] = m11;
        te[4] = m12 * m23 - m22 * m13;
        te[5] = m21 * m13 - m11 * m23;
        this.smul(det);
        return this;
    };
    /**
	 * @method mlerp
	 * @memberof Mat32
	 * @brief linear interpolation between a matrix and b matrix by t
	 * @param Mat32 a
	 * @param Mat32 b
	 * @param Number t
	 * @return Mat32
	 */
    Mat32.prototype.mlerp = function(a, b, t) {
        var te = this.elements, ae = a.elements, be = b.elements;
        te[0] = lerp(ae[0], be[0], t);
        te[1] = lerp(ae[1], be[1], t);
        te[2] = lerp(ae[2], be[2], t);
        te[3] = lerp(ae[3], be[3], t);
        te[4] = lerp(ae[4], be[4], t);
        te[5] = lerp(ae[5], be[5], t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Mat32
	 * @brief linear interpolation between this and other matrix by t
	 * @param Mat32 other
	 * @param Number t
	 * @return Mat32
	 */
    Mat32.prototype.lerp = function(other, t) {
        var ae = this.elements, be = other.elements;
        ae[0] = lerp(ae[0], be[0], t);
        ae[1] = lerp(ae[1], be[1], t);
        ae[2] = lerp(ae[2], be[2], t);
        ae[3] = lerp(ae[3], be[3], t);
        ae[4] = lerp(ae[4], be[4], t);
        ae[5] = lerp(ae[5], be[5], t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Mat32
	 * @brief gets absolute values of matrix
	 * @return Mat32
	 */
    Mat32.prototype.abs = function() {
        var te = this.elements;
        te[0] = abs(te[0]);
        te[1] = abs(te[1]);
        te[2] = abs(te[2]);
        te[3] = abs(te[3]);
        te[4] = abs(te[4]);
        te[5] = abs(te[5]);
        return this;
    };
    /**
	 * @method setTranslation
	 * @memberof Mat32
	 * @brief sets translation of matrix
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.setTranslation = function(v) {
        var te = this.elements;
        te[4] = v.x;
        te[5] = v.y;
        return this;
    };
    /**
	 * @method setRotation
	 * @memberof Mat32
	 * @brief sets rotation of matrix
	 * @param Number a
	 * @return Mat32
	 */
    Mat32.prototype.setRotation = function(a) {
        var te = this.elements, c = cos(a), s = sin(a);
        te[0] = c;
        te[1] = s;
        te[2] = -s;
        te[3] = c;
        return this;
    };
    /**
	 * @method getTranslation
	 * @memberof Mat32
	 * @brief gets translation of matrix
	 * @param Vec2 v
	 * @return Vec2
	 */
    Mat32.prototype.getTranslation = function(v) {
        var te = this.elements;
        v.x = te[4];
        v.y = te[5];
        return v;
    };
    /**
	 * @method getRotation
	 * @memberof Mat32
	 * @brief returns the rotation of the matrix
	 * @return Number
	 */
    Mat32.prototype.getRotation = function() {
        var te = this.elements;
        return atan2(te[1], te[0]);
    };
    /**
	 * @method extractPosition
	 * @memberof Mat32
	 * @brief gets position from this matrix
	 * @param Mat32 m
	 * @return Mat32
	 */
    Mat32.prototype.extractPosition = function(m) {
        var te = this.elements, me = m.elements;
        te[4] = me[4];
        te[5] = me[5];
        return this;
    };
    /**
	 * @method extractRotation
	 * @memberof Mat32
	 * @brief gets rotation from this matrix
	 * @param Mat32 m
	 * @return Mat32
	 */
    Mat32.prototype.extractRotation = function(m) {
        var te = this.elements, me = m.elements, m11 = me[0], m12 = me[2], m21 = me[1], m22 = me[3], x = m11 * m11 + m21 * m21, y = m12 * m12 + m22 * m22, sx = 0 !== x ? 1 / sqrt(x) : 0, sy = 0 !== y ? 1 / sqrt(y) : 0;
        te[0] = m11 * sx;
        te[1] = m21 * sx;
        te[2] = m12 * sy;
        te[3] = m22 * sy;
        return this;
    };
    /**
	 * @method lookAt
	 * @memberof Mat32
	 * @brief makes matrix look from eye at target
	 * @param Vec2 eye
	 * @param Vec2 target
	 * @return Mat32
	 */
    Mat32.prototype.lookAt = function(eye, target) {
        var te = this.elements, x = target.x - eye.x, y = target.y - eye.y, a = atan2(y, x) - HALF_PI, c = cos(a), s = sin(a);
        te[0] = c;
        te[1] = s;
        te[2] = -s;
        te[3] = c;
        return this;
    };
    /**
	 * @method translate
	 * @memberof Mat32
	 * @brief translates matrix by vector
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.translate = function(v) {
        var te = this.elements, x = v.x, y = v.y;
        te[4] = te[0] * x + te[2] * y + te[4];
        te[5] = te[1] * x + te[3] * y + te[5];
        return this;
    };
    /**
	 * @method scale
	 * @memberof Mat32
	 * @brief scales matrix by vector
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.scale = function(v) {
        var te = this.elements, x = v.x, y = v.y;
        te[0] *= x;
        te[1] *= x;
        te[4] *= x;
        te[2] *= y;
        te[3] *= y;
        te[5] *= y;
        return this;
    };
    /**
	 * @method rotate
	 * @memberof Mat32
	 * @brief rotates matrix by angle
	 * @param Number angle
	 * @return Mat32
	 */
    Mat32.prototype.rotate = function(angle) {
        var te = this.elements, m11 = te[0], m12 = te[2], m13 = te[4], m21 = te[1], m22 = te[3], m23 = te[5], s = sin(angle), c = sin(angle);
        te[0] = m11 * c - m12 * s;
        te[1] = m11 * s + m12 * c;
        te[2] = m21 * c - m22 * s;
        te[3] = m21 * s + m22 * c;
        te[4] = m13 * c - m23 * s;
        te[5] = m13 * s + m23 * c;
        return this;
    };
    /**
	 * @method skew
	 * @memberof Mat32
	 * @brief skews matrix by vector
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.skew = function(v) {
        var te = this.elements, x = v.x, y = v.y;
        te[1] += x;
        te[2] += y;
        return this;
    };
    /**
	 * @method orthographic
	 * @memberof Mat32
	 * @brief makes orthographic matrix
	 * @param Number left
	 * @param Number right
	 * @param Number top
	 * @param Number bottom
	 * @return Mat32
	 */
    Mat32.prototype.orthographic = function(left, right, top, bottom) {
        var te = this.elements, w = 1 / (right - left), h = 1 / (top - bottom), x = -(right + left) * w, y = -(top + bottom) * h;
        te[0] = 2 * w;
        te[1] = 0;
        te[2] = 0;
        te[3] = 2 * -h;
        te[4] = x;
        te[5] = y;
        return this;
    };
    /**
	 * @method toString
	 * @memberof Mat32
	 * @brief returns string value of this "Mat32[ 1, 0... ]"
	 * @return Mat32
	 */
    Mat32.prototype.toString = function() {
        var te = this.elements;
        return "Mat32[ " + te[0] + ", " + te[2] + ", " + te[4] + "]\n" + "     [ " + te[1] + ", " + te[3] + ", " + te[5] + "]";
    };
    /**
	 * @method equals
	 * @memberof Mat32
	 * @brief checks if this matrix equals other matrix
	 * @param Mat32 other
	 * @return Boolean
	 */
    Mat32.prototype.equals = function(other) {
        var ae = this.elements, be = other.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]));
    };
    /**
	 * @method Mat32.equals
	 * @memberof Mat32
	 * @brief checks if a matrix equals b matrix
	 * @param Mat32 a
	 * @param Mat32 b
	 * @return Boolean
	 */
    Mat32.equals = function(a, b) {
        var ae = a.elements, be = b.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]));
    };
    return Mat32;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mat4", [ "math/mathf", "math/vec3" ], function(Mathf, Vec3) {
    /**
	 * @class Mat4
	 * @brief Matrix for 3D rotations and transformations
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m14
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @param Number m24
	 * @param Number m31
	 * @param Number m32
	 * @param Number m33
	 * @param Number m34
	 * @param Number m41
	 * @param Number m42
	 * @param Number m43
	 * @param Number m44
	 */
    function Mat4(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        /**
	    * @property Float32Array elements
	    * @memberof Mat4
	    */
        this.elements = new Float32Array(16);
        m11 && m11.elements ? this.copy(m11) : this.set(m11 || 1, m12 || 0, m13 || 0, m14 || 0, m21 || 0, m22 || 1, m23 || 0, m24 || 0, m31 || 0, m32 || 0, m33 || 1, m34 || 0, m41 || 0, m42 || 0, m43 || 0, m44 || 1);
    }
    var abs = Math.abs, sin = Math.sin, cos = Math.cos, tan = Math.tan, lerp = Mathf.lerp, equals = Mathf.equals, degsToRads = Mathf.degsToRads;
    /**
	 * @method clone
	 * @memberof Mat4
	 * @brief returns new copy of this
	 * @return Mat4
	 */
    Mat4.prototype.clone = function() {
        var te = this.elements;
        return new Mat4(te[0], te[4], te[8], te[12], te[1], te[5], te[9], te[13], te[2], te[6], te[10], te[14], te[3], te[7], te[11], te[15]);
    };
    /**
	 * @method copy
	 * @memberof Mat4
	 * @brief copies other matrix
	 * @return Mat4
	 */
    Mat4.prototype.copy = function(other) {
        var te = this.elements, me = other.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        te[9] = me[9];
        te[10] = me[10];
        te[11] = me[11];
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        te[15] = me[15];
        return this;
    };
    /**
	 * @method set
	 * @memberof Mat4
	 * @brief sets matrix elements
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m14
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @param Number m24
	 * @param Number m31
	 * @param Number m32
	 * @param Number m33
	 * @param Number m34
	 * @param Number m41
	 * @param Number m42
	 * @param Number m43
	 * @param Number m44
	 * @return Mat4
	 */
    Mat4.prototype.set = function(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        var te = this.elements;
        te[0] = m11;
        te[4] = m12;
        te[8] = m13;
        te[12] = m14;
        te[1] = m21;
        te[5] = m22;
        te[9] = m23;
        te[13] = m24;
        te[2] = m31;
        te[6] = m32;
        te[10] = m33;
        te[14] = m34;
        te[3] = m41;
        te[7] = m42;
        te[11] = m43;
        te[15] = m44;
        return this;
    };
    /**
	 * @method fromMat32
	 * @memberof Mat4
	 * @brief sets matrix from Mat32, assumed that Mat4 is an identity matrix
	 * @param Mat32 m
	 * @return Mat4
	 */
    Mat4.prototype.fromMat32 = function(m) {
        var te = this.elements, me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[4] = me[2];
        te[5] = me[3];
        te[12] = me[4];
        te[13] = me[5];
        return this;
    };
    /**
	 * @method identity
	 * @memberof Mat4
	 * @brief sets matrix to identity matrix
	 * @return Mat4
	 */
    Mat4.prototype.identity = function() {
        var te = this.elements;
        te[0] = 1;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = 1;
        te[6] = 0;
        te[7] = 0;
        te[8] = 0;
        te[9] = 0;
        te[10] = 1;
        te[11] = 0;
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
    };
    /**
	 * @method zero
	 * @memberof Mat4
	 * @brief sets matrix to zero matrix
	 * @return Mat4
	 */
    Mat4.prototype.zero = function() {
        var te = this.elements;
        te[0] = 0;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = 0;
        te[6] = 0;
        te[7] = 0;
        te[8] = 0;
        te[9] = 0;
        te[10] = 0;
        te[11] = 0;
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 0;
        return this;
    };
    /**
	 * @method mmul
	 * @memberof Mat4
	 * @brief mutilples a and b
	 * @param Mat4 a
	 * @param Mat4 b
	 * @return Mat4
	 */
    Mat4.prototype.mmul = function(a, b) {
        var te = this.elements, ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12], a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13], a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14], a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15], b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12], b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13], b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14], b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Mat4
	 * @brief mutilples this and other
	 * @param Mat4 other
	 * @return Mat4
	 */
    Mat4.prototype.mul = function() {
        var ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12], a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13], a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14], a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15], b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12], b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13], b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14], b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
        ae[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        ae[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        ae[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        ae[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        ae[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        ae[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        ae[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        ae[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        ae[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        ae[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        ae[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        ae[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        ae[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        ae[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        ae[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        ae[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Mat4
	 * @brief mutilples this by scalar
	 * @param Number s
	 * @return Mat4
	 */
    Mat4.prototype.smul = function(s) {
        var te = this.elements;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        te[6] *= s;
        te[7] *= s;
        te[8] *= s;
        te[9] *= s;
        te[10] *= s;
        te[11] *= s;
        te[12] *= s;
        te[13] *= s;
        te[14] *= s;
        te[15] *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Mat4
	 * @brief divides this by scalar
	 * @param Number s
	 * @return Mat4
	 */
    Mat4.prototype.sdiv = function(s) {
        var te = this.elements;
        s = 0 !== s ? 1 / s : 1;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        te[6] *= s;
        te[7] *= s;
        te[8] *= s;
        te[9] *= s;
        te[10] *= s;
        te[11] *= s;
        te[12] *= s;
        te[13] *= s;
        te[14] *= s;
        te[15] *= s;
        return this;
    };
    /**
	 * @method transpose
	 * @memberof Mat4
	 * @brief transposes this matrix
	 * @return Mat4
	 */
    Mat4.prototype.transpose = function() {
        var tmp, te = this.elements;
        tmp = te[1];
        te[1] = te[4];
        te[4] = tmp;
        tmp = te[2];
        te[2] = te[8];
        te[8] = tmp;
        tmp = te[6];
        te[6] = te[9];
        te[9] = tmp;
        tmp = te[3];
        te[3] = te[12];
        te[12] = tmp;
        tmp = te[7];
        te[7] = te[13];
        te[13] = tmp;
        tmp = te[11];
        te[11] = te[14];
        te[14] = tmp;
        return this;
    };
    /**
	 * @method setTrace
	 * @memberof Mat4
	 * @brief sets the diagonal of matrix
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.setTrace = function(v) {
        var te = this.elements;
        te[0] = v.x;
        te[5] = v.y;
        te[10] = v.z || 1;
        te[15] = v.w || 1;
        return this;
    };
    /**
	 * @method minv
	 * @memberof Mat4
	 * @brief gets the inverse of another matrix saves it in this
	 * @param Mat4 other
	 * @return Mat4
	 */
    Mat4.prototype.minv = function(m) {
        var te = this.elements, me = m.elements, m11 = me[0], m12 = me[4], m13 = me[8], m14 = me[12], m21 = me[1], m22 = me[5], m23 = me[9], m24 = me[13], m31 = me[2], m32 = me[6], m33 = me[10], m34 = me[14], m41 = me[3], m42 = me[7], m43 = me[11], m44 = me[15];
        te[0] = m23 * m34 * m42 - m24 * m33 * m42 + m24 * m32 * m43 - m22 * m34 * m43 - m23 * m32 * m44 + m22 * m33 * m44;
        te[1] = m24 * m33 * m41 - m23 * m34 * m41 - m24 * m31 * m43 + m21 * m34 * m43 + m23 * m31 * m44 - m21 * m33 * m44;
        te[2] = m22 * m34 * m41 - m24 * m32 * m41 + m24 * m31 * m42 - m21 * m34 * m42 - m22 * m31 * m44 + m21 * m32 * m44;
        te[3] = m23 * m32 * m41 - m22 * m33 * m41 - m23 * m31 * m42 + m21 * m33 * m42 + m22 * m31 * m43 - m21 * m32 * m43;
        te[4] = m14 * m33 * m42 - m13 * m34 * m42 - m14 * m32 * m43 + m12 * m34 * m43 + m13 * m32 * m44 - m12 * m33 * m44;
        te[5] = m13 * m34 * m41 - m14 * m33 * m41 + m14 * m31 * m43 - m11 * m34 * m43 - m13 * m31 * m44 + m11 * m33 * m44;
        te[6] = m14 * m32 * m41 - m12 * m34 * m41 - m14 * m31 * m42 + m11 * m34 * m42 + m12 * m31 * m44 - m11 * m32 * m44;
        te[7] = m12 * m33 * m41 - m13 * m32 * m41 + m13 * m31 * m42 - m11 * m33 * m42 - m12 * m31 * m43 + m11 * m32 * m43;
        te[8] = m13 * m24 * m42 - m14 * m23 * m42 + m14 * m22 * m43 - m12 * m24 * m43 - m13 * m22 * m44 + m12 * m23 * m44;
        te[9] = m14 * m23 * m41 - m13 * m24 * m41 - m14 * m21 * m43 + m11 * m24 * m43 + m13 * m21 * m44 - m11 * m23 * m44;
        te[10] = m12 * m24 * m41 - m14 * m22 * m41 + m14 * m21 * m42 - m11 * m24 * m42 - m12 * m21 * m44 + m11 * m22 * m44;
        te[11] = m13 * m22 * m41 - m12 * m23 * m41 - m13 * m21 * m42 + m11 * m23 * m42 + m12 * m21 * m43 - m11 * m22 * m43;
        te[12] = m14 * m23 * m32 - m13 * m24 * m32 - m14 * m22 * m33 + m12 * m24 * m33 + m13 * m22 * m34 - m12 * m23 * m34;
        te[13] = m13 * m24 * m31 - m14 * m23 * m31 + m14 * m21 * m33 - m11 * m24 * m33 - m13 * m21 * m34 + m11 * m23 * m34;
        te[14] = m14 * m22 * m31 - m12 * m24 * m31 - m14 * m21 * m32 + m11 * m24 * m32 + m12 * m21 * m34 - m11 * m22 * m34;
        te[15] = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33;
        this.sdiv(m11 * te[0] + m21 * te[4] + m31 * te[8] + m41 * te[12]);
        return this;
    };
    /**
	 * @method inv
	 * @memberof Mat4
	 * @brief gets the inverse of this matrix
	 * @return Mat4
	 */
    Mat4.prototype.inv = function() {
        var te = this.elements, m11 = te[0], m12 = te[4], m13 = te[8], m14 = te[12], m21 = te[1], m22 = te[5], m23 = te[9], m24 = te[13], m31 = te[2], m32 = te[6], m33 = te[10], m34 = te[14], m41 = te[3], m42 = te[7], m43 = te[11], m44 = te[15];
        te[0] = m23 * m34 * m42 - m24 * m33 * m42 + m24 * m32 * m43 - m22 * m34 * m43 - m23 * m32 * m44 + m22 * m33 * m44;
        te[1] = m24 * m33 * m41 - m23 * m34 * m41 - m24 * m31 * m43 + m21 * m34 * m43 + m23 * m31 * m44 - m21 * m33 * m44;
        te[2] = m22 * m34 * m41 - m24 * m32 * m41 + m24 * m31 * m42 - m21 * m34 * m42 - m22 * m31 * m44 + m21 * m32 * m44;
        te[3] = m23 * m32 * m41 - m22 * m33 * m41 - m23 * m31 * m42 + m21 * m33 * m42 + m22 * m31 * m43 - m21 * m32 * m43;
        te[4] = m14 * m33 * m42 - m13 * m34 * m42 - m14 * m32 * m43 + m12 * m34 * m43 + m13 * m32 * m44 - m12 * m33 * m44;
        te[5] = m13 * m34 * m41 - m14 * m33 * m41 + m14 * m31 * m43 - m11 * m34 * m43 - m13 * m31 * m44 + m11 * m33 * m44;
        te[6] = m14 * m32 * m41 - m12 * m34 * m41 - m14 * m31 * m42 + m11 * m34 * m42 + m12 * m31 * m44 - m11 * m32 * m44;
        te[7] = m12 * m33 * m41 - m13 * m32 * m41 + m13 * m31 * m42 - m11 * m33 * m42 - m12 * m31 * m43 + m11 * m32 * m43;
        te[8] = m13 * m24 * m42 - m14 * m23 * m42 + m14 * m22 * m43 - m12 * m24 * m43 - m13 * m22 * m44 + m12 * m23 * m44;
        te[9] = m14 * m23 * m41 - m13 * m24 * m41 - m14 * m21 * m43 + m11 * m24 * m43 + m13 * m21 * m44 - m11 * m23 * m44;
        te[10] = m12 * m24 * m41 - m14 * m22 * m41 + m14 * m21 * m42 - m11 * m24 * m42 - m12 * m21 * m44 + m11 * m22 * m44;
        te[11] = m13 * m22 * m41 - m12 * m23 * m41 - m13 * m21 * m42 + m11 * m23 * m42 + m12 * m21 * m43 - m11 * m22 * m43;
        te[12] = m14 * m23 * m32 - m13 * m24 * m32 - m14 * m22 * m33 + m12 * m24 * m33 + m13 * m22 * m34 - m12 * m23 * m34;
        te[13] = m13 * m24 * m31 - m14 * m23 * m31 + m14 * m21 * m33 - m11 * m24 * m33 - m13 * m21 * m34 + m11 * m23 * m34;
        te[14] = m14 * m22 * m31 - m12 * m24 * m31 - m14 * m21 * m32 + m11 * m24 * m32 + m12 * m21 * m34 - m11 * m22 * m34;
        te[15] = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33;
        this.sdiv(m11 * te[0] + m21 * te[4] + m31 * te[8] + m41 * te[12]);
        return this;
    };
    /**
	 * @method mlerp
	 * @memberof Mat4
	 * @brief linear interpolation between a matrix and b matrix by t
	 * @param Mat4 a
	 * @param Mat4 b
	 * @param Number t
	 * @return Mat4
	 */
    Mat4.prototype.mlerp = function(a, b, t) {
        var te = this.elements, ae = a.elements, be = b.elements;
        te[0] = lerp(ae[0], be[0], t);
        te[1] = lerp(ae[1], be[1], t);
        te[2] = lerp(ae[2], be[2], t);
        te[3] = lerp(ae[3], be[3], t);
        te[4] = lerp(ae[4], be[4], t);
        te[5] = lerp(ae[5], be[5], t);
        te[6] = lerp(ae[6], be[6], t);
        te[7] = lerp(ae[7], be[7], t);
        te[8] = lerp(ae[8], be[8], t);
        te[9] = lerp(ae[9], be[9], t);
        te[10] = lerp(ae[10], be[10], t);
        te[11] = lerp(ae[11], be[11], t);
        te[12] = lerp(ae[12], be[12], t);
        te[13] = lerp(ae[13], be[13], t);
        te[14] = lerp(ae[14], be[14], t);
        te[15] = lerp(ae[15], be[15], t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Mat4
	 * @brief linear interpolation between this and other matrix by t
	 * @param Mat4 other
	 * @param Number t
	 * @return Mat4
	 */
    Mat4.prototype.lerp = function(other, t) {
        var ae = this.elements, be = other.elements;
        ae[0] = lerp(ae[0], be[0], t);
        ae[1] = lerp(ae[1], be[1], t);
        ae[2] = lerp(ae[2], be[2], t);
        ae[3] = lerp(ae[3], be[3], t);
        ae[4] = lerp(ae[4], be[4], t);
        ae[5] = lerp(ae[5], be[5], t);
        ae[6] = lerp(ae[6], be[6], t);
        ae[7] = lerp(ae[7], be[7], t);
        ae[8] = lerp(ae[8], be[8], t);
        ae[9] = lerp(ae[9], be[9], t);
        ae[10] = lerp(ae[10], be[10], t);
        ae[11] = lerp(ae[11], be[11], t);
        ae[12] = lerp(ae[12], be[12], t);
        ae[13] = lerp(ae[13], be[13], t);
        ae[14] = lerp(ae[14], be[14], t);
        ae[15] = lerp(ae[15], be[15], t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Mat4
	 * @brief gets absolute values of matrix
	 * @return Mat4
	 */
    Mat4.prototype.abs = function() {
        var te = this.elements;
        te[0] = abs(te[0]);
        te[1] = abs(te[1]);
        te[2] = abs(te[2]);
        te[3] = abs(te[3]);
        te[4] = abs(te[4]);
        te[5] = abs(te[5]);
        te[6] = abs(te[6]);
        te[7] = abs(te[7]);
        te[8] = abs(te[8]);
        te[9] = abs(te[9]);
        te[10] = abs(te[10]);
        te[11] = abs(te[11]);
        te[12] = abs(te[12]);
        te[13] = abs(te[13]);
        te[14] = abs(te[14]);
        te[15] = abs(te[15]);
        return this;
    };
    /**
	 * @method setRotationQuat
	 * @memberof Mat4
	 * @brief sets rotation of matrix from quaterian
	 * @param Quat q
	 * @return Mat4
	 */
    Mat4.prototype.setRotationQuat = function(q) {
        var te = this.elements, x = q.x, y = q.y, z = q.z, w = q.w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
        te[0] = 1 - (yy + zz);
        te[4] = xy - wz;
        te[8] = xz + wy;
        te[1] = xy + wz;
        te[5] = 1 - (xx + zz);
        te[9] = yz - wx;
        te[2] = xz - wy;
        te[6] = yz + wx;
        te[10] = 1 - (xx + yy);
        return this;
    };
    /**
	 * @method setTranslation
	 * @memberof Mat4
	 * @brief sets translation of matrix
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.setTranslation = function(v) {
        var te = this.elements;
        te[12] = v.x;
        te[13] = v.y;
        te[14] = v.z || 0;
        return this;
    };
    /**
	 * @method lookAt
	 * @memberof Mat4
	 * @brief makes matrix look from eye at target along up vector
	 * @param Vec3 eye
	 * @param Vec3 target
	 * @param Vec3 up
	 * @return Mat4
	 */
    Mat4.prototype.lookAt = function() {
        var dup = new Vec3(0, 0, 1), x = new Vec3(), y = new Vec3(), z = new Vec3();
        return function(eye, target, up) {
            up = up instanceof Vec3 ? up : dup;
            var te = this.elements;
            z.vsub(eye, target).norm();
            0 === z.len() && (z.z = 1);
            x.vcross(up, z).norm();
            if (0 === x.len()) {
                z.x += 1e-4;
                x.vcross(up, z).norm();
            }
            y.vcross(z, x);
            te[0] = x.x;
            te[4] = y.x;
            te[8] = z.x;
            te[1] = x.y;
            te[5] = y.y;
            te[9] = z.y;
            te[2] = x.z;
            te[6] = y.z;
            te[10] = z.z;
            return this;
        };
    }();
    /**
	 * @method extractPosition
	 * @memberof Mat4
	 * @brief extract matrix position
	 * @param Mat4 m
	 * @return Mat4
	 */
    Mat4.prototype.extractPosition = function(m) {
        var te = this.elements, me = m.elements;
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        return this;
    };
    /**
	 * @method extractRotation
	 * @memberof Mat4
	 * @brief extract matrix rotation
	 * @param Mat4 m
	 * @return Mat4
	 */
    Mat4.prototype.extractRotation = function() {
        var vec = new Vec3();
        return function(m) {
            var te = this.elements, me = m.elements, scaleX = 1 / vec.set(me[0], me[1], me[2]).len(), scaleY = 1 / vec.set(me[4], me[5], me[6]).len(), scaleZ = 1 / vec.set(me[8], me[9], me[10]).len();
            te[0] = me[0] * scaleX;
            te[1] = me[1] * scaleX;
            te[2] = me[2] * scaleX;
            te[4] = me[4] * scaleY;
            te[5] = me[5] * scaleY;
            te[6] = me[6] * scaleY;
            te[8] = me[8] * scaleZ;
            te[9] = me[9] * scaleZ;
            te[10] = me[10] * scaleZ;
            return this;
        };
    }();
    /**
	 * @method translate
	 * @memberof Mat4
	 * @brief translates matrix by vector
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.translate = function(v) {
        var te = this.elements, x = v.x, y = v.y, z = v.z;
        te[12] = te[0] * x + te[4] * y + te[8] * z + te[12];
        te[13] = te[1] * x + te[5] * y + te[9] * z + te[13];
        te[14] = te[2] * x + te[6] * y + te[10] * z + te[14];
        te[15] = te[3] * x + te[7] * y + te[11] * z + te[15];
        return this;
    };
    /**
	 * @method rotateAxis
	 * @memberof Mat4
	 * @brief rotates matrix axis by vector
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.rotateAxis = function(v) {
        var te = this.elements, vx = v.x, vy = v.y, vz = v.z;
        v.x = vx * te[0] + vy * te[4] + vz * te[8];
        v.y = vx * te[1] + vy * te[5] + vz * te[9];
        v.z = vx * te[2] + vy * te[6] + vz * te[10];
        v.norm();
        return v;
    };
    /**
	 * @method rotateX
	 * @memberof Mat4
	 * @brief rotates matrix along x axis by angle
	 * @param Number angle
	 * @return Mat4
	 */
    Mat4.prototype.rotateX = function(angle) {
        var te = this.elements, m12 = te[4], m22 = te[5], m32 = te[6], m42 = te[7], m13 = te[8], m23 = te[9], m33 = te[10], m43 = te[11], c = cos(angle), s = sin(angle);
        te[4] = c * m12 + s * m13;
        te[5] = c * m22 + s * m23;
        te[6] = c * m32 + s * m33;
        te[7] = c * m42 + s * m43;
        te[8] = c * m13 - s * m12;
        te[9] = c * m23 - s * m22;
        te[10] = c * m33 - s * m32;
        te[11] = c * m43 - s * m42;
        return this;
    };
    /**
	 * @method rotateY
	 * @memberof Mat4
	 * @brief rotates matrix along y axis by angle
	 * @param Number angle
	 * @return Mat4
	 */
    Mat4.prototype.rotateY = function(angle) {
        var te = this.elements, m11 = te[0], m21 = te[1], m31 = te[2], m41 = te[3], m13 = te[8], m23 = te[9], m33 = te[10], m43 = te[11], c = cos(angle), s = sin(angle);
        te[0] = c * m11 - s * m13;
        te[1] = c * m21 - s * m23;
        te[2] = c * m31 - s * m33;
        te[3] = c * m41 - s * m43;
        te[8] = c * m13 + s * m11;
        te[9] = c * m23 + s * m21;
        te[10] = c * m33 + s * m31;
        te[11] = c * m43 + s * m41;
        return this;
    };
    /**
	 * @method rotateZ
	 * @memberof Mat4
	 * @brief rotates matrix along z axis by angle
	 * @param Number angle
	 * @return Mat4
	 */
    Mat4.prototype.rotateZ = function(angle) {
        var te = this.elements, m11 = te[0], m21 = te[1], m31 = te[2], m41 = te[3], m12 = te[4], m22 = te[5], m32 = te[6], m42 = te[7], c = cos(angle), s = sin(angle);
        te[0] = c * m11 + s * m12;
        te[1] = c * m21 + s * m22;
        te[2] = c * m31 + s * m32;
        te[3] = c * m41 + s * m42;
        te[4] = c * m12 - s * m11;
        te[5] = c * m22 - s * m21;
        te[6] = c * m32 - s * m31;
        te[7] = c * m42 - s * m41;
        return this;
    };
    /**
	 * @method scale
	 * @memberof Mat4
	 * @brief scales matrix by vector
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.scale = function(v) {
        var te = this.elements, x = v.x, y = v.y, z = v.z;
        te[0] *= x;
        te[4] *= y;
        te[8] *= z;
        te[1] *= x;
        te[5] *= y;
        te[9] *= z;
        te[2] *= x;
        te[6] *= y;
        te[10] *= z;
        te[3] *= x;
        te[7] *= y;
        te[11] *= z;
        return this;
    };
    /**
	 * @method frustum
	 * @memberof Mat4
	 * @brief makes frustum matrix
	 * @param Number left
	 * @param Number right
	 * @param Number top
	 * @param Number bottom
	 * @param Number near
	 * @param Number far
	 * @return Mat4
	 */
    Mat4.prototype.frustum = function(left, right, top, bottom, near, far) {
        var te = this.elements, x = 2 * near / (right - left), y = 2 * near / (top - bottom), a = (right + left) / (right - left), b = (top + bottom) / (top - bottom), c = -(far + near) / (far - near), d = -2 * far * near / (far - near);
        te[0] = x;
        te[4] = 0;
        te[8] = a;
        te[12] = 0;
        te[1] = 0;
        te[5] = y;
        te[9] = b;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = c;
        te[14] = d;
        te[3] = 0;
        te[7] = 0;
        te[11] = -1;
        te[15] = 0;
        return this;
    };
    /**
	 * @method perspective
	 * @memberof Mat4
	 * @brief makes perspective matrix
	 * @param Number fov
	 * @param Number aspect
	 * @param Number near
	 * @param Number far
	 * @return Mat4
	 */
    Mat4.prototype.perspective = function(fov, aspect, near, far) {
        var ymax = near * tan(degsToRads(.5 * fov)), ymin = -ymax, xmin = ymin * aspect, xmax = ymax * aspect;
        return this.frustum(xmin, xmax, ymax, ymin, near, far);
    };
    /**
	 * @method orthographic
	 * @memberof Mat4
	 * @brief makes orthographic matrix
	 * @param Number left
	 * @param Number right
	 * @param Number top
	 * @param Number bottom
	 * @param Number near
	 * @param Number far
	 * @return Mat4
	 */
    Mat4.prototype.orthographic = function(left, right, top, bottom, near, far) {
        var te = this.elements, w = 1 / (right - left), h = 1 / (top - bottom), p = 1 / (far - near), x = (right + left) * w, y = (top + bottom) * h, z = (far + near) * p;
        te[0] = 2 * w;
        te[4] = 0;
        te[8] = 0;
        te[12] = -x;
        te[1] = 0;
        te[5] = 2 * h;
        te[9] = 0;
        te[13] = -y;
        te[2] = 0;
        te[6] = 0;
        te[10] = -2 * p;
        te[14] = -z;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
    };
    /**
	 * @method toString
	 * @memberof Mat4
	 * @brief returns string value of this "Mat4[ 1, 0... ]"
	 * @return Mat4
	 */
    Mat4.prototype.toString = function() {
        var te = this.elements;
        return "Mat4[" + te[0] + ", " + te[4] + ", " + te[8] + ", " + te[12] + "]\n" + "     [" + te[1] + ", " + te[5] + ", " + te[9] + ", " + te[13] + "]\n" + "     [" + te[2] + ", " + te[6] + ", " + te[10] + ", " + te[14] + "]\n" + "     [" + te[3] + ", " + te[7] + ", " + te[11] + ", " + te[15] + "]";
    };
    /**
	 * @method equals
	 * @memberof Mat4
	 * @brief checks if this matrix equals other matrix
	 * @param Mat4 other
	 * @return Boolean
	 */
    Mat4.prototype.equals = function(other) {
        var ae = this.elements, be = other.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]) && equals(ae[6], be[6]) && equals(ae[7], be[7]) && equals(ae[8], be[8]) && equals(ae[9], be[9]) && equals(ae[10], be[10]) && equals(ae[11], be[11]) && equals(ae[12], be[12]) && equals(ae[13], be[13]) && equals(ae[14], be[14]) && equals(ae[15], be[15]));
    };
    /**
	 * @method Mat4.equals
	 * @memberof Mat4
	 * @brief checks if a matrix equals b matrix
	 * @param Mat4 a
	 * @param Mat4 b
	 * @return Boolean
	 */
    Mat4.equals = function(a, b) {
        var ae = a.elements, be = b.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]) && equals(ae[6], be[6]) && equals(ae[7], be[7]) && equals(ae[8], be[8]) && equals(ae[9], be[9]) && equals(ae[10], be[10]) && equals(ae[11], be[11]) && equals(ae[12], be[12]) && equals(ae[13], be[13]) && equals(ae[14], be[14]) && equals(ae[15], be[15]));
    };
    return Mat4;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/quat", [ "math/mathf", "math/vec3" ], function(Mathf, Vec3) {
    /**
	 * @class Quat
	 * @brief Quaterian for 3D rotations
	 * @param Number x
	 * @param Number y
	 * @param Number x
	 * @param Number w
	 */
    function Quat(x, y, z, w) {
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
        if (x && x.x) {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 1;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 1;
        }
    }
    var abs = Math.abs, sqrt = Math.sqrt, acos = Math.acos, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, clamp = Mathf.clamp, equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Quat
	 * @brief returns new copy of this
	 * @return Quat
	 */
    Quat.prototype.clone = function() {
        return new Quat(this.x, this.y, this.z, this.w);
    };
    /**
	 * @method copy
	 * @memberof Quat
	 * @brief copies other quaterian
	 * @return Quat
	 */
    Quat.prototype.copy = function(other) {
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
    Quat.prototype.set = function(x, y, z, w) {
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
    Quat.prototype.qmul = function(a, b) {
        var ax = a.x, ay = a.y, az = a.z, aw = a.w, bx = b.x, by = b.y, bz = b.z, bw = b.w;
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
    Quat.prototype.mul = function(other) {
        var ax = this.x, ay = this.y, az = this.z, aw = this.w, bx = other.x, by = other.y, bz = other.z, bw = other.w;
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
    Quat.prototype.smul = function(s) {
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
    Quat.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
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
    Quat.qdot = Quat.prototype.qdot = function(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    };
    /**
	 * @method dot
	 * @memberof Quat
	 * @brief returns dot product of this and other
	 * @param Quat other
	 * @return Quat
	 */
    Quat.prototype.dot = function(other) {
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
    Quat.prototype.qlerp = function(a, b, t) {
        this.x = lerp(a.x, b.x, t);
        this.y = lerp(a.y, b.y, t);
        this.z = lerp(a.z, b.z, t);
        this.w = lerp(a.w, b.w, t);
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
    Quat.prototype.lerp = function(other, t) {
        this.x = lerp(this.x, other.x, t);
        this.y = lerp(this.y, other.y, t);
        this.z = lerp(this.z, other.z, t);
        this.w = lerp(this.w, other.w, t);
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
    Quat.prototype.qslerp = function() {
        var start = new Quat(), end = new Quat(), quat = new Quat(), relative = new Quat();
        return function(a, b, t) {
            var dot = clamp(a.dot(b), -1, 1), theta = acos(dot) * t;
            start.copy(a);
            end.copy(b);
            quat.copy(start);
            relative.vsub(end, quat.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
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
    Quat.prototype.slerp = function() {
        var start = new Quat(), end = new Quat(), quat = new Quat(), relative = new Quat();
        return function(other, t) {
            var dot = clamp(this.dot(other), -1, 1), theta = acos(dot) * t;
            start.copy(this);
            end.copy(other);
            quat.copy(start);
            relative.vsub(end, quat.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method lenSq
	 * @memberof Quat
	 * @brief returns squared length
	 * @return Number
	 */
    Quat.prototype.lenSq = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        return x * x + y * y + z * z + w * w;
    };
    /**
	 * @method len
	 * @memberof Quat
	 * @brief returns length
	 * @return Number
	 */
    Quat.prototype.len = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        return sqrt(x * x + y * y + z * z + w * w);
    };
    /**
	 * @method norm
	 * @memberof Quat
	 * @brief normalizes quat
	 * @return Quat
	 */
    Quat.prototype.norm = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w, l = x * x + y * y + z * z + w * w;
        l = 0 !== l ? 1 / sqrt(l) : 0;
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
    Quat.prototype.qinv = function(other) {
        var x = other.x, y = other.y, z = other.z, w = other.w, l = x * x + y * y + z * z + w * w;
        l = 0 !== l ? 1 / sqrt(l) : 0;
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
    Quat.prototype.inv = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w, l = x * x + y * y + z * z + w * w;
        l = 0 !== l ? 1 / sqrt(l) : 0;
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
    Quat.prototype.conjugate = function() {
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
    Quat.prototype.calculateW = function() {
        var x = this.x, y = this.y, z = this.z;
        this.w = -sqrt(abs(1 - x * x - y * y - z * z));
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
    Quat.prototype.axisAngle = function(axis, angle) {
        var halfAngle = .5 * angle, s = sin(halfAngle);
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = cos(halfAngle);
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
    Quat.prototype.setVec3s = function() {
        var a = new Vec3();
        return function(u, v) {
            a.vcross(u, v);
            this.x = a.x;
            this.y = a.y;
            this.z = a.z;
            this.w = sqrt(u.lenSq() * v.lenSq()) + u.dot(v);
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
    Quat.prototype.setRotationMat3 = function(m) {
        var s, te = m.elements, m11 = te[0], m12 = te[3], m13 = te[6], m21 = te[1], m22 = te[4], m23 = te[7], m31 = te[2], m32 = te[5], m33 = te[8], trace = m11 + m22 + m33;
        if (trace > 0) {
            s = .5 / sqrt(trace + 1);
            this.w = .25 / s;
            this.x = (m32 - m23) * s;
            this.y = (m13 - m31) * s;
            this.z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            s = 2 * sqrt(1 + m11 - m22 - m33);
            this.w = (m32 - m23) / s;
            this.x = .25 * s;
            this.y = (m12 + m21) / s;
            this.z = (m13 + m31) / s;
        } else if (m22 > m33) {
            s = 2 * sqrt(1 + m22 - m11 - m33);
            this.w = (m13 - m31) / s;
            this.x = (m12 + m21) / s;
            this.y = .25 * s;
            this.z = (m23 + m32) / s;
        } else {
            s = 2 * sqrt(1 + m33 - m11 - m22);
            this.w = (m21 - m12) / s;
            this.x = (m13 + m31) / s;
            this.y = (m23 + m32) / s;
            this.z = .25 * s;
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
    Quat.prototype.setRotationMat4 = function(m) {
        var s, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33;
        if (trace > 0) {
            s = .5 / sqrt(trace + 1);
            this.w = .25 / s;
            this.x = (m32 - m23) * s;
            this.y = (m13 - m31) * s;
            this.z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            s = 2 * sqrt(1 + m11 - m22 - m33);
            this.w = (m32 - m23) / s;
            this.x = .25 * s;
            this.y = (m12 + m21) / s;
            this.z = (m13 + m31) / s;
        } else if (m22 > m33) {
            s = 2 * sqrt(1 + m22 - m11 - m33);
            this.w = (m13 - m31) / s;
            this.x = (m12 + m21) / s;
            this.y = .25 * s;
            this.z = (m23 + m32) / s;
        } else {
            s = 2 * sqrt(1 + m33 - m11 - m22);
            this.w = (m21 - m12) / s;
            this.x = (m13 + m31) / s;
            this.y = (m23 + m32) / s;
            this.z = .25 * s;
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
    Quat.prototype.rotateX = function(angle) {
        var halfAngle = .5 * angle, x = this.x, y = this.y, z = this.z, w = this.w, s = sin(halfAngle), c = cos(halfAngle);
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
    Quat.prototype.rotateY = function(angle) {
        var halfAngle = .5 * angle, x = this.x, y = this.y, z = this.z, w = this.w, s = sin(halfAngle), c = cos(halfAngle);
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
    Quat.prototype.rotateZ = function(angle) {
        var halfAngle = .5 * angle, x = this.x, y = this.y, z = this.z, w = this.w, s = sin(halfAngle), c = cos(halfAngle);
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
    Quat.prototype.rotate = function(x, y, z) {
        this.rotateZ(z);
        this.rotateX(x);
        this.rotateY(y);
        return this;
    };
    /**
	 * @method toString
	 * @memberof Quat
	 * @brief returns string value of this "Quat( 0, 0, 0, 1 )"
	 * @return Quat
	 */
    Quat.prototype.toString = function() {
        return "Quat( " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " )";
    };
    /**
	 * @method equals
	 * @memberof Quat
	 * @brief checks if this quat equals other quat
	 * @param Quat other
	 * @return Boolean
	 */
    Quat.prototype.equals = function(other) {
        return !!(equals(this.x, other.x) && equals(this.y, other.y) && equals(this.z, other.z) && equals(this.w, other.w));
    };
    /**
	 * @method Quat.equals
	 * @memberof Quat
	 * @brief checks if a quat equals b quat
	 * @param Quat a
	 * @param Quat b
	 * @return Boolean
	 */
    Quat.equals = function(a, b) {
        return !!(equals(a.x, b.x) && equals(a.y, b.y) && equals(a.z, b.z) && equals(a.w, b.w));
    };
    return Quat;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/vec4", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Vec4
	 * @brief 4D vector
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 * @param Number w
	 */
    function Vec4(x, y, z, w) {
        /**
	    * @property Number x
	    * @memberof Vec4
	    */
        this.x = x || 0;
        /**
	    * @property Number y
	    * @memberof Vec4
	    */
        this.y = y || 0;
        /**
	    * @property Number z
	    * @memberof Vec4
	    */
        this.z = z || 0;
        /**
	    * @property Number w
	    * @memberof Vec4
	    */
        this.w = w || 1;
        if (x && x.x) {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 1;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 1;
        }
    }
    var abs = Math.abs, sqrt = Math.sqrt, acos = Math.acos, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, clamp = Mathf.clamp, equals = Mathf.equals;
    /**
	 * @method clone
	 * @memberof Vec4
	 * @brief returns new copy of this
	 * @return Vec4
	 */
    Vec4.prototype.clone = function() {
        return new Vec4(this.x, this.y, this.z, this.w);
    };
    /**
	 * @method copy
	 * @memberof Vec4
	 * @brief copies other vector
	 * @param Vec4 other vector to be copied
	 * @return Vec4
	 */
    Vec4.prototype.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    };
    /**
	 * @method set
	 * @memberof Vec4
	 * @brief sets x and y of this vector
	 * @param Number x
	 * @param Number y
	 * @return Vec4
	 */
    Vec4.prototype.set = function(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    };
    /**
	 * @method vadd
	 * @memberof Vec4
	 * @brief adds a + b saves it in this
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Vec4
	 */
    Vec4.prototype.vadd = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    };
    /**
	 * @method add
	 * @memberof Vec4
	 * @brief adds this + other
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.add = function(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        this.w += other.w;
        return this;
    };
    /**
	 * @method sadd
	 * @memberof Vec4
	 * @brief adds this + scalar
	 * @param Number s
	 * @return Vec4
	 */
    Vec4.prototype.sadd = function(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;
        return this;
    };
    /**
	 * @method vsub
	 * @memberof Vec4
	 * @brief subtracts a - b saves it in this
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Vec4
	 */
    Vec4.prototype.vsub = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    };
    /**
	 * @method sub
	 * @memberof Vec4
	 * @brief subtracts this - other
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.sub = function(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        this.w -= other.w;
        return this;
    };
    /**
	 * @method ssub
	 * @memberof Vec4
	 * @brief subtracts this - scalar
	 * @param Number s
	 * @return Vec4
	 */
    Vec4.prototype.ssub = function(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        this.w -= s;
        return this;
    };
    /**
	 * @method vmul
	 * @memberof Vec4
	 * @brief multiples a * b saves it in this
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Vec4
	 */
    Vec4.prototype.vmul = function(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        this.w = a.w * b.w;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Vec4
	 * @brief multiples this * other
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.mul = function(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        this.w *= other.w;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Vec4
	 * @brief multiples this * scalar
	 * @param Number s
	 * @return Vec4
	 */
    Vec4.prototype.smul = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };
    /**
	 * @method vdiv
	 * @memberof Vec4
	 * @brief divides a / b saves it in this
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Vec4
	 */
    Vec4.prototype.vdiv = function(a, b) {
        var x = b.x, y = b.y, z = b.z, w = b.w;
        this.x = 0 !== x ? a.x / x : 0;
        this.y = 0 !== y ? a.y / y : 0;
        this.z = 0 !== z ? a.z / z : 0;
        this.w = 0 !== w ? a.w / w : 0;
        return this;
    };
    /**
	 * @method div
	 * @memberof Vec4
	 * @brief divides this / other
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.div = function(other) {
        var x = other.x, y = other.y, z = other.z, w = other.w;
        this.x = 0 !== x ? this.x / x : 0;
        this.y = 0 !== y ? this.y / y : 0;
        this.z = 0 !== z ? this.z / z : 0;
        this.w = 0 !== w ? this.w / w : 0;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Vec4
	 * @brief divides this / scalar
	 * @param Number s
	 * @return Vec4
	 */
    Vec4.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };
    /**
	 * @method vdot
	 * @memberof Vec4
	 * @brief gets dot product of a vector and b vector
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Number
	 */
    Vec4.vdot = Vec4.prototype.vdot = function(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    };
    /**
	 * @method dot
	 * @memberof Vec4
	 * @brief gets dot product of this vector and other vector
	 * @param Vec4 other
	 * @return Number
	 */
    Vec4.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
    };
    /**
	 * @method vlerp
	 * @memberof Vec4
	 * @brief linear interpolation between a vector and b vector by t
	 * @param Vec4 a
	 * @param Vec4 b
	 * @param Number t between 0 and 1
	 * @return Vec4
	 */
    Vec4.prototype.vlerp = function(a, b, t) {
        this.x = lerp(a.x, b.x, t);
        this.y = lerp(a.y, b.y, t);
        this.z = lerp(a.z, b.z, t);
        this.w = lerp(a.w, b.w, t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Vec4
	 * @brief linear interpolation between this vector and other vector by t
	 * @param Vec4 other
	 * @param Number t between 0 and 1
	 * @return Vec4
	 */
    Vec4.prototype.lerp = function(other, t) {
        this.x = lerp(this.x, other.x, t);
        this.y = lerp(this.y, other.y, t);
        this.z = lerp(this.z, other.z, t);
        this.w = lerp(this.w, other.w, t);
        return this;
    };
    /**
	 * @method vslerp
	 * @memberof Vec4
	 * @brief angular interpolation between a vector and b vector by t
	 * @param Vec4 a
	 * @param Vec4 b
	 * @param Number t between 0 and 1
	 * @return Vec4
	 */
    Vec4.prototype.vslerp = function() {
        var start = new Vec4(), end = new Vec4(), vec = new Vec4(), relative = new Vec4();
        return function(a, b, t) {
            var dot = clamp(a.dot(b), -1, 1), theta = acos(dot) * t;
            start.copy(a);
            end.copy(b);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method slerp
	 * @memberof Vec4
	 * @brief angular interpolation between this vector and other vector by t
	 * @param Vec4 other
	 * @param Number t between 0 and 1
	 * @return Vec4
	 */
    Vec4.prototype.slerp = function() {
        var start = new Vec4(), end = new Vec4(), vec = new Vec4(), relative = new Vec4();
        return function(other, t) {
            var dot = clamp(this.dot(other), -1, 1), theta = acos(dot) * t;
            start.copy(this);
            end.copy(other);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method applyMat4
	 * @memberof Vec4
	 * @brief multiply this vector by Mat4
	 * @param Mat4 m
	 * @return Vec4
	 */
    Vec4.prototype.applyMat4 = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z, w = this.w;
        this.x = x * me[0] + y * me[4] + z * me[8] + w * me[12];
        this.y = x * me[1] + y * me[5] + z * me[9] + w * me[13];
        this.z = x * me[2] + y * me[6] + z * me[10] + w * me[14];
        this.w = x * me[3] + y * me[7] + z * me[11] + w * me[15];
        return this;
    };
    /**
	 * @method applyProj
	 * @memberof Vec4
	 * @brief multiply this vector by projection matrix
	 * @param Mat4 m
	 * @return Vec4
	 */
    Vec4.prototype.applyProj = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z, w = this.w;
        d = 1 / (x * me[3] + y * me[7] + z * me[11] + w * me[15]);
        this.x = (me[0] * x + me[4] * y + me[8] + z * me[12]) * d;
        this.y = (me[1] * x + me[5] * y + me[9] + z * me[13]) * d;
        this.z = (me[2] * x + me[6] * y + me[10] + z * me[14]) * d;
        this.z = (me[3] * x + me[7] * y + me[11] + z * me[15]) * d;
        return this;
    };
    /**
	 * @method lenSq
	 * @memberof Vec4
	 * @brief gets squared length of this
	 * @return Number
	 */
    Vec4.prototype.lenSq = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        return x * x + y * y + z * z + w * w;
    };
    /**
	 * @method len
	 * @memberof Vec4
	 * @brief gets length of this
	 * @return Number
	 */
    Vec4.prototype.len = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        return sqrt(x * x + y * y + z * z + w * w);
    };
    /**
	 * @method norm
	 * @memberof Vec4
	 * @brief normalizes this vector so length is equal to 1
	 * @return Vec4
	 */
    Vec4.prototype.norm = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w, l = x * x + y * y + z * z + w * w;
        l = 0 !== l ? 1 / sqrt(l) : 0;
        this.x *= l;
        this.y *= l;
        this.z *= l;
        return this;
    };
    /**
	 * @method negate
	 * @memberof Vec4
	 * @brief negates x and y values
	 * @return Vec4
	 */
    Vec4.prototype.negate = function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
    };
    /**
	 * @method abs
	 * @memberof Vec4
	 * @brief gets absolute values of vector
	 * @return Vec4
	 */
    Vec4.prototype.abs = function() {
        this.x = abs(this.x);
        this.y = abs(this.y);
        this.z = abs(this.z);
        this.w = abs(this.w);
        return this;
    };
    /**
	 * @method min
	 * @memberof Vec4
	 * @brief returns min values from this and other vector
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.min = function(other) {
        var x = other.x, y = other.y, z = other.z, w = other.w;
        this.x = this.x > x ? x : this.x;
        this.y = this.y > y ? y : this.y;
        this.z = this.z > z ? z : this.z;
        this.w = this.w > w ? w : this.w;
        return this;
    };
    /**
	 * @method max
	 * @memberof Vec4
	 * @brief returns max values from this and other vector
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.max = function(other) {
        var x = other.x, y = other.y, z = other.z, w = other.w;
        this.x = x > this.x ? x : this.x;
        this.y = y > this.y ? y : this.y;
        this.z = z > this.z ? z : this.z;
        this.w = w > this.w ? w : this.w;
        return this;
    };
    /**
	 * @method clamp
	 * @memberof Vec4
	 * @brief clamps this vector between min and max vector's values
	 * @param Vec4 min
	 * @param Vec4 max
	 * @return Vec4
	 */
    Vec4.prototype.clamp = function(min, max) {
        this.x = clamp(this.x, min.x, max.x);
        this.y = clamp(this.y, min.y, max.y);
        this.z = clamp(this.z, min.z, max.z);
        this.w = clamp(this.w, min.w, max.w);
        return this;
    };
    /**
	 * @method toString
	 * @memberof Vec4
	 * @brief returns string of this vector - "Vec4( 0, 0, 0, 1 )"
	 * @return String
	 */
    Vec4.prototype.toString = function() {
        return "Vec4( " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " )";
    };
    /**
	 * @method equals
	 * @memberof Vec4
	 * @brief checks if this vector equals other vector
	 * @param Vec4 other
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec4.prototype.equals = function(other, e) {
        return !!(equals(this.x, other.x, e) && equals(this.y, other.y, e) && equals(this.z, other.z, e) && equals(this.w, other.w, e));
    };
    /**
	 * @method Vec4.equals
	 * @memberof Vec4
	 * @brief checks if a vector equals b vector
	 * @param Vec4 a
	 * @param Vec4 b
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec4.equals = function(a, b, e) {
        return !!(equals(a.x, b.x, e) && equals(a.y, b.y, e) && equals(a.z, b.z, e) && equals(a.w, b.w, e));
    };
    return Vec4;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/sharedobject", [ "base/class" ], function(Class) {
    /**
	 * @class SharedObject
	 * @extends Class
	 * @brief Objects that are shared between server and client extend from this
	 */
    function SharedObject() {
        Class.call(this);
        /**
	    * @property Object _JSON
	    * @memberof Scene
	    */
        this._JSON = {};
        /**
	    * @property Number _SERVER_ID
	    * @memberof Scene
	    */
        this._SERVER_ID = -1;
    }
    Class.extend(SharedObject, Class);
    /**
	 * @method serverSync
	 * @memberof SharedObject
	 */
    SharedObject.prototype.serverSync = function() {
        var json = this._JSON;
        return json;
    };
    /**
	 * @method clientSync
	 * @memberof SharedObject
	 * @param JSON json
	 */
    SharedObject.prototype.clientSync = function() {
        return this;
    };
    /**
	 * @method toJSON
	 * @memberof SharedObject
	 * @brief returns json representation of object
	 */
    SharedObject.prototype.toJSON = function() {
        var json = this._JSON;
        return json;
    };
    /**
	 * @method fromJSON
	 * @memberof SharedObject
	 * @param JSON json
	 */
    SharedObject.prototype.fromJSON = function() {
        return this;
    };
    return SharedObject;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/assets/asset", [ "base/class", "core/sharedobject" ], function(Class, SharedObject) {
    /**
	 * @class Asset
	 * @extends SharedObject
	 * @brief Base class for all assets in game
	 * @param Object opts sets Class properties from passed Object
	 */
    function Asset(opts) {
        opts || (opts = {});
        SharedObject.call(this);
        /**
	    * @property String name
	    * @brief name of asset
	    * @memberof Asset
	    */
        this.name = void 0 !== opts.name ? opts.name : this._class + this._id;
        /**
	    * @property String src
	    * @brief url of the asset
	    * @memberof Asset
	    */
        this.src = void 0 !== opts.src ? opts.src : "";
        /**
	    * @property Object data
	    * @brief the data this asset recieved when loaded from src
	    * @memberof Asset
	    */
        this.data = void 0;
        /**
	    * @property Object glData
	    * @brief webgl data created by renderers, stored here for speed
	    * @memberof Asset
	    */
        this.glData = void 0;
    }
    Class.extend(Asset, SharedObject);
    /**
	 * @method load
	 * @memberof Asset
	 * @brief loads this asset
	 * @param Function callback
	 */
    Asset.prototype.load = function() {};
    return Asset;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/config", [], function() {
    /**
	 * @class Config
	 * @brief configuration for Game
	 */
    function Config() {
        /**
	    * @property Boolean debug
	    * @brief is debug on
	    * @memberof Config
	    */
        this.debug = !1;
        /**
	    * @property Boolean forceCanvas
	    * @brief force Canvas renderering, affects clients only
	    * @memberof Config
	    */
        this.forceCanvas = !1;
        /**
	    * @property String host
	    * @brief server's host url, defaults to machines localhost
	    * @memberof Config
	    */
        this.host = "127.0.0.1";
        /**
	    * @property Number port
	    * @brief server's port, defaults to 3000
	    * @memberof Config
	    */
        this.port = 3e3;
    }
    return new Config();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/assets/assets", [ "base/class", "base/time", "core/sharedobject", "core/game/config" ], function(Class, Time, SharedObject, Config) {
    /**
	 * @class Assets
	 * @extends SharedObject
	 * @brief class for handling assets
	 * @param Object opts sets Class properties from passed Object
	 */
    function Assets(opts) {
        opts || (opts = {});
        SharedObject.call(this);
        this._JSON = {};
        this.total = 0;
        this.loadTime = 0;
        this.loaded = 0;
        this.loading = !1;
        this.assets = {};
    }
    var now = Time.now;
    Class.extend(Assets, SharedObject);
    /**
	 * @method addAssets
	 * @memberof Assets
	 * @brief adds all Assets in arguments to Assets
	 */
    Assets.prototype.addAssets = function() {
        for (var i = arguments.length; i--; ) this.addAsset(arguments[i]);
    };
    /**
	 * @method addAsset
	 * @memberof Assets
	 * @brief adds Asset to Assets
	 * @param Asset asset
	 */
    Assets.prototype.addAsset = function(asset) {
        if (asset) {
            var name = asset.name, assets = this.assets, index = assets[name];
            if (index) console.warn(this + ".addAsset: already has an asset with name " + asset.name); else {
                this.total++;
                assets[name] = asset;
            }
        } else console.warn(this + ".addAsset: Asset is not defined");
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
    Assets.prototype.removeAssets = function() {
        for (var i = arguments.length; i--; ) this.removeAsset(arguments[i]);
    };
    /**
	 * @method removeAsset
	 * @memberof Assets
	 * @brief removes Asset from Assets
	 * @param Asset asset
	 */
    Assets.prototype.removeAsset = function(asset) {
        if (asset) {
            var name = asset.name, assets = this.assets, index = assets[name];
            if (index) {
                this.total--;
                assets[name] = void 0;
            } else console.warn(this + ".removeAsset: Assets does not have asset " + asset);
        } else console.warn(this + ".removeAsset: Asset is not defined");
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
    Assets.prototype.load = function(callback) {
        var asset, key, self = this, assets = this.assets, startTime = now();
        self.trigger("load");
        this.loading = !0;
        for (key in assets) {
            asset = assets[key];
            if (asset && asset.src) asset.load(function(that) {
                Config.debug && console.log("Assets.load: loading " + that.name + " from " + that.src);
                self.loaded++;
                if (self.loaded >= self.total) {
                    self.loadTime = now() - startTime;
                    Config.debug && console.log("Assets.load: " + self.loaded + " in " + self.loadTime + "s");
                    self.loading = !1;
                    callback && callback();
                    self.trigger("loaded");
                }
            }); else {
                self.loaded++;
                if (self.loaded >= self.total) {
                    self.loadTime = now() - startTime;
                    Config.debug && console.log("Assets.load: " + self.loaded + " in " + self.loadTime + "s");
                    self.loading = !1;
                    callback && callback();
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
    Assets.prototype.get = function(name) {
        var asset = this.assets[name];
        asset || console.warn(this + ".get: Assets does not have an Asset named " + name);
        return asset;
    };
    Assets.prototype.toJSON = function() {
        var jsonAssets, name, json = this._JSON, assets = this.assets;
        json._SERVER_ID = this._id;
        json.assets || (json.assets = {});
        jsonAssets = json.assets;
        for (name in assets) jsonAssets[name] = assets[name].toJSON();
        return json;
    };
    Assets.prototype.fromJSON = function(json) {
        var asset, name, jsonAssets = json.assets;
        this._SERVER_ID = json._SERVER_ID;
        for (name in jsonAssets) {
            asset = jsonAssets[name];
            this.addAsset(new Class.types[asset._class]().fromJSON(asset));
        }
        return this;
    };
    return new Assets();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/assets/imageasset", [ "base/class", "core/assets/asset" ], function(Class, Asset) {
    /**
	 * @class ImageAsset
	 * @extends Asset
	 * @brief image asset
	 * @param Object opts sets Class properties from passed Object
	 */
    function ImageAsset(opts) {
        opts || (opts = {});
        Asset.call(this, opts);
        this.glData = {
            needsUpdate: !0,
            texture: void 0
        };
    }
    Class.extend(ImageAsset, Asset);
    /**
	 * @method load
	 * @memberof ImageAsset
	 * @brief loads this asset's data
	 * @param Function callback
	 */
    ImageAsset.prototype.load = function(callback) {
        var self = this, image = new Image();
        this.data = void 0;
        image.onload = function() {
            self.data = image;
            self.trigger("loaded");
            callback && callback(self);
        };
        image.src = this.src;
    };
    ImageAsset.prototype.toJSON = function() {
        var json = this._JSON;
        json._SERVER_ID = this._id;
        json._class = "ImageAsset";
        json.name = this.name;
        json.src = this.src;
        return json;
    };
    ImageAsset.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.name = json.name;
        this.src = json.src;
        return this;
    };
    return ImageAsset;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/assets/spritesheetasset", [ "base/class", "core/assets/asset" ], function(Class, Asset) {
    /**
	 * @class SpriteSheetAsset
	 * @extends Asset
	 * @brief image asset
	 * @param Object opts sets Class properties from passed Object
	 */
    function SpriteSheetAsset(opts) {
        opts || (opts = {});
        Asset.call(this, opts);
    }
    Class.extend(SpriteSheetAsset, Asset);
    /**
	 * @method load
	 * @memberof SpriteSheetAsset
	 * @brief loads this asset's data
	 * @param Function callback
	 */
    SpriteSheetAsset.prototype.load = function(callback) {
        var self = this, request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            1 === request.readyState && request.send();
            if (4 === request.readyState) if (404 === request.status) console.warn("Dom.ajax: 404 - file not found"); else {
                var res = JSON.parse(request.responseText);
                self.data = res;
                callback && callback(self);
            }
        };
        request.open("GET", this.src, !0);
    };
    SpriteSheetAsset.prototype.toJSON = function() {
        var json = this._JSON;
        json._SERVER_ID = this._id;
        json._class = "SpriteSheetAsset";
        json.name = this.name;
        json.src = this.src;
        return json;
    };
    SpriteSheetAsset.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.name = json.name;
        this.src = json.src;
        return this;
    };
    return SpriteSheetAsset;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/sharedcomponent", [ "base/class", "core/sharedobject" ], function(Class, SharedObject) {
    /**
	 * @class SharedComponent
	 * @extends Class
	 * @brief Base class for all shared components
	 */
    function SharedComponent() {
        SharedObject.call(this);
        this.gameObject = void 0;
    }
    Class.extend(SharedComponent, SharedObject);
    /**
	 * @method init
	 * @memberof SharedComponent
	 * @brief called when added to GameObject
	 */
    SharedComponent.prototype.init = function() {};
    /**
	 * @method update
	 * @memberof SharedComponent
	 * @brief called every frame
	 */
    SharedComponent.prototype.update = function() {};
    /**
	 * @method destroy
	 * @memberof SharedComponent
	 * @brief removes this from GameObject
	 */
    SharedComponent.prototype.destroy = function() {
        var gameObject = this.gameObject;
        gameObject ? gameObject.removeSharedComponent(this) : console.warn(this + ".destroy: SharedComponent is not added to a GameObject");
        this.trigger("destroy");
    };
    return SharedComponent;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/camera2d", [ "base/class", "math/mathf", "math/mat32", "math/mat4", "core/components/sharedcomponent" ], function(Class, Mathf, Mat32, Mat4, SharedComponent) {
    /**
	 * @class Camera2D
	 * @extends Component
	 * @brief camera is a device through which the player views the world
	 * @param Object opts sets Class properties from passed Object
	 */
    function Camera2D(opts) {
        opts || (opts = {});
        SharedComponent.call(this);
        /**
	    * @property Number clientWidth
	    * @brief client's screen width
	    * @memberof Camera2D
	    */
        this.clientWidth = 960;
        /**
	    * @property Number clientHeight
	    * @brief client's screen height
	    * @memberof Camera2D
	    */
        this.clientHeight = 640;
        /**
	    * @property Number zoom
	    * @brief zoom amount
	    * @memberof Camera2D
	    */
        this._zoom = void 0 !== opts.zoom ? opts.zoom : 1;
        /**
	    * @property Number width
	    * @brief width of camera's lens
	    * @memberof Camera2D
	    */
        this._width = this.clientWidth;
        /**
	    * @property Number height
	    * @brief height of camera's lens
	    * @memberof Camera2D
	    */
        this._height = this.clientHeight;
        /**
	    * @property Number aspect
	    * @brief width / height
	    * @memberof Camera2D
	    */
        this._aspect = this._width / this._height;
        /**
	    * @property Mat32 matrixProj
	    * @brief camera's projection matrix
	    * @memberof Camera2D
	    */
        this.matrixProj = new Mat32();
        this._matrixProj4 = new Mat4();
        /**
	    * @property Mat32 matrixProjInv
	    * @brief camera's inverse projection matrix
	    * @memberof Camera2D
	    */
        this.matrixProjInv = new Mat32();
        /**
	    * @property Mat32 matrixWorldInv
	    * @brief camera's matrix world inverse
	    * @memberof Camera2D
	    */
        this.matrixWorldInv = new Mat32();
        /**
	    * @property Mat32 matrixViewProj
	    * @brief camera's matrix view projection
	    * @memberof Camera2D
	    */
        this.matrixViewProj = new Mat32();
        /**
	    * @property Mat32 matrixViewProjInv
	    * @brief camera's matrix view projection inverse
	    * @memberof Camera2D
	    */
        this.matrixViewProjInv = new Mat32();
        /**
	    * @property Mat32 needsUpdate
	    * @brief if true updates projection matrix
	    * @memberof Camera2D
	    */
        this.needsUpdate = !0;
    }
    var EPSILON = Mathf.EPSILON;
    Class.extend(Camera2D, SharedComponent);
    Class.props(Camera2D.prototype, {
        zoom: {
            get: function() {
                return this._zoom;
            },
            set: function(value) {
                this._zoom = EPSILON > value ? EPSILON : value;
                this.needsUpdate = !0;
            }
        },
        width: {
            get: function() {
                return this._width;
            },
            set: function(value) {
                this._width = value;
                this._aspect = value / this._height;
                this.needsUpdate = !0;
            }
        },
        height: {
            get: function() {
                return this._height;
            },
            set: function(value) {
                this._height = value;
                this._aspect = this._width / value;
                this.needsUpdate = !0;
            }
        },
        aspect: {
            get: function() {
                return this._aspect;
            }
        }
    });
    /**
	 * @method toWorld
	 * @memberof Camera2D
	 * @brief converts screen point to world space
	 * @param Vec2 v
	 */
    Camera2D.prototype.toWorld = function(v) {
        v.x = 2 * v.x / this.clientWidth - 1;
        v.y = 2 * v.y / this.clientHeight - 1;
        v.applyMat32(this.matrixViewProjInv);
    };
    /**
	 * @method toScreen
	 * @memberof Camera2D
	 * @brief converts world point to screen space
	 * @param Vec2 v
	 */
    Camera2D.prototype.toScreen = function(v) {
        v.applyMat32(this.matrixViewProj);
        v.x = (v.x + 1) / 2 * this.clientWidth;
        v.y = (v.y + 1) / 2 * this.clientHeight;
    };
    /**
	 * @method init
	 * @memberof Camera2D
	 * @brief called when added to GameObject
	 */
    Camera2D.prototype.init = function() {
        this.update();
    };
    /**
	 * @method update
	 * @memberof Camera2D
	 * @brief called every frame
	 */
    Camera2D.prototype.update = function() {
        var gameObject = this.gameObject, transform = gameObject.transform2d, matrixWorld = transform.matrixWorld, matrixProj = this.matrixProj, matrixProjInv = this.matrixProjInv;
        if (this.needsUpdate) {
            var zoom = this.zoom, right = .5 * this.width * zoom, left = -right, top = .5 * this.height * zoom, bottom = -top;
            matrixProj.orthographic(left, right, top, bottom);
            matrixProjInv.minv(matrixProj);
            this._matrixProj4.orthographic(left, right, top, bottom, -1, 1);
            this.needsUpdate = !1;
        }
        if (transform) {
            this.matrixWorldInv.minv(matrixWorld);
            this.matrixViewProj.mmul(this.matrixWorldInv, matrixProj);
            this.matrixViewProjInv.minv(this.matrixViewProj);
        }
    };
    Camera2D.prototype.toJSON = function() {
        var json = this._JSON;
        json._class = this._class;
        json._SERVER_ID = this._id;
        json.zoom = this.zoom;
        return json;
    };
    Camera2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.zoom = json.zoom;
        this.needsUpdate = !0;
        return this;
    };
    return Camera2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/component", [ "base/class" ], function(Class) {
    /**
	 * @class Component
	 * @extends Class
	 * @brief Base class for all components
	 */
    function Component() {
        Class.call(this);
        this.gameObject = void 0;
    }
    Class.extend(Component, Class);
    /**
	 * @method init
	 * @memberof Component
	 * @brief called when added to GameObject
	 */
    Component.prototype.init = function() {};
    /**
	 * @method update
	 * @memberof Component
	 * @brief called every frame
	 */
    Component.prototype.update = function() {};
    /**
	 * @method destroy
	 * @memberof Component
	 * @brief removes this from GameObject
	 */
    Component.prototype.destroy = function() {
        var gameObject = this.gameObject;
        gameObject ? gameObject.removeComponent(this) : console.warn(this + ".destroy: Component is not added to a GameObject");
        this.trigger("destroy");
    };
    return Component;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/bodies/pbody2d", [ "base/class", "math/vec2" ], function(Class, Vec2) {
    /**
	 * @class Phys2D.PBody2D
	 * @extends Class
	 * @brief 2D body consisting of one point mass
	 * @param Object opts sets Class properties from passed Object
	 */
    function PBody2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Phys2D.World2D world
	    * @memberof Phys2D.PBody2D
	    */
        this.world = void 0;
        /**
	    * @property Vec2 position
	    * @memberof Phys2D.PBody2D
	    */
        this.position = opts.position || new Vec2();
        /**
	    * @property Vec2 velocity
	    * @memberof Phys2D.PBody2D
	    */
        this.velocity = opts.velocity || new Vec2();
        /**
	    * @property Vec2 linearDamping
	    * @memberof Phys2D.PBody2D
	    */
        this.linearDamping = opts.linearDamping || new Vec2(.01, .01);
        /**
	    * @property Vec2 force
	    * @memberof Phys2D.PBody2D
	    */
        this.force = new Vec2();
        /**
	    * @property Vec2 center
	    * @memberof Phys2D.PBody2D
	    */
        this.center = opts.center || new Vec2();
        /**
	    * @property Number mass
	    * @memberof Phys2D.PBody2D
	    */
        this.mass = void 0 !== opts.mass ? opts.mass : 1;
        this.invMass = this.mass > 0 ? 1 / this.mass : 0;
        /**
	    * @property ENUM motionState
	    * @memberof Phys2D.PBody2D
	    * @brief motion state, Phys2D.PBody2D.DYNAMIC, Phys2D.PBody2D.STATIC or Phys2D.PBody2D.KINEMATIC
	    */
        this.motionState = void 0 !== opts.motionState ? opts.motionState : this.mass > 0 ? DYNAMIC : STATIC;
        /**
	    * @property Number boundingRadius
	    * @memberof Phys2D.PBody2D
	    */
        this.boundingRadius = .1;
        /**
	    * @property Boolean allowSleep
	    * @memberof Phys2D.PBody2D
	    */
        this.allowSleep = void 0 !== opts.allowSleep ? !!opts.allowSleep : !0;
        /**
	    * @property Number sleepVelocity
	    * @memberof Phys2D.PBody2D
	    * @brief if the velocity's magnitude is smaller than this value, the body is considered sleepy
	    */
        this.sleepVelocity = void 0 !== opts.sleepVelocity ? opts.sleepVelocity : .01;
        /**
	    * @property Number sleepyTimeLimit
	    * @memberof Phys2D.PBody2D
	    * @brief if the body has been sleepy for sleepyTimeLimit seconds, it is considered sleeping
	    */
        this.sleepyTimeLimit = void 0 !== opts.sleepyTimeLimit ? opts.sleepyTimeLimit : 1;
        /**
	    * @property ENUM sleepState
	    * @memberof Phys2D.PBody2D
	    */
        this.sleepState = AWAKE;
        this._timeLastSleepy = 0;
    }
    var STATIC, DYNAMIC, KINEMATIC, AWAKE, SLEEPY, SLEEPING;
    Class.extend(PBody2D, Class);
    /**
	 * @method isAwake
	 * @memberof Phys2D.PBody2D
	 */
    PBody2D.prototype.isAwake = function() {
        return this.sleepState === AWAKE;
    };
    /**
	 * @method isSleepy
	 * @memberof Phys2D.PBody2D
	 */
    PBody2D.prototype.isSleepy = function() {
        return this.sleepState === SLEEPY;
    };
    /**
	 * @method isSleeping
	 * @memberof Phys2D.PBody2D
	 */
    PBody2D.prototype.isSleeping = function() {
        return this.sleepState === SLEEPING;
    };
    /**
	 * @method wake
	 * @memberof Phys2D.PBody2D
	 */
    PBody2D.prototype.wake = function() {
        this.sleepState === SLEEPING && this.trigger("wake");
        this.sleepState = AWAKE;
    };
    /**
	 * @method sleep
	 * @memberof Phys2D.PBody2D
	 */
    PBody2D.prototype.sleep = function() {
        this.sleepState = SLEEPING;
    };
    /**
	 * @method sleepTick
	 * @memberof Phys2D.PBody2D
	 */
    PBody2D.prototype.sleepTick = function(time) {
        if (this.allowSleep) {
            var sleepState = this.sleepState, vel = this.velocity.lenSq(), sleepVel = this.sleepVelocity * this.sleepVelocity;
            if (sleepState === AWAKE && sleepVel > vel) {
                this.sleepState = SLEEPY;
                this._timeLastSleepy = time;
            } else sleepState === SLEEPY && vel > sleepVel ? this.wake() : sleepState === SLEEPY && time - this._timeLastSleepy > this.sleepyTimeLimit && this.sleep();
        }
    };
    PBody2D.AWAKE = AWAKE = 1;
    PBody2D.SLEEPY = SLEEPY = 2;
    PBody2D.SLEEPING = SLEEPING = 3;
    PBody2D.STATIC = STATIC = 1;
    PBody2D.DYNAMIC = DYNAMIC = 2;
    PBody2D.KINEMATIC = KINEMATIC = 3;
    return PBody2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/shapes/pshape2d", [ "base/class", "math/vec2", "math/mat2", "math/aabb2" ], function(Class, Vec2, Mat2, AABB2) {
    /**
	 * @class Phys2D.PShape2D
	 * @extends Class
	 * @brief 2D shape
	 * @param Object opts sets Class properties from passed Object
	 */
    function PShape2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property ENUM shapeType
	    * @memberof Phys2D.PShape2D
	    * @brief PShape2D.CIRCLE or PShape2D.CONVEX
	    */
        this.shapeType = -1;
        /**
	    * @property Phys2D.PRigidbody2D body
	    * @memberof Phys2D.PShape2D
	    */
        this.body = void 0;
        /**
	    * @property Vec2 position
	    * @memberof Phys2D.PShape2D
	    */
        this.position = opts.position || new Vec2();
        /**
	    * @property Number rotation
	    * @memberof Phys2D.PShape2D
	    */
        this.rotation = opts.rotation || 0;
        /**
	    * @property Mat2 R
	    * @memberof Phys2D.PShape2D
	    */
        this.R = new Mat2().setRotation(this.rotation);
        /**
	    * @property Number density
	    * @memberof Phys2D.PShape2D
	    */
        this.density = void 0 !== opts.density ? opts.density : 1;
        /**
	    * @property Number mass
	    * @memberof Phys2D.PShape2D
	    */
        this.mass = 0;
        this.invMass = 0;
        /**
	    * @property Number inertia
	    * @memberof Phys2D.PShape2D
	    */
        this.I = 0;
        this.invI = 0;
        /**
	    * @property Vec2 center
	    * @memberof Phys2D.PShape2D
	    */
        this.center = new Vec2();
        /**
	    * @property AABB2 aabb
	    * @memberof Phys2D.PShape2D
	    */
        this.aabb = new AABB2();
        /**
	    * @property Number boundingRadius
	    * @memberof Phys2D.PShape2D
	    */
        this.boundingRadius = 0;
    }
    var CIRCLE, CONVEX;
    Class.extend(PShape2D, Class);
    /**
	 * @method init
	 * @memberof Phys2D.PShape2D
	 */
    PShape2D.prototype.init = function() {
        this.calculateAABB();
        this.calculateBoundingRadius();
        this.calculateMass();
    };
    /**
	 * @method calculateAABB
	 * @memberof Phys2D.PShape2D
	 */
    PShape2D.prototype.calculateAABB = function() {};
    /**
	 * @method calculateBoundingRadius
	 * @memberof Phys2D.PShape2D
	 */
    PShape2D.prototype.calculateBoundingRadius = function() {};
    /**
	 * @method calculateMass
	 * @memberof Phys2D.PShape2D
	 */
    PShape2D.prototype.calculateMass = function() {};
    /**
	 * @method setDensity
	 * @memberof Phys2D.PShape2D
	 * @param Number density
	 */
    PShape2D.prototype.setDensity = function(density) {
        this.density = density;
        this.calculateMass();
        this.body && this.body.calculateMass();
    };
    /**
	 * @method setMass
	 * @memberof Phys2D.PShape2D
	 * @param Number mass
	 */
    PShape2D.prototype.setMass = function(mass) {
        this.mass = mass;
        this.invMass = 1 / mass;
        this.body && this.body.calculateMass();
    };
    /**
	 * @method setI
	 * @memberof Phys2D.PShape2D
	 * @param Number I
	 */
    PShape2D.prototype.setI = function(I) {
        this.I = I;
        this.invI = 1 / I;
        this.body && this.body.calculateMass();
    };
    /**
	 * @method toWorld
	 * @memberof Phys2D.PShape2D
	 * @param Vec2 v
	 */
    PShape2D.prototype.toWorld = function(v) {
        var body = this.body, bodyPos = body.position, R = body.R.elements, pos = this.position, x = pos.x, y = pos.y;
        v.x = bodyPos.x + (x * R[0] + y * R[2]);
        v.y = bodyPos.y + (x * R[1] + y * R[3]);
    };
    PShape2D.CIRCLE = CIRCLE = 1;
    PShape2D.CONVEX = CONVEX = 2;
    return PShape2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/shapes/pcircle2d", [ "base/class", "math/vec2", "phys2d/shapes/pshape2d" ], function(Class, Vec2, PShape2D) {
    /**
	 * @class Phys2D.PCircle2D
	 * @extends Class
	 * @brief 2D circle shape
	 * @param Object opts sets Class properties from passed Object
	 */
    function PCircle2D(opts) {
        opts || (opts = {});
        PShape2D.call(this, opts);
        this.shapeType = PShape2D.CIRCLE;
        /**
	    * @property Number radius
	    * @memberof Phys2D.PCircle2D
	    */
        this.radius = opts.radius || .5;
    }
    var PI = Math.PI;
    Class.extend(PCircle2D, PShape2D);
    /**
	 * @method calculateAABB
	 * @memberof Phys2D.PCircle2D
	 */
    PCircle2D.prototype.calculateAABB = function() {
        var world = new Vec2();
        return function() {
            if (this.body) {
                var aabb = this.aabb, min = aabb.min, max = aabb.max, r = this.radius;
                this.toWorld(world);
                min.x = world.x - r;
                min.y = world.y - r;
                max.x = world.x + r;
                max.y = world.y + r;
            }
        };
    }();
    /**
	 * @method calculateBoundingRadius
	 * @memberof Phys2D.PCircle2D
	 */
    PCircle2D.prototype.calculateBoundingRadius = function() {
        this.boundingRadius = this.radius;
    };
    /**
	 * @method calculateMass
	 * @memberof Phys2D.PCircle2D
	 */
    PCircle2D.prototype.calculateMass = function() {
        var r = this.radius, c = this.center, p = this.position, px = p.x, py = p.y, mass = 0, I = 0;
        c.x = px;
        c.y = py;
        mass = this.density * PI * r * r;
        I = mass * (.5 * r * r + (px * px + py * py));
        this.mass = mass;
        this.invMass = mass > 0 ? 1 / mass : 0;
        this.I = I;
        this.invI = I > 0 ? 1 / I : 0;
    };
    return PCircle2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/bodies/prigidbody2d", [ "base/class", "math/vec2", "math/aabb2", "phys2d/bodies/pbody2d", "phys2d/shapes/pcircle2d" ], function(Class, Vec2, AABB2, PBody2D) {
    /**
	 * @class Phys2D.PRigidbody2D
	 * @extends Phys2D.PBody2D
	 * @brief 2D body consisting of position and orientation
	 * @param Object opts sets Class properties from passed Object
	 */
    function PRigidbody2D(opts) {
        opts || (opts = {});
        PBody2D.call(this, opts);
        /**
	    * @property Number rotation
	    * @memberof Phys2D.PRigidbody2D
	    */
        this.rotation = opts.rotation || 0;
        /**
	    * @property Mat2 R
	    * @memberof Phys2D.PRigidbody2D
	    */
        this.R = new Mat2().setRotation(this.rotation);
        /**
	    * @property Number velocity
	    * @memberof Phys2D.PRigidbody2D
	    */
        this.angularVelocity = opts.angularVelocity || 0;
        /**
	    * @property Number angularDamping
	    * @memberof Phys2D.PRigidbody2D
	    */
        this.angularDamping = opts.angularDamping || .01;
        /**
	    * @property Array shapes
	    * @memberof Phys2D.PRigidbody2D
	    */
        this.shapes = [];
        /**
	    * @property Number I
	    * @memberof Phys2D.PRigidbody2D
	    */
        this.I = 0;
        this.invI = 0;
        /**
	    * @property Number torque
	    * @memberof Phys2D.PRigidbody2D
	    */
        this.torque = 0;
        /**
	    * @property Number sleepAngularVelocity
	    * @memberof Phys2D.PRigidbody2D
	    * @brief if the angular velocity is smaller than this value, the body is considered sleepy
	    */
        this.sleepAngularVelocity = void 0 !== opts.sleepAngularVelocity ? opts.sleepAngularVelocity : .01;
        opts.shapes && this.addShapes.apply(this, opts.shapes);
    }
    var AWAKE = (PBody2D.STATIC, PBody2D.DYNAMIC, PBody2D.KINEMATIC, PBody2D.AWAKE), SLEEPY = PBody2D.SLEEPY;
    PBody2D.SLEEPING;
    Class.extend(PRigidbody2D, PBody2D);
    /**
	 * @method addShapes
	 * @memberof Phys2D.PRigidbody2D
	 * @brief adds all shapes in arguments to shapes
	 */
    PRigidbody2D.prototype.addShapes = function() {
        for (var i = arguments.length; i--; ) this.addShape(arguments[i]);
    };
    /**
	 * @method addShape
	 * @memberof Phys2D.PRigidbody2D
	 * @param PShape2D shape
	 */
    PRigidbody2D.prototype.addShape = function(shape) {
        if (shape) {
            var shapes = this.shapes, index = shapes.indexOf(shape);
            if (0 > index) {
                shapes.push(shape);
                shape.body = this;
                shape.init();
            } else console.warn(this + ".addShape: Shape is already added to body");
            this.calculateMass();
        } else console.warn(this + ".addShape: Shape is not defined");
    };
    /**
	 * @method add
	 * @memberof Phys2D.PRigidbody2D
	 * @brief same as addShapes
	 */
    PRigidbody2D.prototype.add = PRigidbody2D.prototype.addShapes;
    /**
	 * @method removeShapes
	 * @memberof Phys2D.PRigidbody2D
	 * @brief adds all shapes in arguments to shapes
	 */
    PRigidbody2D.prototype.removeShapes = function() {
        for (var i = arguments.length; i--; ) this.removeShape(arguments[i]);
    };
    /**
	 * @method removeShape
	 * @memberof Phys2D.PRigidbody2D
	 * @param PShape2D shape
	 */
    PRigidbody2D.prototype.removeShape = function(shape) {
        if (shape) {
            var shapes = this.shapes, index = shapes.indexOf(shape);
            if (index > -1) {
                shapes.splice(index, 1);
                shape.body = void 0;
            } else console.warn(this + ".addShape: Shape is already added to body");
            this.calculateMass();
        } else console.warn(this + ".addShape: Shape is not defined");
    };
    /**
	 * @method remove
	 * @memberof Phys2D.PRigidbody2D
	 * @brief same as addShapes
	 */
    PRigidbody2D.prototype.remove = PRigidbody2D.prototype.removeShapes;
    /**
	 * @method calculateMass
	 * @memberof Phys2D.PRigidbody2D
	 */
    PRigidbody2D.prototype.calculateMass = function() {
        var shape, i, shapes = this.shapes, mass = 0, I = 0;
        for (i = shapes.length; i--; ) {
            shape = shapes[i];
            shape.calculateMass();
            mass += shape.mass;
            I += shape.I;
        }
        this.mass = mass;
        this.invMass = 1 / mass;
        this.I = I;
        this.invI = 1 / I;
    };
    /**
	 * @method sleepTick
	 * @memberof Phys2D.PRigidbody2D
	 */
    PRigidbody2D.prototype.sleepTick = function(time) {
        if (this.allowSleep) {
            var sleepState = this.sleepState, vel = this.velocity.lenSq(), aVel = this.angularVelocity * this.angularVelocity, sleepVel = this.sleepVelocity * this.sleepVelocity, sleepAVel = this.sleepAngularVelocity * this.sleepAngularVelocity;
            if (sleepState === AWAKE && (sleepVel > vel || sleepAVel > aVel)) {
                this.sleepState = SLEEPY;
                this._timeLastSleepy = time;
            } else sleepState === SLEEPY && (vel > sleepVel || aVel > sleepAVel) ? this.wake() : sleepState === SLEEPY && time - this._timeLastSleepy > this.sleepyTimeLimit && this.sleep();
        }
    };
    return PRigidbody2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/collision/pbroadphase2d", [ "base/class", "math/vec2", "math/aabb2", "phys2d/bodies/pbody2d" ], function(Class, Vec2, AABB2, PBody2D) {
    /**
	 * @class Phys2D.PBroadphase2D
	 * @extends Class
	 * @brief 2D physics broad phase
	 */
    function PBroadphase2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Phys2D.PWorld2D world
	    * @brief use bounding radius for broad phase instead of aabb, defaults to false
	    * @memberof Phys2D.PBroadphase2D
	    */
        this.world = void 0;
        /**
	    * @property Boolean useBoundingRadius
	    * @brief use bounding radius for broad phase instead of aabb, defaults to false
	    * @memberof Phys2D.PBroadphase2D
	    */
        this.useBoundingRadius = void 0 !== opts.useBoundingRadius ? !!opts.useBoundingRadius : !0;
    }
    var needsTest, collisions, boundingRadiusBroadphase, AABBBroadphase, intersects = AABB2.intersects, STATIC = PBody2D.STATIC, KINEMATIC = (PBody2D.DYNAMIC, 
    PBody2D.KINEMATIC), SLEEPING = (PBody2D.AWAKE, PBody2D.SLEEPY, PBody2D.SLEEPING);
    Class.extend(PBroadphase2D, Class);
    /**
	 * @method needsTest
	 * @memberof Phys2D.PBroadphase2D
	 * @brief checks if bodies need to be checked against each other
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @return Boolean
	 */
    PBroadphase2D.prototype.needsTest = needsTest = function(bi, bj) {
        return !!(bi.motionState !== STATIC && bi.motionState !== KINEMATIC && bi.sleepState !== SLEEPING || bj.motionState !== STATIC && bj.motionState !== KINEMATIC && bj.sleepState !== SLEEPING);
    };
    /**
	 * @method collisions
	 * @memberof Phys2D.PBroadphase2D
	 * @brief gets all broad phase collisions to be checked by near phase
	 * @param PWorld2D world
	 */
    PBroadphase2D.prototype.collisions = collisions = function() {
        var bi, shapesi, bj, shapesj, shapesNumi, shapesNumj, i, j, k, l, world = this.world, useBoundingRadius = this.useBoundingRadius, pairsi = world.pairsi, pairsj = world.pairsj, bodies = world.bodies, count = bodies.length;
        pairsi.length = pairsj.length = 0;
        for (i = 0; count > i; i++) for (j = 0; j !== i; j++) {
            bi = bodies[i];
            bj = bodies[j];
            if (needsTest(bi, bj)) {
                shapesi = bi.shapes;
                shapesNumi = shapesi.length;
                shapesj = bj.shapes;
                shapesNumj = shapesj.length;
                if (shapesNumi && shapesNumj) for (k = shapesNumi; k--; ) for (l = shapesNumj; l--; ) useBoundingRadius ? boundingRadiusBroadphase(shapesi[k], shapesj[l], pairsi, pairsj) : AABBBroadphase(shapesi[k], shapesj[l], pairsi, pairsj);
            }
        }
    };
    /**
	 * @method boundingRadiusBroadphase
	 * @memberof Phys2D.PBroadphase2D
	 * @brief gets all broad phase collisions to be checked by near phase
	 * @param Phys2D.PShape2D si
	 * @param Phys2D.PShape2D sj
	 * @param Array pairsi
	 * @param Array pairsj
	 * @return Boolean
	 */
    PBroadphase2D.prototype.boundingRadiusBroadphase = boundingRadiusBroadphase = function() {
        var xi = new Vec2(), xj = new Vec2();
        return function(si, sj, pairsi, pairsj) {
            si.toWorld(xi);
            sj.toWorld(xj);
            var r = si.boundingRadius + sj.boundingRadius, dx = xj.x - xi.x, dy = xj.y - xi.y, d = dx * dx + dy * dy;
            if (r * r >= d) {
                pairsi.push(si);
                pairsj.push(sj);
            }
        };
    }();
    /**
	 * @method AABBBroadphase
	 * @memberof Phys2D.PBroadphase2D
	 * @brief does aabb broad phase
	 * @param Phys2D.PShape2D si
	 * @param Phys2D.PShape2D sj
	 * @param Array pairsi
	 * @param Array pairsj
	 */
    PBroadphase2D.prototype.AABBBroadphase = AABBBroadphase = function(si, sj, pairsi, pairsj) {
        if (intersects(si.aabb, sj.aabb)) {
            pairsi.push(si);
            pairsj.push(sj);
        }
    };
    return PBroadphase2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/collision/pcontact2d", [ "base/class", "math/vec2" ], function(Class, Vec2) {
    /**
	 * @class Phys2D.PContact2D
	 * @extends Class
	 * @brief 2D physics contact info
	 */
    function PContact2D() {
        Class.call(this);
        /**
	    * @property Phys2D.PBody2D bi
	    * @memberof Phys2D.PContact2D
	    */
        this.bi = void 0;
        /**
	    * @property Phys2D.PBody2D bj
	    * @memberof Phys2D.PContact2D
	    */
        this.bj = void 0;
        /**
	    * @property Vec2 n
	    * @memberof Phys2D.PContact2D
	    */
        this.n = new Vec2();
        /**
	    * @property Vec2 point
	    * @memberof Phys2D.PContact2D
	    */
        this.point = new Vec2();
    }
    Class.extend(PContact2D, Class);
    return PContact2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/collision/pnearphase2d", [ "base/class", "base/objectpool", "math/vec2", "math/aabb2", "phys2d/collision/pcontact2d", "phys2d/bodies/pbody2d" ], function(Class, ObjectPool, Vec2, AABB2, PContact2D) {
    /**
	 * @class Phys2D.PNearphase2D
	 * @extends Class
	 * @brief 2D physics near phase
	 */
    function PNearphase2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Phys2D.PWorld2D world
	    * @brief use bounding radius for broad phase instead of aabb, defaults to false
	    * @memberof Phys2D.PNearphase2D
	    */
        this.world = void 0;
    }
    var circleCircle, collisions, contactPool = (Math.sqrt, new ObjectPool(PContact2D));
    Class.extend(PNearphase2D, Class);
    /**
	 * @method circleCircle
	 * @memberof Phys2D.PNearphase2D
	 * @brief collide circle vs circle
	 * @param PWorld2D world
	 */
    PNearphase2D.prototype.circleCircle = circleCircle = function() {};
    /**
	 * @method collisions
	 * @memberof Phys2D.PNearphase2D
	 * @brief gets all contacts
	 * @param PWorld2D world
	 */
    PNearphase2D.prototype.collisions = collisions = function() {
        var bi, bj, si, sj, i, world = this.world, contacts = world.contacts, pairsi = world.pairsi, pairsj = world.pairsj;
        contactPool.clear();
        contacts.length = 0;
        for (i = pairsi.length; i--; ) {
            si = pairsi[i];
            sj = pairsj[i];
            if (si && sj) {
                bi = si.body;
                bj = sj.body;
            }
        }
    };
    return PNearphase2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/pworld2d", [ "base/class", "math/vec2", "phys2d/collision/pbroadphase2d", "phys2d/collision/pnearphase2d", "phys2d/bodies/pbody2d" ], function(Class, Vec2, PBroadphase2D, PNearphase2D, PBody2D) {
    /**
	 * @class Phys2D.PWorld2D
	 * @extends Class
	 * @brief 2D physics world
	 * @param Object opts sets Class properties from passed Object
	 */
    function PWorld2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Phys2D.PBroadphase2D broadphase
	    * @memberof Phys2D.PWorld2D
	    */
        this.broadphase = new PBroadphase2D(opts);
        this.broadphase.world = this;
        /**
	    * @property Phys2D.PNearphase2D nearphase
	    * @memberof Phys2D.PWorld2D
	    */
        this.nearphase = new PNearphase2D(opts);
        this.nearphase.world = this;
        /**
	    * @property Array bodies
	    * @memberof Phys2D.PWorld2D
	    */
        this.bodies = [];
        this._removeList = [];
        this._removeNeedsUpdate = !1;
        /**
	    * @property Array pairsi
	    * @memberof Phys2D.PWorld2D
	    */
        this.pairsi = [];
        /**
	    * @property Array pairsj
	    * @memberof Phys2D.PWorld2D
	    */
        this.pairsj = [];
        /**
	    * @property Array contacts
	    * @memberof Phys2D.PWorld2D
	    */
        this.contacts = [];
        /**
	    * @property Vec2 gravity
	    * @memberof Phys2D.PWorld2D
	    */
        this.gravity = opts.gravity || new Vec2(0, -9.801);
        /**
	    * @property Number time
	    * @memberof Phys2D.PWorld2D
	    */
        this.time = 0;
    }
    var pow = Math.pow, STATIC = PBody2D.STATIC, DYNAMIC = PBody2D.DYNAMIC, SLEEPING = (PBody2D.KINEMATIC, 
    PBody2D.AWAKE, PBody2D.SLEEPY, PBody2D.SLEEPING);
    (function() {
        var w = "undefined" != typeof window ? window : {}, performance = w.performance !== void 0 ? w.performance : {};
        performance.now = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
            return Date.now() - start;
        };
        return function() {
            return .001 * performance.now();
        };
    })();
    Class.extend(PWorld2D, Class);
    /**
	 * @method add
	 * @memberof Phys2D.PWorld2D
	 * @param PBody2D body
	 */
    PWorld2D.prototype.add = function(body) {
        if (body) {
            var bodies = this.bodies, index = bodies.indexOf(body);
            if (0 > index) {
                bodies.push(body);
                body.world = this;
            }
        } else console.warn(this + ".add: Body is not defined");
    };
    /**
	 * @method remove
	 * @memberof Phys2D.PWorld2D
	 * @param PBody2D body
	 */
    PWorld2D.prototype.remove = function(body) {
        if (body) {
            var bodies = this.bodies, index = bodies.indexOf(body);
            if (index > -1) {
                this._removeNeedsUpdate = !0;
                this._removeList.push(body);
            }
        } else console.warn(this + ".add: Body is not defined");
    };
    /**
	 * @method step
	 * @memberof Phys2D.PWorld2D
	 * @param Number delta
	 * @param NUmber dt
	 */
    PWorld2D.prototype.step = function() {
        var accumulator = 0;
        return function(delta, dt) {
            var body, shapes, motionState, pos, vel, linearDamping, aVel, force, mass, invMass, invI, i, j, bodies = this.bodies, removeList = this._removeList, gravity = this.gravity, gx = gravity.x, gy = gravity.y;
            accumulator += delta;
            for (;accumulator >= dt; ) {
                accumulator -= dt;
                this.time += dt;
                for (i = bodies.length; i--; ) {
                    body = bodies[i];
                    if (body.motionState === DYNAMIC) {
                        mass = body.mass;
                        force = body.force;
                        force.x = gx * mass;
                        force.y = gy * mass;
                    }
                }
                this.broadphase.collisions();
                this.nearphase.collisions();
                for (i = bodies.length; i--; ) {
                    body = bodies[i];
                    shapes = body.shapes;
                    motionState = body.motionState;
                    invMass = body.invMass;
                    invI = body.invI;
                    pos = body.position;
                    vel = body.velocity;
                    force = body.force;
                    linearDamping = body.linearDamping;
                    aVel = body.angularVelocity;
                    if (motionState !== STATIC) {
                        vel.x *= pow(1 - linearDamping.x, dt);
                        vel.y *= pow(1 - linearDamping.y, dt);
                        void 0 !== aVel && (body.angularVelocity *= pow(1 - body.angularDamping, dt));
                    }
                    if (motionState === DYNAMIC) {
                        vel.x += force.x * invMass * dt;
                        vel.y += force.y * invMass * dt;
                        void 0 !== aVel && (body.angularVelocity += body.torque * body.invI * dt);
                        if (body.sleepState !== SLEEPING) {
                            pos.x += vel.x * dt;
                            pos.y += vel.y * dt;
                            void 0 !== aVel && (body.rotation += body.angularVelocity * dt);
                            for (j = shapes.length; j--; ) shapes[j].calculateAABB();
                        }
                    }
                    force.x = force.y = 0;
                    void 0 !== aVel && (body.torque = 0);
                    body.sleepTick(this.time);
                }
            }
            if (this._removeNeedsUpdate) {
                this._removeNeedsUpdate = !1;
                for (i = removeList.length; i--; ) removeList.splice(i, 1);
            }
        };
    }();
    return PWorld2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("phys2d/phys2d", [ "require", "phys2d/bodies/pbody2d", "phys2d/bodies/prigidbody2d", "phys2d/collision/pbroadphase2d", "phys2d/collision/pcontact2d", "phys2d/collision/pnearphase2d", "phys2d/shapes/pcircle2d", "phys2d/shapes/pshape2d", "phys2d/pworld2d" ], function(require) {
    /**
	 * @class Phys2D
	 * @brief holds 2d physics classes
	 */
    var Phys2D = {};
    Phys2D.PBody2D = require("phys2d/bodies/pbody2d");
    Phys2D.PRigidbody2D = require("phys2d/bodies/prigidbody2d");
    Phys2D.PBroadphase2D = require("phys2d/collision/pbroadphase2d");
    Phys2D.PContact2D = require("phys2d/collision/pcontact2d");
    Phys2D.PNearphase2D = require("phys2d/collision/pnearphase2d");
    Phys2D.PCircle2D = require("phys2d/shapes/pcircle2d");
    Phys2D.PShape2D = require("phys2d/shapes/pshape2d");
    Phys2D.PWorld2D = require("phys2d/pworld2d");
    return Phys2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/rigidbody2d", [ "base/class", "phys2d/phys2d", "math/vec2", "core/components/component" ], function(Class, Phys2D, Vec2, Component) {
    /**
	 * @class Rigidbody2D
	 * @extends Component
	 * @brief 2D Rigid Body Component
	 * @param Object opts sets Class properties from passed Object
	 */
    function Rigidbody2D(opts) {
        opts || (opts = {});
        Component.call(this);
        /**
	    * @property PRigidbody2D body
	    * @brief reference to physics body
	    * @memberof Rigidbody2D
	    */
        this.body = new Phys2D.PRigidbody2D(opts);
    }
    Class.extend(Rigidbody2D, Component);
    /**
	 * @method init
	 * @memberof Rigidbody2D
	 * @brief called when added to GameObject
	 */
    Rigidbody2D.prototype.init = function() {
        var body = this.body, gameObject = (body.shapes, this.gameObject), transform = gameObject.transform2d || gameObject.transform3d, bpos = body.position, tpos = transform.position, trot = transform.rotation;
        bpos.x = tpos.x;
        bpos.y = tpos.y;
        body.rotation = trot;
    };
    /**
	 * @method update
	 * @memberof Rigidbody2D
	 * @brief called every frame
	 */
    Rigidbody2D.prototype.update = function() {
        var body = this.body, gameObject = this.gameObject, transform = gameObject.transform2d || gameObject.transform3d, bpos = body.position, brot = body.rotation, tpos = transform.position;
        tpos.x = bpos.x;
        tpos.y = bpos.y;
        transform.rotation = brot;
    };
    return Rigidbody2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/sprite2d", [ "base/class", "base/time", "math/vec2", "core/assets/assets", "core/components/sharedcomponent" ], function(Class, Time, Vec2, Assets, SharedComponent) {
    /**
	 * @class Sprite2D
	 * @extends SharedComponent
	 * @brief 2D Sprite Component
	 * @param Object opts sets Class properties from passed Object
	 */
    function Sprite2D(opts) {
        opts || (opts = {});
        SharedComponent.call(this);
        /**
	    * @property Boolean visible
	    * @brief is the sprite visible to the renderer
	    * @memberof Sprite2D
	    */
        this.visible = void 0 !== opts.visible ? !!opts.visible : !0;
        /**
	    * @property Number z
	    * @brief high numbers are rendered in front
	    * @memberof Sprite2D
	    */
        this.z = void 0 !== opts.z ? opts.z : 0;
        /**
	    * @property Number alpha
	    * @brief total alpha of sprite
	    * @memberof Sprite2D
	    */
        this.alpha = void 0 !== opts.alpha ? opts.alpha : 1;
        /**
	    * @property ImageAsset image
	    * @memberof Sprite2D
	    */
        this.image = void 0 !== opts.image ? opts.image : void 0;
        /**
	    * @property Number width
	    * @brief width of Sprite
	    * @memberof Sprite2D
	    */
        this.width = opts.width || 1;
        /**
	    * @property Number height
	    * @brief height of Sprite
	    * @memberof Sprite2D
	    */
        this.height = opts.height || 1;
        /**
	    * @property Number x
	    * @brief source x position of image
	    * @memberof Sprite2D
	    */
        this.x = opts.x || 0;
        /**
	    * @property Number y
	    * @brief source y position of image
	    * @memberof Sprite2D
	    */
        this.y = opts.y || 0;
        /**
	    * @property Number w
	    * @brief source width of image
	    * @memberof Sprite2D
	    */
        this.w = opts.w || 64;
        /**
	    * @property Number h
	    * @brief source height of image
	    * @memberof Sprite2D
	    */
        this.h = opts.h || 64;
        /**
	    * @property SpriteSheetAsset animations
	    * @brief { "name": [ frame1 [ x, y, w, h, frameTime in seconds ], frame2, frame3... ] }
	    * @memberof Sprite2D
	    */
        this.animations = opts.animations;
        /**
	    * @property String animation
	    * @brief active animation
	    * @memberof Sprite2D
	    */
        this.animation = "idle";
        /**
	    * @property Enum mode
	    * @brief animation playback type ( 0 - Sprite2D.ONCE, 1 - Sprite2D.LOOP, or 2 - Sprite2D.PINGPONG )
	    * @memberof Sprite2D
	    */
        this.mode = void 0 !== opts.mode ? opts.mode : Sprite2D.LOOP;
        /**
	    * @property Number rate
	    * @brief animation playback rate, defaults to 1
	    * @memberof Sprite2D
	    */
        this.rate = void 0 !== opts.rate ? opts.rate : 1;
        this._time = 0;
        this._frame = 0;
        this._order = 1;
        /**
	    * @property Boolean playing
	    * @brief is playing animation
	    * @memberof Sprite2D
	    */
        this.playing = this.animations ? !0 : !1;
    }
    Class.extend(Sprite2D, SharedComponent);
    /**
	 * @method play
	 * @memberof Sprite2D
	 * @brief plays animation with name and playback mode
	 * @param String name
	 * @param Enum mode
	 */
    Sprite2D.prototype.play = function(name, mode, rate) {
        if ((!this.playing || this.animation !== name) && this.animations[name]) {
            this.animation = name;
            this.rate = rate || this.rate;
            this.mode === Sprite2D.ONCE && (this._frame = 0);
            switch (mode) {
              case Sprite2D.PINGPONG:
              case "pingpong":
                this.mode = Sprite2D.PINGPONG;
                break;

              case Sprite2D.ONCE:
              case "once":
                this.mode = Sprite2D.ONCE;
                this._frame = 0;
                break;

              case Sprite2D.LOOP:
              case "loop":
              default:
                this.mode = Sprite2D.LOOP;
            }
            this.playing = !0;
            this.trigger("play", name);
        }
    };
    /**
	 * @method stop
	 * @memberof Sprite2D
	 * @brief stops animation
	 */
    Sprite2D.prototype.stop = function() {
        this.playing && this.trigger("stop");
        this.playing = !1;
    };
    /**
	 * @method update
	 * @memberof Sprite2D
	 * @brief called every frame
	 */
    Sprite2D.prototype.update = function() {
        var animations = this.animations, animation = animations && animations.data ? animations.data[this.animation] : void 0;
        if (animation) {
            var currentFrame, frame = this._frame, frames = animation.length - 1, order = this._order, mode = this.mode, currentFrame = animation[frame], frameTime = currentFrame[4];
            if (this.playing) {
                this._time += Time.delta * this.rate;
                if (this._time >= frameTime) {
                    this._time = 0;
                    if (currentFrame) {
                        this.x = currentFrame[0];
                        this.y = currentFrame[1];
                        this.w = currentFrame[2];
                        this.h = currentFrame[3];
                    }
                    mode === Sprite2D.PINGPONG ? 1 === order ? frame >= frames ? this._order = -1 : this._frame++ : 0 >= frame ? this._order = 1 : this._frame-- : frame >= frames ? mode === Sprite2D.LOOP ? this._frame = 0 : mode === Sprite2D.ONCE && this.stop() : this._frame++;
                }
            }
        }
    };
    Sprite2D.prototype.toJSON = function() {
        var json = this._JSON, image = this.image;
        json._class = this._class;
        json._SERVER_ID = this._id;
        json.image = image ? image.name : void 0;
        return json;
    };
    Sprite2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.image = json.image ? Assets.get(json.image) : void 0;
        return this;
    };
    Sprite2D.ONCE = 1;
    Sprite2D.LOOP = 2;
    Sprite2D.PINGPONG = 3;
    return Sprite2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/transform2d", [ "base/class", "math/mathf", "math/vec2", "math/mat32", "math/mat4", "core/components/sharedcomponent" ], function(Class, Mathf, Vec2, Mat32, Mat4, SharedComponent) {
    /**
	 * @class Transform2D
	 * @extends SharedComponent
	 * @brief position, rotation and scale of an object
	 * @param Object opts sets Class properties from passed Object
	 */
    function Transform2D(opts) {
        opts || (opts = {});
        SharedComponent.call(this);
        /**
	    * @property Transform2D root
	    * @brief reference to root transform
	    * @memberof Transform2D
	    */
        this.root = this;
        /**
	    * @property Array children
	    * @brief array of children attached to this object
	    * @memberof Transform2D
	    */
        this.children = [];
        /**
	    * @property Mat32 matrix
	    * @brief local matrix
	    * @memberof Transform2D
	    */
        this.matrix = new Mat32();
        /**
	    * @property Mat32 matrixWorld
	    * @brief world matrix
	    * @memberof Transform2D
	    */
        this.matrixWorld = new Mat32();
        /**
	    * @property Mat32 matrixModelView
	    * @brief model view matrix
	    * @memberof Transform2D
	    */
        this.matrixModelView = new Mat32();
        this._modelViewNeedsUpdate = !1;
        /**
	    * @property Vec2 position
	    * @brief local position
	    * @memberof Transform2D
	    */
        this.position = void 0 !== opts.position ? opts.position : new Vec2();
        /**
	    * @property Vec2 scale
	    * @brief local scale
	    * @memberof Transform2D
	    */
        this.scale = void 0 !== opts.scale ? opts.scale : new Vec2(1, 1);
        /**
	    * @property Number rotation
	    * @brief local rotation
	    * @memberof Transform2D
	    */
        this.rotation = void 0 !== opts.rotation ? opts.rotation : 0;
        opts.children && this.addChild.apply(this, opts.children);
    }
    var EPSILON = Mathf.EPSILON;
    Class.extend(Transform2D, SharedComponent);
    /**
	 * @method init
	 * @memberof Transform2D
	 * @brief called when added to GameObject
	 */
    Transform2D.prototype.init = function() {
        this.update();
    };
    /**
	 * @method update
	 * @memberof Transform2D
	 * @brief called every frame
	 */
    Transform2D.prototype.update = function() {
        var scale = this.scale, matrix = this.matrix, matrixWorld = this.matrixWorld;
        matrix.setRotation(this.rotation);
        (1 !== scale.x || 1 !== scale.y) && matrix.scale(scale);
        matrix.setTranslation(this.position);
        this.root === this ? matrixWorld.copy(matrix) : matrixWorld.mmul(this.parent.matrixWorld, matrix);
        this._modelViewNeedsUpdate = !0;
    };
    /**
	 * @method updateModelView
	 * @memberof Transform2D
	 * @brief updates model view matrix
	 * @param Camera2D camera
	 */
    Transform2D.prototype.updateModelView = function(camera) {
        if (this._modelViewNeedsUpdate) {
            this.matrixModelView.mmul(this.matrixWorld, camera.matrixWorldInv);
            this._modelViewNeedsUpdate = !1;
        }
    };
    /**
	 * @method toWorld
	 * @memberof Transform2D
	 * @brief converts vector from local to world coordinates
	 * @param Vec2 v
	 */
    Transform2D.prototype.toWorld = function(v) {
        return v.applyMat32(this.matrixWorld);
    };
    /**
	 * @method toLocal
	 * @memberof Transform2D
	 * @brief converts vector from world to local coordinates
	 * @param Vec2 v
	 */
    Transform2D.prototype.toLocal = function() {
        var mat = new Mat32();
        return function(v) {
            return v.applyMat32(mat.minv(this.matrixWorld));
        };
    }();
    /**
	 * @method translate
	 * @memberof Transform2D
	 * @brief translates Transform2D by translation relative to some object or if not set itself
	 * @param Vec2 translation
	 * @param Transform2D relativeTo
	 */
    Transform2D.prototype.translate = function() {
        var vec = new Vec2();
        return function(translation, relativeTo) {
            vec.copy(translation);
            relativeTo instanceof Transform2D ? vec.rotate(relativeTo.rotation) : relativeTo instanceof Number && vec.rotate(relativeTo);
            this.position.add(vec);
        };
    }();
    /**
	 * @method rotate
	 * @memberof Transform2D
	 * @brief rotates Transform2D by rotation relative to some object or if not set itself
	 * @param Number rotation
	 * @param Transform2D relativeTo
	 */
    Transform2D.prototype.rotate = function() {
        var vec = new Vec2();
        return function(rotation, relativeTo) {
            vec.copy(rotation);
            relativeTo instanceof Transform2D ? vec.rotate(relativeTo.rotation) : relativeTo instanceof Number && vec.rotate(relativeTo);
            this.rotation.rotate(vec.x, vec.y, vec.z);
        };
    }();
    /**
	 * @method scale
	 * @memberof Transform2D
	 * @brief scales Transform2D by scale relative to some object or if not set itself
	 * @param Vec2 scale
	 * @param Transform2D relativeTo
	 */
    Transform2D.prototype.scale = function() {
        var vec = new Vec2();
        return function(scale, relativeTo) {
            vec.copy(scale);
            relativeTo instanceof Transform2D ? vec.rotate(relativeTo.rotation) : relativeTo instanceof Number && vec.rotate(relativeTo);
            this.scale.mul(vec);
        };
    }();
    /**
	 * @method lookAt
	 * @memberof Transform2D
	 * @brief makes Transform2D look at another Transform2D or Vec2
	 * @param Vec2 target
	 * @param Vec2 up
	 */
    Transform2D.prototype.lookAt = function() {
        var vec = new Vec2(), mat = new Mat32();
        return function(target, up) {
            up = up instanceof Vec2 ? up : void 0;
            target instanceof Transform2D ? vec.copy(target.position) : target instanceof Vec2 && vec.copy(target);
            mat.lookAt(this.position, vec, up);
            this.rotation.setRotationMat32(mat);
        };
    }();
    /**
	 * @method follow
	 * @memberof Transform2D
	 * @brief makes Transform2D follow another Transform2D or Vec2
	 * @param Vec2 target
	 * @param Number damping
	 * @param Transform2D relativeTo
	 */
    Transform2D.prototype.follow = function() {
        var vec = new Vec2();
        return function(target, damping, relativeTo) {
            damping = damping > 0 ? damping : 1;
            target instanceof Transform2D ? vec.sub(target.position, this.position) : target instanceof Vec2 && vec.sub(target, this.position);
            vec.lenSq() > EPSILON && this.translate(vec.smul(1 / damping), relativeTo);
        };
    }();
    /**
	 * @method addChildren
	 * @memberof Transform2D
	 * @brief adds all Transform2Ds in arguments to children
	 */
    Transform2D.prototype.addChildren = function() {
        for (i = arguments.length; i--; ) this.addChild(arguments[i]);
    };
    /**
	 * @method addChild
	 * @memberof Transform2D
	 * @brief adds Transform2D to children
	 */
    Transform2D.prototype.addChild = function(transform) {
        if (transform) {
            var root, children = this.children, index = children.indexOf(transform);
            if (0 > index) {
                transform.parent && transform.parent.remove(transform);
                transform.parent = this;
                children.push(transform);
                root = this;
                for (;root.parent; ) root = root.parent;
                transform.root = root;
            } else console.warn(this + ".addTransform2D: Transform2D already has child " + transform);
        } else console.warn(this + ".addTransform2D: Transform2D is not defined");
    };
    /**
	 * @method add
	 * @memberof Transform2D
	 * @brief same as addChildren
	 */
    Transform2D.prototype.add = Transform2D.prototype.addChildren;
    /**
	 * @method removeChildren
	 * @memberof Transform2D
	 * @brief removes all Transform2Ds in arguments from children
	 */
    Transform2D.prototype.removeChildren = function() {
        for (i = arguments.length; i--; ) this.removeChildren(arguments[i]);
    };
    /**
	 * @method removeChild
	 * @memberof Transform2D
	 * @brief removes Transform2D from children
	 */
    Transform2D.prototype.removeChild = function(transform) {
        if (transform) {
            var root, children = this.children, index = children.indexOf(transform);
            if (index > -1) {
                transform.parent = void 0;
                children.splice(index, 1);
                root = this;
                for (;root.parent; ) root = root.parent;
                transform.root = root;
            } else console.warn(this + ".removeTransform2D: Transform2D does not have child " + transform);
        } else console.warn(this + ".removeTransform2D: Transform2D is not defined");
    };
    /**
	 * @method remove
	 * @memberof Transform2D
	 * @brief same as removeChildren
	 */
    Transform2D.prototype.remove = Transform2D.prototype.removeChildren;
    /**
	 * @method clear
	 * @memberof Transform2D
	 * @brief clears all data from transform and its children
	 */
    Transform2D.prototype.clear = function() {
        var child, i, children = this.children;
        for (i = children.length; i--; ) {
            child = children[i];
            child.children.length && child.clear();
            this.removeChild(child);
        }
    };
    Transform2D.prototype.clientSync = function(json) {
        this.position.copy(json.position);
        this.scale.copy(json.scale);
        this.rotation = json.rotation;
    };
    Transform2D.prototype.toJSON = function() {
        var json = this._JSON;
        json._class = this._class;
        json._SERVER_ID = this._id;
        json.position = this.position;
        json.scale = this.scale;
        json.rotation = this.rotation;
        return json;
    };
    Transform2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.position.copy(json.position);
        this.scale.copy(json.scale);
        this.rotation = json.rotation;
        return this;
    };
    return Transform2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/canvas", [ "base/class", "base/device", "base/dom" ], function(Class, Device, Dom) {
    /**
	 * @class Canvas
	 * @extends Class
	 * @brief HTML5 Canvas Element Helper, if width and height not passed sets dimensions to window's dimensions
	 * @param Number width the width of the Canvas in pixels
	 * @param Number height the height of the Cavnas in pixels
	 */
    function Canvas(width, height) {
        Class.call(this);
        /**
	    * @property String viewportId
	    * @brief id of window's viewport meta data
	    * @memberof Canvas
	    */
        this.viewportId = "viewport" + this._id;
        addMeta(this.viewportId, "viewport", "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
        addMeta(this.viewportId + "-width", "viewport", "width=device-width");
        addMeta(this.viewportId + "-height", "viewport", "height=device-height");
        /**
	    * @property Object element
	    * @brief reference to Canvas Element
	    * @memberof Canvas
	    */
        var element = document.createElement("canvas");
        this.element = element;
        /**
	    * @property Boolean fullScreen
	    * @brief if set to true canvas will adjust aspect to match screen 
	    * @memberof Canvas
	    */
        this.fullScreen = !1;
        /**
	    * @property Number width
	    * @brief the width of the Canvas Element
	    * @memberof Canvas
	    */
        this.width = 960;
        /**
	    * @property Number height
	    * @brief the height of the Canvas Element
	    * @memberof Canvas
	    */
        this.height = 640;
        if (width || height) {
            this.width = void 0 !== width ? width : 960;
            this.height = void 0 !== height ? height : 640;
        } else {
            this.fullScreen = !0;
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this._aspect = window.innerWidth / window.innerHeight;
        }
        this._width = this.width;
        this._height = this.height;
        this._aspect = this._width / this._height;
        element.style.position = "absolute";
        element.style.left = "50%";
        element.style.top = "50%";
        element.style.padding = "0px";
        element.style.margin = "0px";
        element.marginLeft = .5 * -this.width + "px";
        element.marginTop = .5 * -this.height + "px";
        element.style.width = Math.floor(this.width) + "px";
        element.style.height = Math.floor(this.height) + "px";
        element.width = this.width;
        element.height = this.height;
        /**
	    * @property Object aspect
	    * @brief aspect ratio ( width / height )
	    * @memberof Canvas
	    */
        this.aspect = this.width / this.height;
        element.oncontextmenu = function() {
            return !1;
        };
        document.body.appendChild(element);
        this.handleResize();
        addEvent(top, "resize orientationchange", this.handleResize, this);
    }
    var addMeta = Dom.addMeta, addEvent = Dom.addEvent;
    Class.extend(Canvas, Class);
    /**
	 * @method set
	 * @memberof Canvas
	 * @brief sets width and height of the Canvas Element
	 * @param Number width
	 * @param Number height
	 */
    Canvas.prototype.set = function(width, height) {
        if (width && height) {
            width = width;
            height = height;
            this.width = width;
            this.height = height;
            this.aspect = this.width / this.height;
            this.handleResize();
        } else console.warn("Canvas.set: no width and or height specified using default width and height");
    };
    Canvas.prototype.handleResize = function() {
        var width, height, element = this.element, elementStyle = element.style, w = window.innerWidth, h = window.innerHeight, pixelRatio = Device.pixelRatio, invPixelRatio = 1 / pixelRatio, aspect = w / h, id = "#" + this.viewportId, viewportScale = document.querySelector(id).getAttribute("content");
        if (this.fullScreen) {
            this.aspect = w / h;
            if (this.aspect >= this._aspect) {
                this.width = element.width = this._height * this.aspect;
                this.height = element.height = this._height;
            } else {
                this.width = element.width = this._width;
                this.height = element.height = this._width / this.aspect;
            }
            width = w;
            height = h;
        } else if (aspect >= this.aspect) {
            width = h * this.aspect;
            height = h;
        } else {
            width = w;
            height = w / this.aspect;
        }
        width *= invPixelRatio;
        height *= invPixelRatio;
        elementStyle.width = Math.floor(width) + "px";
        elementStyle.height = Math.floor(height) + "px";
        elementStyle.marginLeft = .5 * -width + "px";
        elementStyle.marginTop = .5 * -height + "px";
        document.querySelector(id).setAttribute("content", viewportScale.replace(/-scale\s*=\s*[.0-9]+/g, "-scale=" + pixelRatio));
        document.querySelector(id + "-width").setAttribute("content", "width=" + w);
        document.querySelector(id + "-height").setAttribute("content", "height=" + h);
        window.scrollTo(1, 1);
        this.trigger("resize");
    };
    return Canvas;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/renderers/canvasrenderer2d", [ "base/class", "base/dom", "base/device", "base/time", "core/canvas", "math/color", "math/mat32", "core/components/sprite2d" ], function(Class, Dom, Device, Time, Canvas, Color, Mat32) {
    /**
	 * @class CanvasRenderer2D
	 * @extends Class
	 * @brief Canvas 2D Renderer
	 * @param Object opts sets Class properties from passed Object
	 */
    function CanvasRenderer2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Number pixelRatio
	    * @brief ratio of pixels/meter
	    * @memberof WebGLRenderer2D
	    */
        this.pixelRatio = (void 0 !== opts.pixelRatio ? opts.pixelRatio : 128) * Device.pixelRatio;
        /**
	    * @property Canvas canvas
	    * @brief Canvas Class
	    * @memberof WebGLRenderer2D
	    */
        this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas(opts.width, opts.height);
        /**
	    * @property CanvasRenderingContext2D context
	    * @brief this Canvas's Context
	    * @memberof CanvasRenderer2D
	    */
        this.context = this.canvas.element.getContext("2d");
        /**
	    * @property Boolean autoClear
	    * @brief if true clears ever frame
	    * @memberof CanvasRenderer2D
	    */
        this.autoClear = void 0 !== opts.autoClear ? opts.autoClear : !0;
    }
    Class.extend(CanvasRenderer2D, Class);
    /**
	 * @method setClearColor
	 * @memberof CanvasRenderer2D
	 * @brief sets background color
	 * @param Color color color to set background too
	 */
    CanvasRenderer2D.prototype.setClearColor = function(color) {
        this.canvas.element.style.background = color ? color.hex() : "#000000";
    };
    /**
	 * @method clear
	 * @memberof CanvasRenderer2D
	 * @brief clears canvas
	 */
    CanvasRenderer2D.prototype.clear = function() {
        this.context.clearRect(-1, -1, 2, 2);
    };
    /**
	 * @method render
	 * @memberof CanvasRenderer2D
	 * @brief renders scene from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
    CanvasRenderer2D.prototype.render = function() {
        var lastScene, lastCamera, lastBackground = new Color();
        return function(scene, camera) {
            var self = this, ctx = this.context, background = scene.world.background;
            if (!lastBackground.equals(background)) {
                this.setClearColor(background);
                lastBackground.copy(background);
            }
            if (lastScene !== scene) {
                this.setClearColor(background);
                lastScene = scene;
            }
            if (lastCamera !== camera) {
                var canvas = this.canvas, ipr = 1 / this.pixelRatio, w = canvas.width * ipr, h = canvas.height * ipr, hw = .5 * canvas.width, hh = .5 * canvas.height;
                ctx.translate(hw, hh);
                ctx.scale(hw, hh);
                camera.width = w;
                camera.height = h;
                camera.clientWidth = canvas.width;
                camera.clientHeight = canvas.height;
                if (canvas.fullScreen) {
                    canvas.off("resize");
                    canvas.on("resize", function() {
                        var ipr = 1 / self.pixelRatio, w = this.width * ipr, h = this.height * ipr, hw = .5 * this.width, hh = .5 * this.height;
                        ctx.translate(hw, hh);
                        ctx.scale(hw, hh);
                        camera.width = w;
                        camera.height = h;
                        camera.clientWidth = this.width;
                        camera.clientHeight = this.height;
                    });
                }
                lastCamera = camera;
            }
            this.autoClear && this.clear();
            this.renderComponents(scene, camera);
        };
    }();
    /**
	 * @method renderComponents
	 * @memberof CanvasRenderer2D
	 * @brief renders scene's components from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
    CanvasRenderer2D.prototype.renderComponents = function() {
        var modelViewProj = new Mat32(), mvp = modelViewProj.elements;
        return function(scene, camera) {
            var sprite, transform, i, sprites = scene.sprite2d || emptyArray;
            for (i = sprites.length; i--; ) {
                sprite = sprites[i];
                transform = sprite.gameObject.transform2d;
                if (transform && sprite.visible) {
                    transform.updateModelView(camera);
                    modelViewProj.mmul(transform.matrixModelView, camera.matrixProj);
                    this.renderSprite(sprite, mvp);
                }
            }
        };
    }();
    CanvasRenderer2D.prototype.renderSprite = function(sprite, mvp) {
        var image, ctx = this.context, imageAsset = sprite.image;
        if (imageAsset) {
            image = imageAsset.data;
            ctx.save();
            ctx.transform(mvp[0], -mvp[2], -mvp[1], mvp[3], mvp[4], mvp[5]);
            ctx.scale(1, -1);
            ctx.globalAlpha = sprite.alpha;
            ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h, sprite.width * -.5, sprite.height * -.5, sprite.width, sprite.height);
            ctx.restore();
        } else console.warn(this + ".renderSprite: can't render sprite without an ImageAsset");
    };
    return CanvasRenderer2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/renderers/webglrenderer2d", [ "base/class", "base/dom", "base/device", "core/canvas", "math/mathf", "math/color", "math/mat32", "math/mat4", "core/components/sprite2d" ], function(Class, Dom, Device, Canvas, Mathf, Color, Mat32, Mat4, Sprite2D) {
    function parseUniformsAttributes(gl, shader) {
        var matchAttributes, matchUniforms, name, length, line, i, j, src = shader.vertexShader + shader.fragmentShader, lines = src.split("\n");
        for (i = lines.length; i--; ) {
            line = lines[i];
            matchAttributes = line.match(regAttribute);
            matchUniforms = line.match(regUniform);
            if (matchAttributes) {
                name = matchAttributes[3];
                shader.attributes[name] = gl.getAttribLocation(shader.program, name);
            }
            if (matchUniforms) {
                name = matchUniforms[3];
                length = parseInt(matchUniforms[5]);
                if (length) {
                    shader.uniforms[name] = [];
                    for (j = length; j--; ) shader.uniforms[name][j] = gl.getUniformLocation(shader.program, name + "[" + j + "]");
                } else shader.uniforms[name] = gl.getUniformLocation(shader.program, name);
            }
        }
    }
    function buildTexture(renderer, imageAsset) {
        if (imageAsset.glData.needsUpdate) {
            var gl = renderer.context, assetGLData = (renderer.gpu, renderer.ext, imageAsset.glData), image = imageAsset.data, texture = gl.createTexture(), isPOT = isPowerOfTwo(image.width) && isPowerOfTwo(image.height), TEXTURE_2D = gl.TEXTURE_2D, MAG_FILTER = gl.LINEAR, MIN_FILTER = isPOT ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR, WRAP = isPOT ? gl.REPEAT : gl.CLAMP_TO_EDGE, RGBA = gl.RGBA;
            gl.bindTexture(TEXTURE_2D, texture);
            gl.texImage2D(TEXTURE_2D, 0, RGBA, RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MAG_FILTER, MAG_FILTER);
            gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MIN_FILTER, MIN_FILTER);
            gl.texParameteri(TEXTURE_2D, gl.TEXTURE_WRAP_S, WRAP);
            gl.texParameteri(TEXTURE_2D, gl.TEXTURE_WRAP_T, WRAP);
            isPOT && gl.generateMipmap(TEXTURE_2D);
            gl.bindTexture(TEXTURE_2D, null);
            assetGLData.texture = texture;
            assetGLData.needsUpdate = !1;
        }
    }
    function spriteVertexShader(precision) {
        return [ "precision " + precision + " float;", "uniform mat4 uMatrix;", "uniform vec4 uCrop;", "uniform vec2 uScale;", "attribute vec2 aVertexPosition;", "attribute vec2 aVertexUv;", "varying vec2 vVertexUv;", "void main(){", "vVertexUv = vec2( aVertexUv.x * uCrop.z, aVertexUv.y * uCrop.w ) + uCrop.xy;", "gl_Position = uMatrix * vec4( aVertexPosition * uScale, 0.0, 1.0 );", "}" ].join("\n");
    }
    function spriteFragmentShader(precision) {
        return [ "precision " + precision + " float;", "uniform float uAlpha;", "uniform sampler2D uTexture;", "varying vec2 vVertexUv;", "void main(){", "vec4 finalColor = texture2D( uTexture, vVertexUv );", "finalColor.w *= uAlpha;", "gl_FragColor = finalColor;", "}" ].join("\n");
    }
    /**
	 * @class WebGLRenderer2D
	 * @extends Class
	 * @brief WebGL 2D Renderer
	 * @param Object opts sets Class properties from passed Object
	 */
    function WebGLRenderer2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Number pixelRatio
	    * @brief ratio of pixels/meter
	    * @memberof WebGLRenderer2D
	    */
        this.pixelRatio = (void 0 !== opts.pixelRatio ? opts.pixelRatio : 128) * Device.pixelRatio;
        /**
	    * @property Canvas canvas
	    * @brief Canvas Class
	    * @memberof WebGLRenderer2D
	    */
        this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas(opts.width, opts.height);
        /**
	    * @property WebGLRenderingContext context
	    * @brief this Canvas's Context
	    * @memberof WebGLRenderer2D
	    */
        opts.attributes || (opts.attributes = {});
        opts.attributes.depth = !1;
        this.context = Dom.getWebGLContext(this.canvas.element, opts.attributes);
        /**
	    * @property Boolean autoClear
	    * @brief if true clears ever frame
	    * @memberof WebGLRenderer2D
	    */
        this.autoClear = void 0 !== opts.autoClear ? opts.autoClear : !0;
        /**
	    * @property Object ext
	    * @brief WebGL extension's data
	    * @memberof WebGLRenderer2D
	    */
        this.ext = {
            texture_filter_anisotropic: void 0,
            texture_float: void 0,
            standard_derivatives: void 0,
            compressed_texture_s3tc: void 0
        };
        /**
	    * @property Object gpu
	    * @brief user's gpu information
	    * @memberof WebGLRenderer2D
	    */
        this.gpu = {
            precision: "highp",
            maxAnisotropy: 16,
            maxTextures: 16,
            maxTextureSize: 16384,
            maxCubeTextureSize: 16384,
            maxRenderBufferSize: 16384
        };
        this.glData = {
            sprite: {
                vertexBuffer: void 0,
                indexBuffer: void 0,
                uvBuffer: void 0,
                vertexShader: void 0,
                fragmentShader: void 0,
                program: void 0,
                uniforms: {},
                attributes: {}
            }
        };
        this.setDefault();
    }
    var createProgram = Dom.createProgram, isPowerOfTwo = Mathf.isPowerOfTwo, regAttribute = (Mathf.toPowerOfTwo, 
    /attribute\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/), regUniform = /uniform\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/;
    Class.extend(WebGLRenderer2D, Class);
    WebGLRenderer2D.prototype.getExtensions = function() {
        var gl = this.context, ext = this.ext, texture_filter_anisotropic = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic"), compressed_texture_s3tc = gl.getExtension("WEBGL_compressed_texture_s3tc") || gl.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"), standard_derivatives = gl.getExtension("OES_standard_derivatives"), texture_float = gl.getExtension("OES_texture_float");
        ext.texture_filter_anisotropic = texture_filter_anisotropic;
        ext.standard_derivatives = standard_derivatives;
        ext.texture_float = texture_float;
        ext.compressed_texture_s3tc = compressed_texture_s3tc;
    };
    WebGLRenderer2D.prototype.getGPUCapabilities = function() {
        var gl = this.context, gpu = this.gpu, ext = this.ext, VERTEX_SHADER = gl.VERTEX_SHADER, FRAGMENT_SHADER = gl.FRAGMENT_SHADER, HIGH_FLOAT = gl.HIGH_FLOAT, MEDIUM_FLOAT = gl.MEDIUM_FLOAT, shaderPrecision = (gl.LOW_FLOAT, 
        gl.getShaderPrecisionFormat !== void 0), maxAnisotropy = ext.texture_filter_anisotropic ? gl.getParameter(ext.texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1, maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE), maxCubeTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE), maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), vsHighpFloat = shaderPrecision ? gl.getShaderPrecisionFormat(VERTEX_SHADER, HIGH_FLOAT) : 0, vsMediumpFloat = shaderPrecision ? gl.getShaderPrecisionFormat(VERTEX_SHADER, MEDIUM_FLOAT) : 23, fsHighpFloat = shaderPrecision ? gl.getShaderPrecisionFormat(FRAGMENT_SHADER, HIGH_FLOAT) : 0, fsMediumpFloat = shaderPrecision ? gl.getShaderPrecisionFormat(FRAGMENT_SHADER, MEDIUM_FLOAT) : 23, highpAvailable = vsHighpFloat.precision > 0 && fsHighpFloat.precision > 0, mediumpAvailable = vsMediumpFloat.precision > 0 && fsMediumpFloat.precision > 0, precision = "highp";
        (!highpAvailable || Device.mobile) && (precision = mediumpAvailable ? "mediump" : "lowp");
        gpu.precision = precision;
        gpu.maxAnisotropy = maxAnisotropy;
        gpu.maxTextures = maxTextures;
        gpu.maxTextureSize = maxTextureSize;
        gpu.maxCubeTextureSize = maxCubeTextureSize;
        gpu.maxRenderBufferSize = maxRenderBufferSize;
    };
    /**
	 * @method setDefault
	 * @memberof WebGLRenderer2D
	 * @brief sets WebGL context to default settings
	 */
    WebGLRenderer2D.prototype.setDefault = function() {
        var spriteVertices = new Float32Array([ 1, 1, -1, 1, -1, -1, 1, -1 ]), spriteUvs = new Float32Array([ 1, 0, 0, 0, 0, 1, 1, 1 ]), spriteIndices = new Uint16Array([ 0, 1, 2, 0, 2, 3 ]);
        return function() {
            var precision, gl = this.context, glData = this.glData, gpu = this.gpu, sprite = (glData.particle, 
            glData.sprite);
            this.getExtensions();
            this.getGPUCapabilities();
            precision = gpu.precision;
            gl.clearColor(0, 0, 0, 1);
            gl.clearDepth(0);
            gl.clearStencil(0);
            gl.frontFace(gl.CCW);
            gl.cullFace(gl.BACK);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.BLEND);
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            sprite.vertexBuffer = sprite.vertexBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, sprite.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, spriteVertices, gl.STATIC_DRAW);
            sprite.uvBuffer = sprite.uvBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, sprite.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, spriteUvs, gl.STATIC_DRAW);
            sprite.indexBuffer = sprite.indexBuffer || gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sprite.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, spriteIndices, gl.STATIC_DRAW);
            sprite.vertexShader = spriteVertexShader(precision);
            sprite.fragmentShader = spriteFragmentShader(precision);
            sprite.program = createProgram(gl, sprite.vertexShader, sprite.fragmentShader);
            parseUniformsAttributes(gl, sprite);
        };
    }();
    /**
	 * @method setClearColor
	 * @memberof WebGLRenderer2D
	 * @brief sets background color
	 * @param Color color color to set background too
	 */
    WebGLRenderer2D.prototype.setClearColor = function(color) {
        color ? this.context.clearColor(color.r, color.g, color.b, color.a) : this.context.clearColor(0, 0, 0, 1);
    };
    /**
	 * @method clear
	 * @memberof WebGLRenderer2D
	 * @brief clears canvas
	 */
    WebGLRenderer2D.prototype.clear = function() {
        var gl = this.context;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    };
    /**
	 * @method setBlending
	 * @memberof WebGLRenderer2D
	 * @brief sets webgl blending mode( empty - default, 0 - none, 1 - additive, 2 - subtractive, or 3 - multiply  )
	 * @param Number blending 
	 */
    WebGLRenderer2D.prototype.setBlending = function() {
        var lastBlending, gl;
        return function(blending) {
            gl = this.context;
            if (blending !== lastBlending) {
                switch (blending) {
                  case WebGLRenderer2D.none:
                    gl.disable(gl.BLEND);
                    break;

                  case WebGLRenderer2D.additive:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                    break;

                  case WebGLRenderer2D.subtractive:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
                    break;

                  case WebGLRenderer2D.multiply:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
                    break;

                  default:
                    gl.enable(gl.BLEND);
                    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }
                lastBlending = blending;
            }
        };
    }();
    /**
	 * @method setLineWidth
	 * @memberof WebGLRenderer2D
	 * @brief sets webgl line width
	 * @param Number width 
	 */
    WebGLRenderer2D.prototype.setLineWidth = function() {
        var lastLineWidth = 1;
        return function(width) {
            if (width !== lastLineWidth) {
                this.context.lineWidth(width * this.pixelRatio);
                lastLineWidth = width;
            }
        };
    }();
    /**
	 * @method render
	 * @memberof WebGLRenderer2D
	 * @brief renders scene from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
    WebGLRenderer2D.prototype.render = function() {
        var lastScene, lastCamera, lastBackground = new Color();
        return function(scene, camera) {
            var self = this, gl = this.context, background = scene.world.background;
            if (!lastBackground.equals(background)) {
                this.setClearColor(background);
                lastBackground.copy(background);
            }
            if (lastScene !== scene) {
                this.setClearColor(background);
                lastScene = scene;
            }
            if (lastCamera !== camera) {
                var canvas = this.canvas, ipr = 1 / this.pixelRatio, w = canvas.width * ipr, h = canvas.height * ipr;
                camera.width = w;
                camera.height = h;
                camera.clientWidth = canvas.width;
                camera.clientHeight = canvas.height;
                gl.viewport(0, 0, canvas.width, canvas.height);
                if (canvas.fullScreen) {
                    canvas.off("resize");
                    canvas.on("resize", function() {
                        var ipr = 1 / self.pixelRatio, w = this.width * ipr, h = this.height * ipr;
                        camera.width = w;
                        camera.height = h;
                        camera.clientWidth = this.width;
                        camera.clientHeight = this.height;
                        gl.viewport(0, 0, this.width, this.height);
                    });
                }
                lastCamera = camera;
            }
            this.autoClear && this.clear();
            this.renderComponents(scene, camera);
        };
    }();
    var lastComponent;
    /**
	 * @method renderComponents
	 * @memberof WebGLRenderer2D
	 * @brief renders scene's components from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
    WebGLRenderer2D.prototype.renderComponents = function() {
        var emptyArray = [], modelView = new Mat4(), modelViewProj = new Mat4(), mvp = modelViewProj.elements;
        return function(scene, camera) {
            var sprite, transform, i, sprites = (this.context, scene.sprite2d || emptyArray);
            for (i = sprites.length; i--; ) {
                sprite = sprites[i];
                transform = sprite.gameObject.transform2d;
                if (transform && sprite.visible) {
                    transform.updateModelView(camera);
                    modelView.fromMat32(transform.matrixModelView);
                    modelViewProj.mmul(camera._matrixProj4, modelView);
                    this.renderSprite(sprite, mvp);
                }
            }
        };
    }();
    WebGLRenderer2D.prototype.renderSprite = function(sprite, mvp) {
        var texture, image, width, height, w, h, gl = this.context, glData = this.glData, glSprite = glData.sprite, attributes = glSprite.attributes, uniforms = glSprite.uniforms, imageAsset = sprite.image, alpha = sprite.alpha;
        if (!(lastComponent instanceof Sprite2D)) {
            gl.useProgram(glSprite.program);
            gl.bindBuffer(gl.ARRAY_BUFFER, glSprite.vertexBuffer);
            gl.enableVertexAttribArray(attributes.aVertexPosition);
            gl.vertexAttribPointer(attributes.aVertexPosition, 2, gl.FLOAT, !1, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, glSprite.uvBuffer);
            gl.enableVertexAttribArray(attributes.aVertexUv);
            gl.vertexAttribPointer(attributes.aVertexUv, 2, gl.FLOAT, !1, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSprite.indexBuffer);
        }
        if (imageAsset) {
            buildTexture(this, imageAsset);
            texture = imageAsset.glData.texture;
            image = imageAsset.data;
            width = sprite.width;
            height = sprite.height;
            w = 1 / image.width;
            h = 1 / image.height;
            gl.uniformMatrix4fv(uniforms.uMatrix, !1, mvp);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(uniforms.uTexture, 0);
            gl.uniform4f(uniforms.uCrop, sprite.x * w, sprite.y * h, sprite.w * w, sprite.h * h);
            gl.uniform1f(uniforms.uAlpha, alpha);
            gl.uniform2f(uniforms.uScale, .5 * width, .5 * height);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            lastComponent = sprite;
        } else console.warn(this + ".renderSprite: can't render sprite without an ImageAsset");
    };
    WebGLRenderer2D.none = 0;
    WebGLRenderer2D.additive = 1;
    WebGLRenderer2D.subtractive = 2;
    WebGLRenderer2D.multiply = 3;
    return WebGLRenderer2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/world/world", [ "base/class", "math/color" ], function(Class, Color) {
    /**
	 * @class World
	 * @extends Class
	 * @brief base class for holding Scene's world data
	 * @param Object opts sets Class properties from passed Object
	 */
    function World(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Color background
	    * @brief background color of scene
	    * @memberof World
	    */
        this.background = void 0 !== opts.color ? opts.color : new Color(.5, .5, .5, 1);
    }
    Class.extend(World, Class);
    /**
	 * @method add
	 * @memberof World
	 * @brief adds body to physics world
	 * @param Component component
	 */
    World.prototype.add = function() {};
    /**
	 * @method remove
	 * @memberof World
	 * @brief removes body from physics world
	 * @param Component component
	 */
    World.prototype.remove = function() {};
    /**
	 * @method update
	 * @memberof World
	 * @brief called every frame
	 */
    World.prototype.update = function() {};
    return World;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/axis", [], function() {
    /**
	 * @class Axis
	 * @extends Class
	 * @brief map each axis to two buttons on a joystick, mouse, or keyboard keys
	 */
    function Axis(opts) {
        opts || (opts = {});
        /**
	    * @property String name
	    * @memberof Axis
	    */
        this.name = void 0 !== opts.name ? opts.name : "unknown";
        /**
	    * @property String negButton
	    * @memberof Axis
	    */
        this.negButton = void 0 !== opts.negButton ? opts.negButton : "";
        /**
	    * @property String posButton
	    * @memberof Axis
	    */
        this.posButton = void 0 !== opts.posButton ? opts.posButton : "";
        /**
	    * @property String altNegButton
	    * @memberof Axis
	    */
        this.altNegButton = void 0 !== opts.altNegButton ? opts.altNegButton : "";
        /**
	    * @property String altPosButton
	    * @memberof Axis
	    */
        this.altPosButton = void 0 !== opts.altPosButton ? opts.altPosButton : "";
        /**
	    * @property Number gravity
	    * @memberof Axis
	    */
        this.gravity = void 0 !== opts.gravity ? opts.gravity : 3;
        /**
	    * @property Number dead
	    * @memberof Axis
	    */
        this.dead = void 0 !== opts.dead ? opts.dead : .001;
        /**
	    * @property Number sensitivity
	    * @memberof Axis
	    */
        this.sensitivity = void 0 !== opts.sensitivity ? opts.sensitivity : 3;
        /**
	    * @property Enum type
	    * @memberof Axis
	    */
        this.type = void 0 !== opts.type ? opts.type : -1;
        /**
	    * @property Number axis
	    * @memberof Axis
	    */
        this.axis = void 0 !== opts.axis ? opts.axis : "x";
        /**
	    * @property Number joyNum
	    * @memberof Axis
	    */
        this.joyNum = void 0 !== opts.joyNum ? opts.joyNum : 0;
        /**
	    * @property Number value
	    * @memberof Axis
	    */
        this.value = 0;
    }
    Axis.BUTTON = 1;
    Axis.MOUSE = 2;
    Axis.MOUSE_WHEEL = 3;
    return Axis;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/client", [ "base/class", "base/time", "math/mathf", "core/input/axis" ], function(Class, Time, Mathf, Axis) {
    /**
	 * @class Client
	 * @extends Class
	 * @brief client information used by ServerGame
	 * @param Object opts sets Class properties from passed Object
	 */
    function Client(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Number id
	    * @brief unique id of this client
	    * @memberof Client
	    */
        this.id = opts.id;
        /**
	    * @property Object socket
	    * @brief reference to this client's socket
	    * @memberof Client
	    */
        this.socket = opts.socket;
        /**
	    * @property Device device
	    * @brief clients device information
	    * @memberof Client
	    */
        this.device = opts.device;
        /**
	    * @property ServerGame game
	    * @brief reference to game
	    * @memberof Client
	    */
        this.game = opts.game;
        /**
	    * @property Scene scene
	    * @brief clients active scene 
	    * @memberof Client
	    */
        this.scene = void 0;
        /**
	    * @property Camera camera
	    * @brief clients active camera 
	    * @memberof Client
	    */
        this.camera = void 0;
        /**
	    * @property Object userData
	    * @brief custom data for client
	    * @memberof Client
	    */
        this.userData = {};
        /**
	    * @property Number lag
	    * @memberof Client
	    */
        this.lag = 0;
        /**
	    * @property Input Input
	    * @memberof Client
	    */
        this.Input = {
            buttons: {},
            mousePosition: new Vec2(),
            mouseDelta: new Vec2(),
            mouseWheel: 0,
            axes: {}
        };
        this.addAxis({
            name: "horizontal",
            posButton: "right",
            negButton: "left",
            altPosButton: "d",
            altNegButton: "a",
            type: Axis.BUTTON
        });
        this.addAxis({
            name: "vertical",
            posButton: "up",
            negButton: "down",
            altPosButton: "w",
            altNegButton: "s",
            type: Axis.BUTTON
        });
        this.addAxis({
            name: "fire",
            posButton: "ctrl",
            negButton: "",
            altPosButton: "mouse0",
            altNegButton: "",
            type: Axis.BUTTON
        });
        this.addAxis({
            name: "jump",
            posButton: "space",
            negButton: "",
            altPosButton: "mouse2",
            altNegButton: "",
            type: Axis.BUTTON
        });
        this.addAxis({
            name: "mouseX",
            type: Axis.MOUSE,
            axis: "x"
        });
        this.addAxis({
            name: "mouseY",
            type: Axis.MOUSE,
            axis: "y"
        });
        this.addAxis({
            name: "mouseWheel",
            gravity: 5,
            type: Axis.MOUSE_WHEEL
        });
    }
    var abs = (Math.min, Math.max, Math.abs), sign = Mathf.sign, clamp = Mathf.clamp;
    Mathf.equals;
    Class.extend(Client, Class);
    /**
	 * @method addAxis
	 * @memberof Client
	 * @brief adds new axis to Input.axes
	 * @param Object opts
	 */
    Client.prototype.addAxis = function(opts) {
        this.Input.axes[opts.name] = new Axis(opts);
    };
    /**
	 * @method axis
	 * @memberof Client
	 * @brief returns the value of the virtual axis identified by axisName
	 * @param String axisName
	 */
    Client.prototype.axis = function(axisName) {
        var axis = this.Input.axes[axisName];
        return axis && axis.value || 0;
    };
    /**
	 * @method mouseButton
	 * @memberof Client
	 * @brief returns whether the given mouse button is held down
	 * @param Number buttonNum
	 */
    Client.prototype.mouseButton = function(buttonNum) {
        var button = this.Input.buttons["mouse" + buttonNum];
        return button && button.value;
    };
    /**
	 * @method mouseButtonDown
	 * @memberof Client
	 * @brief returns true during the frame the user pressed the given mouse button
	 * @param Number buttonNum
	 */
    Client.prototype.mouseButtonDown = function(buttonNum) {
        var button = this.Input.buttons["mouse" + buttonNum];
        return button && button.value && button.frameDown >= Time.frameCount;
    };
    /**
	 * @method mouseButtonUp
	 * @memberof Client
	 * @brief returns true during the frame the user releases the given mouse button
	 * @param Number buttonNum
	 */
    Client.prototype.mouseButtonUp = function(buttonNum) {
        var button = this.Input.buttons["mouse" + buttonNum];
        return button && button.frameUp >= Time.frameCount;
    };
    /**
	 * @method key
	 * @memberof Client
	 * @brief returns true while the user holds down the key identified by name
	 * @param String name
	 */
    Client.prototype.key = function(name) {
        var button = this.Input.buttons[name];
        return button && button.value;
    };
    /**
	 * @method keyDown
	 * @memberof Client
	 * @brief returns true during the frame the user starts pressing down the key identified by name
	 * @param String name
	 */
    Client.prototype.keyDown = function(name) {
        var button = this.Input.buttons[name];
        return button && button.value && button.frameDown >= Time.frameCount;
    };
    /**
	 * @method keyUp
	 * @memberof Client
	 * @brief returns true during the frame the user releases the key identified by name
	 * @param String name
	 */
    Client.prototype.keyUp = function(name) {
        var button = this.Input.buttons[name];
        return button && button.frameUp >= Time.frameCount;
    };
    /**
	 * @method update
	 * @memberof Client
	 * @brief called ever frame
	 */
    Client.prototype.update = function() {
        var button, altButton, name, axis, value, pos, neg, tmp, Input = this.Input, axes = Input.axes, buttons = Input.buttons, dt = Time.delta;
        for (name in axes) {
            axis = axes[name];
            value = axis.value;
            switch (axis.type) {
              case Axis.BUTTON:
                button = buttons[axis.negButton];
                altButton = buttons[axis.altNegButton];
                neg = button && button.value || altButton && altButton.value;
                button = buttons[axis.posButton];
                altButton = buttons[axis.altPosButton];
                pos = button && button.value || altButton && altButton.value;
                break;

              case Axis.MOUSE:
                axis.value = Input.mouseDelta[axis.axis];
                continue;

              case Axis.MOUSE_WHEEL:
                value += Input.mouseWheel;
            }
            neg && (value -= axis.sensitivity * dt);
            pos && (value += axis.sensitivity * dt);
            if (!pos && !neg) {
                tmp = abs(value);
                value -= clamp(sign(value) * axis.gravity * dt, -tmp, tmp);
            }
            value = clamp(value, -1, 1);
            abs(value) <= axis.dead && (value = 0);
            axis.value = value;
        }
        Input.mouseWheel = 0;
    };
    /**
	 * @method setScene
	 * @memberof Client
	 * @brief sets client's active scene
	 * @param Scene scene
	 */
    Client.prototype.setScene = function(scene) {
        this.game ? this.game.setScene(this, scene) : console.warn(this + ".setScene: Client is not a member of a ServerGame");
    };
    /**
	 * @method setCamera
	 * @memberof Client
	 * @brief sets client's active camera from gameObjects camera2d or camera3d component
	 * @param GameObject gameObject
	 */
    Client.prototype.setCamera = function(gameObject) {
        this.game ? this.game.setCamera(this, gameObject) : console.warn(this + ".setCamera: Client is not a member of a ServerGame");
    };
    return Client;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/buttons", [ "base/class", "base/time" ], function(Class, Time) {
    function Button() {
        this.timeDown = -1;
        this.timeUp = -1;
        this.frameDown = -1;
        this.frameUp = -1;
        this.value = !1;
        this._first = !0;
    }
    function Buttons() {
        this.list = {
            mouse0: new Button(),
            mouse1: new Button(),
            mouse2: new Button()
        };
    }
    Buttons.prototype.on = function(name) {
        this.list[name] || (this.list[name] = new Button());
        var button = this.list[name];
        if (button) {
            if (button._first) {
                button.frameDown = Time.frameCount + 1;
                button.timeDown = Time.stamp();
                button._first = !1;
            }
            button.value = !0;
        }
    };
    Buttons.prototype.off = function(name) {
        var button = this.list[name];
        if (button) {
            button.frameUp = Time.frameCount + 1;
            button.timeUp = Time.stamp();
            button._first = !0;
            button.value = !1;
        }
    };
    return new Buttons();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/input", [ "base/class", "base/dom", "base/time", "math/mathf", "math/vec2", "math/vec3", "core/sharedobject", "core/input/axis", "core/input/buttons" ], function(Class, Dom, Time, Mathf, Vec2, Vec3, SharedObject, Axis, Buttons) {
    /**
	 * @class Input
	 * @extends SharedObject
	 * @brief Input Mananger
	 */
    function Input() {
        SharedObject.call(this);
        /**
	    * @property HTMLElement element
	    * @brief DOM Element events are attached to
	    * @memberof Input
	    */
        this.element = void 0;
        /**
	    * @property Object buttons
	    * @brief list of all buttons in use
	    * @memberof Input
	    */
        this.buttons = Buttons;
        /**
	    * @property Vec2 mousePosition
	    * @brief mouse current position
	    * @memberof Input
	    */
        this.mousePosition = new Vec2();
        /**
	    * @property Vec2 mouseDelta
	    * @brief mouse delta position
	    * @memberof Input
	    */
        this.mouseDelta = new Vec2();
        /**
	    * @property Object axes
	    * @brief list of axes in use
	    * @memberof Input
	    */
        this.axes = {};
        this.addAxis({
            name: "horizontal",
            posButton: "right",
            negButton: "left",
            altPosButton: "d",
            altNegButton: "a",
            type: Axis.BUTTON
        });
        this.addAxis({
            name: "vertical",
            posButton: "up",
            negButton: "down",
            altPosButton: "w",
            altNegButton: "s",
            type: Axis.BUTTON
        });
        this.addAxis({
            name: "fire",
            posButton: "ctrl",
            negButton: "",
            altPosButton: "mouse0",
            altNegButton: "",
            type: Axis.BUTTON
        });
        this.addAxis({
            name: "jump",
            posButton: "space",
            negButton: "",
            altPosButton: "mouse2",
            altNegButton: "",
            type: Axis.BUTTON
        });
        this.addAxis({
            name: "mouseX",
            type: Axis.MOUSE,
            axis: "x"
        });
        this.addAxis({
            name: "mouseY",
            type: Axis.MOUSE,
            axis: "y"
        });
        this.addAxis({
            name: "mouseWheel",
            gravity: 5,
            type: Axis.MOUSE_WHEEL
        });
    }
    function handleMouse(e) {
        e.preventDefault();
        switch (e.type) {
          case "mousedown":
            Buttons.on("mouse" + e.button);
            break;

          case "mouseup":
            Buttons.off("mouse" + e.button);
            break;

          case "mouseout":
            Buttons.off("mouse" + e.button);
            break;

          case "mousewheel":
          case "DOMMouseScroll":
            mouseWheel = max(-1, min(1, e.wheelDelta || -e.detail));
            break;

          case "mousemove":
            if (mouseMoveNeedsUpdate) {
                var position = this.mousePosition, delta = this.mouseDelta, element = e.target || e.srcElement, offsetX = element.offsetLeft, offsetY = element.offsetTop;
                mouseLast.x = position.x;
                mouseLast.y = position.y;
                position.x = (e.pageX || e.clientX) - offsetX;
                position.y = (e.pageY || e.clientY) - offsetY;
                delta.x = position.x - mouseLast.x;
                delta.y = position.y - mouseLast.y;
                mouseMoveNeedsUpdate = !1;
            }
        }
    }
    function handleKeys(e) {
        e.preventDefault();
        switch (e.type) {
          case "keydown":
            Buttons.on(keyCodes[e.keyCode]);
            break;

          case "keyup":
            Buttons.off(keyCodes[e.keyCode]);
        }
    }
    var min = Math.min, max = Math.max, abs = Math.abs, sign = Mathf.sign, clamp = Mathf.clamp, addEvent = (Mathf.equals, 
    Dom.addEvent), removeEvent = Dom.removeEvent;
    Class.extend(Input, SharedObject);
    /**
	 * @method init
	 * @memberof Input
	 * @brief attaches events to given element
	 * @param HTMLElement element
	 */
    Input.prototype.init = function(element) {
        this.element = element;
        addEvent(element, "mousedown mouseup mousemove mouseout mousewheel DOMMouseScroll", handleMouse, this);
        addEvent(top, "keydown keyup", handleKeys, this);
    };
    /**
	 * @method clear
	 * @memberof Input
	 * @brief removes events from element
	 * @param HTMLElement element
	 */
    Input.prototype.clear = function() {
        var element = this.element;
        if (element) {
            removeEvent(element, "mousedown mouseup mousemove mouseout mousewheel DOMMouseScroll", handleMouse, this);
            removeEvent(top, "keydown keyup", handleKeys, this);
        }
        this.element = void 0;
    };
    /**
	 * @method update
	 * @memberof Input
	 * @brief called ever frame
	 */
    Input.prototype.update = function() {
        var button, altButton, name, axis, value, pos, neg, tmp, axes = this.axes, list = Buttons.list, dt = Time.delta;
        mouseMoveNeedsUpdate = !0;
        for (name in axes) {
            axis = axes[name];
            value = axis.value;
            switch (axis.type) {
              case Axis.BUTTON:
                button = list[axis.negButton];
                altButton = list[axis.altNegButton];
                neg = button && button.value || altButton && altButton.value;
                button = list[axis.posButton];
                altButton = list[axis.altPosButton];
                pos = button && button.value || altButton && altButton.value;
                break;

              case Axis.MOUSE:
                axis.value = this.mouseDelta[axis.axis];
                continue;

              case Axis.MOUSE_WHEEL:
                value += mouseWheel;
                break;

              default:
                continue;
            }
            neg && (value -= axis.sensitivity * dt);
            pos && (value += axis.sensitivity * dt);
            if (!pos && !neg) {
                tmp = abs(value);
                value -= clamp(sign(value) * axis.gravity * dt, -tmp, tmp);
            }
            value = clamp(value, -1, 1);
            abs(value) <= axis.dead && (value = 0);
            axis.value = value;
        }
        mouseWheel = 0;
    };
    /**
	 * @method addAxis
	 * @memberof Input
	 * @brief adds new axis to axes
	 * @param Object opts
	 */
    Input.prototype.addAxis = function(opts) {
        this.axes[opts.name] = new Axis(opts);
    };
    /**
	 * @method axis
	 * @memberof Input
	 * @brief returns the value of the virtual axis identified by axisName
	 * @param String axisName
	 */
    Input.prototype.axis = function(axisName) {
        var axis = this.axes[axisName];
        return axis && axis.value || 0;
    };
    /**
	 * @method mouseButton
	 * @memberof Input
	 * @brief returns whether the given mouse button is held down
	 * @param Number buttonNum
	 */
    Input.prototype.mouseButton = function(buttonNum) {
        var button = Buttons.list["mouse" + buttonNum];
        return button && button.value;
    };
    /**
	 * @method mouseButtonDown
	 * @memberof Input
	 * @brief returns true during the frame the user pressed the given mouse button
	 * @param Number buttonNum
	 */
    Input.prototype.mouseButtonDown = function(buttonNum) {
        var button = Buttons.list["mouse" + buttonNum];
        return button && button.value && button.frameDown >= Time.frameCount;
    };
    /**
	 * @method mouseButtonUp
	 * @memberof Input
	 * @brief returns true during the frame the user releases the given mouse button
	 * @param Number buttonNum
	 */
    Input.prototype.mouseButtonUp = function(buttonNum) {
        var button = Buttons.list["mouse" + buttonNum];
        return button && button.frameUp >= Time.frameCount;
    };
    /**
	 * @method key
	 * @memberof Input
	 * @brief returns true while the user holds down the key identified by name
	 * @param String name
	 */
    Input.prototype.key = function(name) {
        var button = Buttons.list[name];
        return button && button.value;
    };
    /**
	 * @method keyDown
	 * @memberof Input
	 * @brief returns true during the frame the user starts pressing down the key identified by name
	 * @param String name
	 */
    Input.prototype.keyDown = function(name) {
        var button = Buttons.list[name];
        return button && button.value && button.frameDown >= Time.frameCount;
    };
    /**
	 * @method keyUp
	 * @memberof Input
	 * @brief returns true during the frame the user releases the key identified by name
	 * @param String name
	 */
    Input.prototype.keyUp = function(name) {
        var button = Buttons.list[name];
        return button && button.frameUp >= Time.frameCount;
    };
    /**
	 * @method toJSON
	 * @memberof Input
	 */
    Input.prototype.toJSON = function() {
        var json = this._JSON;
        json.buttons = this.buttons.list;
        json.mousePosition = this.mousePosition;
        json.mouseDelta = this.mouseDelta;
        return json;
    };
    for (var mouseLast = new Vec2(), mouseWheel = 0, mouseMoveNeedsUpdate = !1, keyCodes = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "capslock",
        27: "escape",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "insert",
        46: "delete",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scrolllock",
        186: "semicolon",
        187: "equal",
        188: "comma",
        189: "dash",
        190: "period",
        191: "slash",
        192: "graveaccent",
        219: "openbracket",
        220: "backslash",
        221: "closebraket",
        222: "singlequote"
    }, i = 48; 90 >= i; i++) keyCodes[i] = String.fromCharCode(i).toLowerCase();
    return new Input();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/game", [ "base/class", "base/dom", "base/time", "core/input/input", "core/assets/assets", "core/game/config", "core/renderers/canvasrenderer2d", "core/renderers/webglrenderer2d" ], function(Class, Dom, Time, Input, Assets, Config, CanvasRenderer2D, WebGLRenderer2D) {
    /**
	 * @class Game
	 * @extends Class
	 * @brief Base class for game app
	 * @param Object opts sets Class properties from passed Object
	 */
    function Game(opts) {
        opts || (opts = {});
        Class.call(this);
        Config.host = void 0 !== opts.host ? opts.host : Config.host;
        Config.port = void 0 !== opts.port ? opts.port : Config.port;
        Config.debug = void 0 !== opts.debug ? !!opts.debug : Config.debug;
        Config.forceCanvas = void 0 !== opts.forceCanvas ? !!opts.forceCanvas : Config.forceCanvas;
        /**
	    * @property Config config
	    * @brief game config
	    * @memberof Game
	    */
        this.config = Config;
        /**
	    * @property Scene scene
	    * @brief game's active scene
	    * @memberof Game
	    */
        this.scene = void 0;
        /**
	    * @property Camera camera
	    * @brief game's camera
	    * @memberof Game
	    */
        this.camera = void 0;
        /**
	    * @property Array scenes
	    * @brief game's list of all scenes
	    * @memberof Game
	    */
        this.scenes = [];
        /**
	    * @property WebGLRenderer2D WebGLRenderer2D
	    * @brief reference to WebGL 2D Renderer
	    * @memberof Game
	    */
        this.WebGLRenderer2D = new WebGLRenderer2D(opts);
        /**
	    * @property CanvasRenderer2D CanvasRenderer2D
	    * @brief reference to Canvas 2D Renderer
	    * @memberof Game
	    */
        this.CanvasRenderer2D = new CanvasRenderer2D(opts);
        /**
	    * @property Renderer renderer
	    * @brief reference to game's active renderer
	    * @memberof Game
	    */
        this.renderer = void 0;
        opts.scenes && this.addScenes.apply(this, opts.scenes);
        opts.scene && this.setScene(opts.scene);
        opts.camera && this.setCamera(opts.camera);
    }
    var now = Time.now, MIN_DELTA = 1e-6, MAX_DELTA = 1, requestAnimationFrame = Dom.requestAnimationFrame;
    Class.extend(Game, Class);
    /**
	 * @method init
	 * @memberof Game
	 * @brief call to start game
	 */
    Game.prototype.init = function() {
        var self = this;
        Assets.load(function() {
            self.trigger("init");
            self.animate();
        });
    };
    /**
	 * @method update
	 * @memberof Game
	 * @brief called every frame
	 */
    Game.prototype.update = function() {
        var scene = this.scene;
        if (scene) {
            Time.sinceSceneStart = now() - Time.sceneStart;
            scene.update();
        }
    };
    /**
	 * @method render
	 * @memberof Game
	 * @brief called every frame
	 */
    Game.prototype.render = function() {
        var scene = this.scene, camera = this.camera;
        scene && camera && this.renderer.render(scene, camera);
    };
    /**
	 * @method animate
	 * @memberof Game
	 * @brief calls update and render
	 */
    Game.prototype.animate = function() {
        var fpsTime, frameCount = 0, last = 0, time = 0, delta = 0, fpsDisplay = document.createElement("p"), frames = 0, fpsLast = 0;
        fpsDisplay.style.cssText = [ "z-index: 1000;", "position: absolute;", "margin: 0px;", "padding: 0px;", "color: #ddd;", "text-shadow: 1px 1px #333;", "-webkit-touch-callout: none;", "-webkit-user-select: none;", "-khtml-user-select: none;", "-moz-user-select: moz-none;", "-ms-user-select: none;", "user-select: none;" ].join("\n");
        document.body.appendChild(fpsDisplay);
        return function() {
            Time.frameCount = frameCount++;
            last = time;
            time = now();
            if (Config.debug) {
                fpsTime = 1e3 * time;
                frames++;
                if (fpsTime > fpsLast + 1e3) {
                    fpsDisplay.innerHTML = (1e3 * frames / (fpsTime - fpsLast)).toFixed(3);
                    fpsLast = fpsTime;
                    frames = 0;
                }
            }
            delta = (time - last) * Time.scale;
            Time.delta = MIN_DELTA > delta ? MIN_DELTA : delta > MAX_DELTA ? MAX_DELTA : delta;
            Time.time = time * Time.scale;
            Time.sinceStart = time;
            Input.update();
            this.update();
            this.render();
            requestAnimationFrame(this.animate.bind(this));
        };
    }();
    /**
	 * @method updateRenderer
	 * @memberof Game
	 * @brief updates game's renderer based on scene and webgl capabilities
	 * @param Scene scene
	 */
    Game.prototype.updateRenderer = function(gameObject) {
        this.CanvasRenderer2D.canvas.element.style.display = "none";
        this.WebGLRenderer2D.canvas.element.style.display = "none";
        gameObject.camera2d && (Device.webgl && !Config.forceCanvas ? this.renderer = this.WebGLRenderer2D : Device.canvas ? this.renderer = this.CanvasRenderer2D : console.warn(this + ".updateRenderer: Could not get a renderer for this device"));
        Input.clear();
        Input.init(this.renderer.canvas.element);
        this.renderer.canvas.element.style.display = "block";
    };
    /**
	 * @method setScene
	 * @memberof Game
	 * @brief sets active scene
	 * @param Scene scene
	 */
    Game.prototype.setScene = function(scene) {
        if (scene) {
            var scenes = this.scenes, index = scenes.indexOf(scene);
            if (0 > index) {
                console.warn(this + ".setScene: Scene is not added to Game, adding it...");
                this.addScene(scene);
            }
            Time.sceneStart = now();
            scene.init();
            this.scene = scene;
        } else console.warn(this + ".setScene: Scene is not defined");
    };
    /**
	 * @method setCamera
	 * @memberof Game
	 * @brief sets active camera from gameObjects camera2d or camera3d component
	 * @param GameObject gameObject
	 */
    Game.prototype.setCamera = function(gameObject) {
        if (this.scene) if (gameObject) {
            var camera, scene = this.scene, gameObjects = scene.gameObjects, index = gameObjects.indexOf(gameObject);
            if (0 > index) {
                console.warn(this + ".setCamera: Camera is not added to Scene, adding it...");
                scene.addGameObject(gameObject);
            }
            camera = gameObject.camera2d || gameObject.camera3d;
            if (camera) {
                this.camera = camera;
                this.updateRenderer(gameObject);
            } else console.warn(this + ".setCamera: GameObject does not have a Camera2D or Camera3D Component");
        } else console.warn(this + ".setCamera: Camera is not defined"); else console.warn(this + ".setCamera: needs active scene for camera");
    };
    /**
	 * @method findById
	 * @memberof Game
	 * @brief finds Scene by id
	 * @param Number id
	 * @return Scene
	 */
    Game.prototype.findById = function(id) {
        var scene, i, scenes = this.scenes;
        for (i = scenes.length; i--; ) {
            scene = scenes[i];
            if (scene._id == id) return scene;
        }
        return void 0;
    };
    /**
	 * @method addScenes
	 * @memberof Game
	 * @brief adds all Scenes in arguments to Game
	 */
    Game.prototype.addScenes = function() {
        for (var i = arguments.length; i--; ) this.addScene(arguments[i]);
    };
    /**
	 * @method addScene
	 * @memberof Game
	 * @brief adds Scene to Game
	 * @param Scene scene
	 */
    Game.prototype.addScene = function(scene) {
        if (scene) {
            var scenes = this.scenes, index = scenes.indexOf(scene);
            if (0 > index) {
                scene.game && scene.destroy();
                scene.game = this;
                scenes.push(scene);
            } else console.warn(this + ".addScene: Scene is already added to Game");
        } else console.warn(this + ".addScene: scene is not defined");
    };
    /**
	 * @method add
	 * @memberof Game
	 * @brief same as addScenes
	 */
    Game.prototype.add = Game.prototype.addScenes;
    /**
	 * @method removeScenes
	 * @memberof Game
	 * @brief removes all Scenes in arguments from Game
	 */
    Game.prototype.removeScenes = function() {
        for (var i = arguments.length; i--; ) this.removeScene(arguments[i]);
    };
    /**
	 * @method removeScene
	 * @memberof Game
	 * @brief removes Scene from Game
	 * @param Scene scene
	 */
    Game.prototype.removeScene = function(scene) {
        if (scene) {
            var scenes = this.scenes, index = scenes.indexOf(scene);
            if (index > -1) {
                scene.game = void 0;
                scenes.splice(index, 1);
            } else console.warn(this + ".removeScene: Scene is not a member of Game");
        } else console.warn(this + ".removeScene: scene is not defined");
    };
    /**
	 * @method remove
	 * @memberof Game
	 * @brief same as removeScenes
	 */
    Game.prototype.remove = Game.prototype.removeScenes;
    return Game;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/clientgame", [ "base/class", "base/time", "base/device", "core/input/input", "core/game/config", "core/game/game" ], function(Class, Time, Device, Input, Config, Game) {
    /**
	 * @class ClientGame
	 * @extends Game
	 * @brief Client Game used to join ServerGame
	 * @param Object opts sets Class properties from passed Object
	 */
    function ClientGame(opts) {
        opts || (opts = {});
        Game.call(this, opts);
        /**
	    * @property Number id
	    * @brief unique id of this client
	    * @memberof ClientGame
	    */
        this.id = void 0;
        /**
	    * @property Number lag
	    * @memberof ClientGame
	    */
        this.lag = 0;
        var socket, time, i, self = this;
        /**
	    * @property Object socket
	    * @brief reference to client's socket
	    * @memberof ClientGame
	    */
        this.socket = socket = io.connect("http://" + Config.host, {
            port: Config.port
        });
        socket.on("server_connection", function(id, assets) {
            self.id = id;
            socket.emit("client_connected", Device);
            Assets.fromJSON(assets);
            socket.on("server_syncScenes", function(scenes) {
                for (i = scenes.length; i--; ) self.addScene(new Scene().fromJSON(scenes[i]));
                socket.emit("client_syncScenes");
                self.init();
            });
            socket.on("server_addScene", function(scene) {
                self.addScene(new Scene().fromJSON(scene));
            });
            socket.on("server_addGameObject", function(scene_id, gameObject) {
                var scene = self.findByServerId(scene_id);
                scene && scene.addGameObject(new GameObject().fromJSON(gameObject));
            });
            socket.on("server_addComponent", function(scene_id, gameObject_id) {
                var scene = self.findByServerId(scene_id);
                if (scene) {
                    var gameObject = scene.findByServerId(gameObject_id);
                    gameObject && gameObject.addComponent(new Class.types[gameObject._class].fromJSON(gameObject));
                }
            });
            socket.on("server_removeScene", function(scene_id) {
                self.removeScene(self.findByServerId(scene_id));
            });
            socket.on("server_removeGameObject", function(scene_id, gameObject_id) {
                var scene = self.findByServerId(scene_id);
                scene && scene.removeGameObject(scene.findByServerId(gameObject_id));
            });
            socket.on("server_removeComponent", function(scene_id, gameObject_id, componentType) {
                var scene = self.findByServerId(scene_id);
                if (scene) {
                    var gameObject = scene.findByServerId(gameObject_id);
                    gameObject && gameObject.removeComponent(gameObject.get(componentType));
                }
            });
            socket.on("server_setScene", function(scene_id) {
                self.setScene(self.findByServerId(scene_id));
            });
            socket.on("server_setCamera", function(camera_id) {
                self.scene && self.setCamera(self.scene.findByServerId(camera_id));
            });
            socket.on("server_update", function(timeStamp) {
                time = stamp();
                self.lag = time - timeStamp;
                socket.emit("client_update", Input, time);
            });
            socket.on("server_sync", function(scene) {
                self.scene && self.scene.clientSync(scene);
            });
        });
    }
    var stamp = (Time.now, Time.stamp);
    Class.extend(ClientGame, Game);
    /**
	 * @method findByServerId
	 * @memberof ClientGame
	 * @brief finds Scene by ServerGame's id
	 * @param Number id
	 * @return Scene
	 */
    ClientGame.prototype.findByServerId = function(id) {
        var scene, i, scenes = this.scenes;
        for (i = scenes.length; i--; ) {
            scene = scenes[i];
            if (scene._SERVER_ID === id) return scene;
        }
        return void 0;
    };
    return ClientGame;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/servergame", [ "require", "base/class", "base/time", "core/sharedobject", "core/game/config", "core/game/client" ], function(require, Class, Time, SharedObject, Config, Client) {
    function log() {
        Config.debug && console.log.apply(console, arguments);
    }
    /**
	 * @class ServerGame
	 * @extends Class
	 * @brief used for server side game
	 * @param Object opts sets Class properties from passed Object
	 * @event update called before update
	 * @event lateUpdate called after update
	 */
    function ServerGame(opts) {
        opts || (opts = {});
        Class.call(this, opts);
        Config.host = void 0 !== opts.host ? opts.host : Config.host;
        Config.port = void 0 !== opts.port ? opts.port : Config.port;
        Config.debug = void 0 !== opts.debug ? !!opts.debug : Config.debug;
        Config.forceCanvas = void 0 !== opts.forceCanvas ? !!opts.forceCanvas : Config.forceCanvas;
        /**
	    * @property Config config
	    * @brief game config
	    * @memberof ServerGame
	    */
        this.config = Config;
        /**
	    * @property Array scenes
	    * @brief game's list of all scenes
	    * @memberof ServerGame
	    */
        this.scenes = [];
        /**
	    * @property Object clients
	    * @brief game's list of all clients
	    * @memberof ServerGame
	    */
        this.clients = {};
        /**
	    * @property Object server
	    * @brief reference to http server
	    * @memberof ServerGame
	    */
        this.server = http.createServer(this._onRequest.bind(this));
        this.server.listen(Config.port, Config.host);
        /**
	    * @property Object io
	    * @brief reference to socket.io
	    * @memberof ServerGame
	    */
        this.io = io.listen(this.server);
        var self = this;
        this.io.configure(function() {
            self.io.set("log level", Config.debug ? 2 : 0);
            self.io.set("authorization", function(handshakeData, callback) {
                callback(null, !0);
            });
        });
        this.io.sockets.on("connection", function(socket) {
            var client, clients = self.clients, id = socket.id;
            socket.emit("server_connection", id, Assets);
            socket.on("client_connected", function(device) {
                client = clients[id] = new Client({
                    id: id,
                    socket: socket,
                    device: device,
                    game: self
                });
                socket.emit("server_syncScenes", self.scenes);
                log("ServerGame: new Client id: " + id + " user-agent: " + device.userAgent);
                socket.on("disconnect", function() {
                    self.trigger("client_disconnect", id);
                    log("ServerGame: Client id: " + id + " disconnected");
                });
                socket.on("client_syncScenes", function() {
                    self.trigger("client_init", id);
                });
                socket.on("client_update", function(Input, timeStamp) {
                    var clientInput = client.Input;
                    client.lag = stamp() - timeStamp;
                    clientInput.buttons = Input.buttons;
                    clientInput.mousePosition.copy(Input.mousePosition);
                    clientInput.mouseDelta.copy(Input.mouseDelta);
                });
            });
        });
        opts.scenes && this.addScenes.apply(this, opts.scenes);
    }
    var now = Time.now, stamp = Time.stamp, MIN_DELTA = 1e-6, MAX_DELTA = 1, http = require("http"), url = require("url"), path = require("path"), fs = require("fs"), io = require("socket.io");
    Class.extend(ServerGame, Class);
    /**
	 * @method init
	 * @memberof ServerGame
	 * @brief call this to start game
	 */
    ServerGame.prototype.init = function() {
        this.trigger("init");
        this.animate();
        log("Game started at " + Config.host + ":" + Config.port);
    };
    /**
	 * @method update
	 * @memberof ServerGame
	 * @brief updates scenes and Time
	 */
    ServerGame.prototype.update = function() {
        var i, scenes = this.scenes;
        for (i = scenes.length; i--; ) scenes[i].update();
    };
    /**
	 * @method animate
	 * @memberof ServerGame
	 * @brief starts the game loop called in ServerGame.init
	 */
    ServerGame.prototype.animate = function() {
        var frameCount = 0, last = 0, time = 0, delta = 0, lastUpdate = 0;
        return function() {
            var client, i, sockets = this.io.sockets, clients = this.clients;
            this.scenes;
            Time.frameCount = frameCount++;
            last = time;
            time = now();
            delta = (time - last) * Time.scale;
            Time.delta = MIN_DELTA > delta ? MIN_DELTA : delta > MAX_DELTA ? MAX_DELTA : delta;
            Time.time = time * Time.scale;
            Time.sinceStart = time;
            if (time >= lastUpdate + .05) {
                sockets.emit("server_update", stamp());
                lastUpdate = time;
                for (i in clients) {
                    client = clients[i];
                    client.scene && client.socket.emit("server_sync", client.scene.serverSync());
                }
            }
            for (i in clients) clients[i].update();
            this.update();
            setTimeout(this.animate.bind(this), 1 / 60);
        };
    }();
    /**
	 * @method setScene
	 * @memberof ServerGame
	 * @brief sets client's active scene
	 * @param Client client
	 * @param Scene scene
	 */
    ServerGame.prototype.setScene = function(client, scene) {
        if (client) if (scene) {
            var index = this.scenes.indexOf(scene), socket = this.io.sockets.sockets[client.id];
            if (-1 === index) {
                console.warn("ServerGame.setScene: scene not added to Game, adding it...");
                this.addScene(scene);
            }
            client.scene = scene;
            socket.emit("server_setScene", scene._id);
        } else console.warn(this + ".setCamera: Scene is not defined"); else console.warn(this + ".setScene: Client is not defined");
    };
    /**
	 * @method setCamera
	 * @memberof ServerGame
	 * @brief sets client's active camera from gameObjects camera2d or camera3d component
	 * @param Client client
	 * @param GameObject gameObject
	 */
    ServerGame.prototype.setCamera = function(client, gameObject) {
        if (client) if (gameObject) if (client.scene) {
            var camera, scene = client.scene, index = scene.gameObjects.indexOf(gameObject), socket = this.io.sockets.sockets[client.id];
            if (-1 === index) {
                console.warn("ServerGame.setCamera: camera not added to scene, adding it...");
                scene.add(gameObject);
            }
            camera = gameObject.camera2d || gameObject.camera3d;
            if (camera) {
                client.camera = camera;
                socket.emit("server_setCamera", gameObject._id);
            } else console.warn(this + ".setCamera: GameObject does not have a Camera2D or Camera3D Component");
        } else console.warn(this + ".setCamera: Client needs an active Scene"); else console.warn(this + ".setCamera: GameObject is not defined"); else console.warn(this + ".setCamera: Client is not defined");
    };
    /**
	 * @method addScenes
	 * @memberof ServerGame
	 * @brief adds all Scenes in arguments to Game
	 */
    ServerGame.prototype.addScenes = function() {
        for (var i = arguments.length; i--; ) this.addScene(arguments[i]);
    };
    /**
	 * @method addScene
	 * @memberof ServerGame
	 * @brief adds Scene to Game
	 * @param Scene scene
	 */
    ServerGame.prototype.addScene = function(scene) {
        if (scene) {
            var sockets = this.io.sockets, scenes = this.scenes, index = scenes.indexOf(scene);
            if (0 > index) {
                scene.game && scene.destroy();
                scene.game = this;
                scenes.push(scene);
                scene.on("addGameObject", function(gameObject) {
                    sockets.emit("server_addGameObject", scene._id, gameObject);
                    gameObject.on("addComponent", function(component) {
                        component instanceof SharedObject && sockets.emit("server_addComponent", scene._id, gameObject._id, component);
                    });
                });
                scene.on("removeGameObject", function(gameObject) {
                    gameObject.off("addComponent");
                    gameObject.off("removeComponent");
                    sockets.emit("server_removeGameObject", scene._id, gameObject._id);
                    gameObject.on("removeComponent", function(component) {
                        component instanceof SharedObject && sockets.emit("server_removeComponent", scene._id, gameObject._id, component._class);
                    });
                });
                sockets.emit("server_addScene", scene);
            } else console.warn(this + ".addScene: Scene is already added to Game");
        } else console.warn(this + ".addScene: scene is not defined");
    };
    /**
	 * @method add
	 * @memberof ServerGame
	 * @brief same as addScenes
	 */
    ServerGame.prototype.add = ServerGame.prototype.addScenes;
    /**
	 * @method removeScenes
	 * @memberof ServerGame
	 * @brief removes all Scenes in arguments from Game
	 */
    ServerGame.prototype.removeScenes = function() {
        for (var i = arguments.length; i--; ) this.removeScene(arguments[i]);
    };
    /**
	 * @method removeScene
	 * @memberof ServerGame
	 * @brief removes Scene from ServerGame
	 * @param Scene scene
	 */
    ServerGame.prototype.removeScene = function(scene) {
        if (scene) {
            var scenes = this.scenes, index = scenes.indexOf(scene);
            if (index > -1) {
                scene.game = void 0;
                scenes.splice(index, 1);
                scene.off("addGameObject");
                scene.off("removeGameObject");
                sockets.emit("server_removeScene", scene._id);
            } else console.warn(this + ".removeScene: Scene is not a member of Game");
        } else console.warn(this + ".removeScene: scene is not defined");
    };
    /**
	 * @method remove
	 * @memberof ServerGame
	 * @brief same as removeScenes
	 */
    ServerGame.prototype.remove = ServerGame.prototype.removeScenes;
    ServerGame.prototype._onRequest = function() {
        var mimeTypes = {
            txt: "text/plain",
            html: "text/html",
            css: "text/css",
            xml: "application/xml",
            json: "application/json",
            js: "application/javascript",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            png: "image/png",
            svg: "image/svg+xml"
        };
        return function(req, res) {
            var uri = url.parse(req.url).pathname, filename = path.join(process.cwd(), uri), mime = mimeTypes[uri.split(".").pop()] || "text/plain";
            fs.exists(filename, function(exists) {
                if (exists) {
                    if (fs.statSync(filename).isDirectory()) {
                        filename += "index.html";
                        mime = "text/html";
                    }
                    fs.readFile(filename, function(error, file) {
                        log(req.method + ": " + filename + " " + mime);
                        if (error) {
                            res.writeHead(500, {
                                "Content-Type": "text/plain"
                            });
                            res.write(err + "\n");
                            res.end();
                        } else {
                            res.writeHead(200, {
                                "Content-Type": mime
                            });
                            res.write(file, mime);
                            res.end();
                        }
                    });
                } else {
                    res.writeHead(404, {
                        "Content-Type": "text/plain"
                    });
                    res.write("404 Not Found");
                    res.end();
                }
            });
        };
    }();
    return ServerGame;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/gameobject", [ "base/class", "core/sharedobject" ], function(Class, SharedObject) {
    /**
	 * @class GameObject
	 * @extends SharedObject
	 * @brief Base class for all entities in scenes
	 * @param Object opts sets Class properties from passed Object
	 */
    function GameObject(opts) {
        opts || (opts = {});
        SharedObject.call(this);
        /**
	    * @property Scene scene
	    * @brief reference to scene GameObject is a member of
	    * @memberof GameObject
	    */
        this.scene = void 0;
        /**
	    * @property Array tags
	    * @brief array of tags on this object
	    * @memberof GameObject
	    */
        this.tags = [];
        /**
	    * @property Object components
	    * @brief holds all components attached to GameObject
	    * @memberof GameObject
	    */
        this.components = {};
        this.camera2d = void 0;
        this.emitter2d = void 0;
        this.rigidbody2d = void 0;
        this.sprite2d = void 0;
        this.transform2d = void 0;
        opts.components && this.addComponents.apply(this, opts.components);
        opts.tags && this.addTags.apply(this, opts.tags);
    }
    Class.extend(GameObject, SharedObject);
    /**
	 * @method init
	 * @memberof GameObject
	 * @brief called when added to Scene
	 */
    GameObject.prototype.init = function() {
        var component, key, components = this.components;
        for (key in components) {
            component = components[key];
            component.init();
            component.trigger("init");
        }
        this.trigger("init");
    };
    /**
	 * @method update
	 * @memberof GameObject
	 * @brief called every frame
	 */
    GameObject.prototype.update = function() {
        var component, key, components = this.components;
        for (key in components) {
            component = components[key];
            component.update();
            component.trigger("update");
        }
        this.trigger("update");
    };
    /**
	 * @method destroy
	 * @memberof GameObject
	 * @brief removes this from Scene
	 */
    GameObject.prototype.destroy = function() {
        var scene = this.scene;
        scene ? scene.removeGameObject(this) : console.warn(this + ".destroy: GameObject is not added to a Scene");
        this.trigger("destroy");
    };
    /**
	 * @method addComponents
	 * @memberof GameObject
	 * @brief adds all Components in arguments to GameObject
	 */
    GameObject.prototype.addComponents = function() {
        for (var i = arguments.length; i--; ) this.addComponent(arguments[i]);
    };
    /**
	 * @method addComponent
	 * @memberof GameObject
	 * @brief adds Component to GameObject
	 * @param Component component
	 */
    GameObject.prototype.addComponent = function(component) {
        if (component) {
            var components = this.components, type = "" + component, index = components[type];
            if (index) console.warn(this + ".addComponent: GameObject already has a " + component); else {
                component.gameObject && (component = component.clone());
                component.gameObject = this;
                components[type] = component;
                if (this.scene) {
                    component.init();
                    component.trigger("init");
                }
                this[type.toLowerCase()] = component;
            }
            this.trigger("addComponent", component);
        } else console.warn(this + ".addComponent: Component is not defined");
    };
    /**
	 * @method add
	 * @memberof GameObject
	 * @brief same as addComponents
	 */
    GameObject.prototype.add = GameObject.prototype.addComponents;
    /**
	 * @method removeComponents
	 * @memberof GameObject
	 * @brief removes all Components in arguments from GameObject
	 */
    GameObject.prototype.removeComponents = function() {
        for (var i = arguments.length; i--; ) this.removeComponent(arguments[i]);
    };
    /**
	 * @method removeComponent
	 * @memberof GameObject
	 * @brief removes Component from GameObject
	 * @param Component component
	 */
    GameObject.prototype.removeComponent = function(component) {
        if (component) {
            var components = this.components, type = "" + component, index = components[type];
            if (index) {
                component.gameObject = void 0;
                components[type] = void 0;
                this[type.toLowerCase()] = void 0;
            } else console.warn(this + ".removeComponent: GameObject does not have a " + component);
            this.trigger("removeComponent", component);
        } else console.warn(this + ".removeComponent: Component is not defined");
    };
    /**
	 * @method remove
	 * @memberof GameObject
	 * @brief same as removeComponents
	 */
    GameObject.prototype.remove = GameObject.prototype.removeComponents;
    /**
	 * @method getComponent
	 * @memberof GameObject
	 * @brief gets Component
	 * @param String type
	 * @returns Component
	 */
    GameObject.prototype.getComponent = function(type) {
        return this.components[type];
    };
    /**
	 * @method hasComponent
	 * @memberof GameObject
	 * @brief checks if GameObject has Component type
	 * @param String type
	 * @returns Boolean
	 */
    GameObject.prototype.hasComponent = function(type) {
        return !!this.components[type];
    };
    /**
	 * @method addTags
	 * @memberof GameObject
	 * @brief adds all tags in arguments to GameObject
	 */
    GameObject.prototype.addTags = function() {
        for (var i = arguments.length; i--; ) this.addTag(arguments[i]);
    };
    /**
	 * @method addTag
	 * @memberof GameObject
	 * @brief adds tag to GameObject
	 * @param Component component
	 */
    GameObject.prototype.addTag = function(tag) {
        if (tag) {
            var tags = this.tags, index = tags.indexOf(tag);
            0 > index && tags.push(tag);
        } else console.warn(this + ".addTag: tag is not defined");
    };
    /**
	 * @method removeTags
	 * @memberof GameObject
	 * @brief removes all tags in arguments from GameObject
	 */
    GameObject.prototype.removeTags = function() {
        for (var i = arguments.length; i--; ) this.removeTag(arguments[i]);
    };
    /**
	 * @method removeTag
	 * @memberof GameObject
	 * @brief removes tag from GameObject
	 * @param Component component
	 */
    GameObject.prototype.removeTag = function(tag) {
        if (tag) {
            var tags = this.tags, index = tags.indexOf(tag);
            index > -1 && tags.splice(index, 1);
        } else console.warn(this + ".removeTag: tag is not defined");
    };
    /**
	 * @method hasTag
	 * @memberof GameObject
	 * @brief checks if GameObject has tag
	 * @param String tag
	 */
    GameObject.prototype.hasTag = function(tag) {
        return this.tags.indexOf(tag) > -1;
    };
    /**
	 * @method clear
	 * @memberof GameObject
	 * @brief clears all tags and components from object
	 */
    GameObject.prototype.clear = function() {
        var i, components = this.components, tags = this.tags;
        for (i = tags.length; i--; ) this.removeTag(tags[i]);
        for (i in components) this.removeComponent(components[i]);
    };
    GameObject.prototype.toJSON = function() {
        var component, i, json = this._JSON, components = this.components, tags = this.tags;
        json._class = this._class;
        json._SERVER_ID = this._id;
        json.components = json.components || [];
        json.components.length = 0;
        for (i in components) {
            component = components[i];
            component instanceof SharedObject && json.components.push(component.toJSON());
        }
        json.tags = json.tags || [];
        json.tags.length = 0;
        for (i = tags.length; i--; ) json.tags[i] = tags[i];
        return json;
    };
    GameObject.prototype.fromJSON = function(json) {
        var component, i, components = json.components;
        this._SERVER_ID = json._SERVER_ID;
        for (i = components.length; i--; ) {
            component = components[i];
            this.addComponent(new Class.types[component._class]().fromJSON(component));
        }
        this.addTags.apply(this, json.tags);
        return this;
    };
    return GameObject;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/scene", [ "base/class", "core/sharedobject", "core/gameobject", "core/world/world" ], function(Class, SharedObject, GameObject, World) {
    /**
	 * @class Scene
	 * @extends SharedObject
	 * @brief Scene manager for GameObjects
	 * @param Object opts sets Class properties from passed Object
	 */
    function Scene(opts) {
        opts || (opts = {});
        SharedObject.call(this);
        this._SYNC = {};
        /**
	    * @property Game game
	    * @brief reference to game Scene is a member of
	    * @memberof Scene
	    */
        this.game = void 0;
        /**
	    * @property Array gameObjects
	    * @memberof Scene
	    */
        this.gameObjects = [];
        /**
	    * @property Object components
	    * @brief list of component types within scene
	    * @memberof Scene
	    */
        this.components = {};
        this.camera2d = void 0;
        this.emitter2d = void 0;
        this.rigidbody2d = void 0;
        this.sprite2d = void 0;
        this.transform2d = void 0;
        /**
	    * @property Object sortFunctions
	    * @brief list of component sort functions, defaults to sorting by reference
	    * @memberof Scene
	    */
        this.sortFunctions = {
            Sprite2D: function(a, b) {
                return b.z - a.z;
            }
        };
        /**
	    * @property Object addFunctions
	    * @brief list of functions for conponents when a GameObject is added to scene
	    * @memberof Scene
	    */
        this.addFunctions = {
            Rigidbody2D: function(component) {
                return this.world.add(component);
            }
        };
        /**
	    * @property Object removeFunctions
	    * @brief list of functions for conponents when a GameObject is removed from scene
	    * @memberof Scene
	    */
        this.removeFunctions = {
            Rigidbody2D: function(component) {
                return this.world.remove(component);
            }
        };
        /**
	    * @property World world
	    * @memberof Scene
	    */
        this.world = void 0 !== opts.world ? opts.world : new World(opts);
        opts.gameObjects && this.addGameObjects.apply(this, opts.gameObjects);
    }
    Class.extend(Scene, SharedObject);
    /**
	 * @method init
	 * @memberof Scene
	 * @brief called when added to Game
	 */
    Scene.prototype.init = function() {
        var i, gameObjects = this.gameObjects;
        for (i = gameObjects.length; i--; ) gameObjects[i].init();
        this.trigger("init");
    };
    /**
	 * @method update
	 * @memberof Scene
	 * @brief called every frame
	 */
    Scene.prototype.update = function() {
        var i, gameObjects = this.gameObjects;
        this.world.update();
        for (i = gameObjects.length; i--; ) gameObjects[i].update();
        this.trigger("update");
    };
    /**
	 * @method destroy
	 * @memberof Scene
	 * @brief removes this from Game
	 */
    Scene.prototype.destroy = function() {
        var game = this.game;
        game ? game.removeScene(this) : console.warn(this + ".destroy: Scene is not added to Game");
        this.trigger("destroy");
    };
    /**
	 * @method addGameObjects
	 * @memberof Scene
	 * @brief adds all GameObjects in arguments to Scene
	 */
    Scene.prototype.addGameObjects = function() {
        for (var i = arguments.length; i--; ) this.addGameObject(arguments[i]);
    };
    /**
	 * @method addGameObject
	 * @memberof Scene
	 * @brief adds GameObject to Scene
	 * @param GameObject gameObject
	 */
    Scene.prototype.addGameObject = function(gameObject) {
        if (gameObject) {
            var types, comps, comp, lowerCaseComp, key, gameObjects = this.gameObjects, index = gameObjects.indexOf(gameObject), sortFunctions = this.sortFunctions, addFunctions = this.addFunctions, components = this.components;
            if (0 > index) {
                gameObject.scene && gameObject.destroy();
                gameObject.scene = this;
                gameObjects.push(gameObject);
                this.game && gameObject.init();
                comps = gameObject.components;
                for (key in comps) {
                    comp = comps[key];
                    lowerCaseComp = key.toLowerCase();
                    types = components[key] = components[key] || [];
                    types.push(comp);
                    sortFunctions[key] || (sortFunctions[key] = this.sort);
                    types.sort(sortFunctions[key]);
                    this[lowerCaseComp] || (this[lowerCaseComp] = types);
                    addFunctions[key] && addFunctions[key].call(this, comp);
                }
                this.trigger("addGameObject", gameObject);
            } else console.warn(this + ".addGameObject: GameObject is already added to Scene");
        } else console.warn(this + ".addGameObject: GameObject is not defined");
    };
    /**
	 * @method add
	 * @memberof Scene
	 * @brief same as addGameObjects
	 */
    Scene.prototype.add = Scene.prototype.addGameObjects;
    /**
	 * @method clear
	 * @memberof Scene
	 * @brief removes all GameObjects in Scene
	 */
    Scene.prototype.clear = function() {
        var i, gameObjects = this.gameObjects;
        for (i = gameObjects.length; i--; ) this.removeGameObject(gameObjects[i]);
    };
    /**
	 * @method removeGameObjects
	 * @memberof Scene
	 * @brief removes all GameObjects in arguments from Scene
	 */
    Scene.prototype.removeGameObjects = function() {
        for (var i = arguments.length; i--; ) this.removeGameObject(arguments[i]);
    };
    /**
	 * @method removeGameObject
	 * @memberof Scene
	 * @brief removes GameObject from Scene
	 * @param GameObject gameObject
	 */
    Scene.prototype.removeGameObject = function(gameObject) {
        if (gameObject) {
            var types, comps, comp, key, gameObjects = this.gameObjects, index = gameObjects.indexOf(gameObject), sortFunctions = this.sortFunctions, removeFunctions = this.removeFunctions, components = this.components;
            if (index > -1) {
                gameObject.scene = void 0;
                gameObjects.splice(index, 1);
                comps = gameObject.components;
                for (key in comps) {
                    comp = comps[key];
                    types = components[key] = components[key] || [];
                    types.splice(types.indexOf(comp), 1);
                    types.sort(sortFunctions[key]);
                    removeFunctions[key] && removeFunctions[key].call(this, comp);
                }
                this.trigger("removeGameObject", gameObject);
            } else console.warn(this + ".removeGameObject: GameObject is not a member of Scene");
        } else console.warn(this + ".removeGameObject: GameObject is not defined");
    };
    /**
	 * @method remove
	 * @memberof Scene
	 * @brief same as removeGameObjects
	 */
    Scene.prototype.remove = Scene.prototype.removeGameObjects;
    /**
	 * @method sort
	 * @memberof Scene
	 * @brief default sort function for all components
	 */
    Scene.prototype.sort = function(a, b) {
        return a === b ? 1 : -1;
    };
    /**
	 * @method findByTag
	 * @memberof Scene
	 * @brief finds GameObjects by tag
	 * @param String tag
	 * @param Array results
	 * @return Array
	 */
    Scene.prototype.findByTag = function() {
        var array = [];
        return function(tag, results) {
            array.length = 0;
            results || (results = array);
            var gameObject, i, gameObjects = this.gameObjects;
            for (i = gameObjects.length; i--; ) {
                gameObject = gameObjects[i];
                gameObject.hasTag(tag) && results.push(gameObject);
            }
            return results;
        };
    }();
    /**
	 * @method findById
	 * @memberof Scene
	 * @brief finds GameObject by id
	 * @param Number id
	 * @return GameObject
	 */
    Scene.prototype.findById = function(id) {
        var gameObject, i, gameObjects = this.gameObjects;
        for (i = gameObjects.length; i--; ) {
            gameObject = gameObjects[i];
            if (gameObject._id == id) return gameObject;
        }
        return void 0;
    };
    /**
	 * @method findByServerId
	 * @memberof Scene
	 * @brief finds GameObject by ServerGame's id
	 * @param Number id
	 * @return GameObject
	 */
    Scene.prototype.findByServerId = function(id) {
        var gameObject, i, gameObjects = this.gameObjects;
        for (i = gameObjects.length; i--; ) {
            gameObject = gameObjects[i];
            if (gameObject._SERVER_ID == id) return gameObject;
        }
        return void 0;
    };
    /**
	 * @method findComponentById
	 * @memberof Scene
	 * @brief finds Component by id
	 * @param String type
	 * @param Number id
	 * @return GameObject
	 */
    Scene.prototype.findComponentById = function(type, id) {
        var component, i, components = this[type];
        if (!components) return void 0;
        for (i = components.length; i--; ) {
            component = components[i];
            if (component._id == id) return component;
        }
        return void 0;
    };
    /**
	 * @method findComponentByServerId
	 * @memberof Scene
	 * @brief finds Component by ServerGame's id
	 * @param String type
	 * @param Number id
	 * @return GameObject
	 */
    Scene.prototype.findComponentByServerId = function(type, id) {
        var component, i, components = this[type];
        if (!components) return void 0;
        for (i = components.length; i--; ) {
            component = components[i];
            if (component._SERVER_ID == id) return component;
        }
        return void 0;
    };
    Scene.prototype.serverSync = function() {
        var transform2d, transform, i, sync = this._SYNC, t2d = this.transform2d;
        transform2d = sync.transform2d = sync.transform2d || {};
        for (i = t2d.length; i--; ) {
            transform = t2d[i];
            transform2d[transform._id] = transform.toJSON();
        }
        return sync;
    };
    Scene.prototype.clientSync = function(scene) {
        var transform, t, i, transform2d = scene.transform2d;
        this.transform2d;
        for (i in transform2d) {
            transform = transform2d[i];
            t = this.findComponentByServerId("transform2d", i);
            t && t.clientSync(transform);
        }
    };
    Scene.prototype.toJSON = function() {
        var i, json = this._JSON, gameObjects = this.gameObjects;
        json._class = this._class;
        json._SERVER_ID = this._id;
        json.gameObjects = json.gameObjects || [];
        json.gameObjects.length = 0;
        for (i = gameObjects.length; i--; ) json.gameObjects[i] = gameObjects[i].toJSON();
        return json;
    };
    Scene.prototype.fromJSON = function(json) {
        var i, gameObjects = json.gameObjects;
        this._SERVER_ID = json._SERVER_ID;
        for (i = gameObjects.length; i--; ) this.addGameObject(new GameObject().fromJSON(gameObjects[i]));
        return this;
    };
    return Scene;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("odindoc", [ "require", "base/class", "base/device", "base/dom", "base/objectpool", "base/time", "base/utils", "math/aabb2", "math/aabb3", "math/color", "math/line2", "math/mat2", "math/mat3", "math/mat32", "math/mat4", "math/mathf", "math/quat", "math/vec2", "math/vec3", "math/vec4", "core/assets/asset", "core/assets/assets", "core/assets/imageasset", "core/assets/spritesheetasset", "core/components/camera2d", "core/components/component", "core/components/rigidbody2d", "core/components/sprite2d", "core/components/transform2d", "core/renderers/canvasrenderer2d", "core/renderers/webglrenderer2d", "core/world/world", "core/game/client", "core/game/clientgame", "core/game/config", "core/game/game", "core/game/servergame", "core/input/input", "core/canvas", "core/gameobject", "core/scene", "phys2d/phys2d" ], function(require) {
    /**
	* @library Odin.js
	* @version 0.0.12
	* @brief Node.js Canvas/WebGL Javascript Game Engine
	*/
    /**
	 * @class Odin
	 * @brief Holds all Classes
	 */
    var Odin = {};
    /**
	 * @method globalize
	 * @memberof Odin
	 * @brief globalizes Odin Classes
	 */
    Odin.globalize = function() {
        for (var key in this) window[key] = this[key];
        window.Odin = this;
    };
    /**
	 * @method test
	 * @memberof Odin
	 * @brief test function a nth numeber of times and console.logs the time it took
	 * @param String name
	 * @param Number times
	 * @param Function fn
	 */
    Odin.test = function() {
        var start, i, now = Date.now;
        return function(name, times, fn) {
            start = now();
            for (i = 0; times > i; i++) fn();
            console.log(name + ": " + (now() - start) + "ms");
        };
    }();
    Odin.Class = require("base/class");
    Odin.Device = require("base/device");
    Odin.Dom = require("base/dom");
    Odin.ObjectPool = require("base/objectpool");
    Odin.Time = require("base/time");
    Odin.Utils = require("base/utils");
    Odin.AABB2 = require("math/aabb2");
    Odin.AABB3 = require("math/aabb3");
    Odin.Color = require("math/color");
    Odin.Line2 = require("math/line2");
    Odin.Mat2 = require("math/mat2");
    Odin.Mat3 = require("math/mat3");
    Odin.Mat32 = require("math/mat32");
    Odin.Mat4 = require("math/mat4");
    Odin.Mathf = require("math/mathf");
    Odin.Quat = require("math/quat");
    Odin.Vec2 = require("math/vec2");
    Odin.Vec3 = require("math/vec3");
    Odin.Vec4 = require("math/vec4");
    Odin.Asset = require("core/assets/asset");
    Odin.Assets = require("core/assets/assets");
    Odin.ImageAsset = require("core/assets/imageasset");
    Odin.SpriteSheetAsset = require("core/assets/spritesheetasset");
    Odin.Camera2D = require("core/components/camera2d");
    Odin.Component = require("core/components/component");
    Odin.Rigidbody2D = require("core/components/rigidbody2d");
    Odin.Sprite2D = require("core/components/sprite2d");
    Odin.Transform2D = require("core/components/transform2d");
    Odin.CanvasRenderer2D = require("core/renderers/canvasrenderer2d");
    Odin.WebGLRenderer2D = require("core/renderers/webglrenderer2d");
    Odin.World = require("core/world/world");
    Odin.Client = require("core/game/client");
    Odin.ClientGame = require("core/game/clientgame");
    Odin.Config = require("core/game/config");
    Odin.Game = require("core/game/game");
    Odin.ServerGame = require("core/game/servergame");
    Odin.Input = require("core/input/input");
    Odin.Canvas = require("core/canvas");
    Odin.GameObject = require("core/gameobject");
    Odin.Scene = require("core/scene");
    Odin.Phys2D = require("phys2d/phys2d");
    return Odin;
});